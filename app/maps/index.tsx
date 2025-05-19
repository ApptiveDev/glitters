import BottomSheet from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'app/_layout';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SvgProps } from 'react-native-svg';
import Toast from 'react-native-toast-message';

import { createChat } from '@/api/chat';
import { addLike, deleteMarker, getBoundMarkers, getMarkers } from '@/api/markers';
import { getPostById } from '@/api/posts';
import HeartIcon from '@/assets/icons/3d/heart.svg';
import BubbleIcon from '@/assets/icons/bubble.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import GlitterBlueIcon from '@/assets/icons/glitter_blue.svg';
import MarkerBySelfIcon from '@/assets/icons/marker/marker_by_self.png';
import SendIcon from '@/assets/icons/send.svg';
import SimpleExitIcon from '@/assets/icons/simple_exit.svg';
import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import { CustomTextArea } from '@/components/common/TextArea';
import CustomBottomSheet from '@/components/features/BottomSheet';
import { ClusteredMarkerModal } from '@/components/features/ClusteredMarkerModal';
import Loading from '@/components/features/Loading';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { GetPostResponseType } from '@/types/post';
import { getCurrentLocation } from '@/utils/getCurrentLocation';
import { markerIcons } from '@/utils/markerIcons';
import { isOutOfBound } from '@/utils/markers';
import { threeDIcons } from '@/utils/threeDIcons';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(300);
  const [hasAnimatedBack, setHasAnimatedBack] = useState(false);
  const { insetBottom } = useLayout();
  const [sendChatModalVisible, setSendChatModalVisible] = useState(false);

  const { bound, setBound } = usePost();
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [post, setPost] = useState<GetPostResponseType>();
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<any>(null);
  const [clusterPosts, setClusterPosts] = useState<GetPostResponseType[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const { user } = useUser();
  const [message, setMessage] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers'],
    queryFn: getMarkers,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const PostIcon = useMemo(() => {
    if (post?.iconIdx == null) return HeartIcon;

    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(post.iconIdx);

    return iconsArray[index] ?? HeartIcon;
  }, [post?.iconIdx]);

  const handleButtonPress = () => {
    router.push({
      pathname: '/maps/create',
      params: {
        currentLat: String(currentPosition?.latitude),
        currentLon: String(currentPosition?.longitude),
      },
    });
  };

  useEffect(() => {
    if (!user) return;
    const fetchBound = async () => {
      try {
        const response = await getBoundMarkers();
        setBound(response[user.institution.id]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        Alert.alert('오류', errorMessage);
      }
    };

    fetchBound();
  }, [setBound, user, user.institution.id]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!bound) return;
      const { location, errorMsg } = await getCurrentLocation({ bound });
      if (location) {
        setCurrentPosition(location);
      } else {
        Alert.alert('위치 정보 오류', errorMsg || '위치 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchLocation();
  }, [bound]);

  useEffect(() => {
    if (post) {
      setIsVisible(true);
    }
  }, [post]);

  if (!currentPosition || isLoading || !markers) {
    return <Loading />;
  }

  if (!bound) {
    return <Loading />;
  }

  const onPressMarker = async (marker: MarkerType) => {
    const response = await getPostById(marker);
    setPost(response);
  };

  const handleMapPress = () => {
    bottomSheetRef.current?.close();
  };

  const onPressBottomButton = async ({ isWrittenBySelf, postId }: { isWrittenBySelf: boolean; postId: number }) => {
    if (!isWrittenBySelf) {
      await addLike(postId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLikedBySelf: true,
              likeCount: prev.likeCount + 1,
            }
          : undefined,
      );
    }
  };

  const goToReportPage = () => {
    router.push({
      pathname: '/report',
      params: {
        postId: post?.id,
        reportType: 'POST_REPORT',
      },
    });
  };

  const handleConfirmDelete = async (postId: number) => {
    try {
      setIsVisible(false);
      setPost(undefined);

      await deleteMarker(postId);
      await queryClient.invalidateQueries({ queryKey: ['markers'] });

      router.replace('/maps');
    } catch {
      Alert.alert('삭제 중 문제가 발생했어요.');
    }
  };

  const handleDeletePost = (postId: number, isWrittenBySelf: boolean) => {
    if (isWrittenBySelf) {
      Alert.alert('삭제하시겠어요?', '삭제된 반짝이는 다시 복구되지 않아요', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => handleConfirmDelete(postId),
        },
      ]);
    } else {
      Alert.alert('신고하시겠어요?', '', [
        {
          text: '확인',
          onPress: goToReportPage,
        },
      ]);
    }
  };

  const handleClusterPress = async (cluster: any, geoJsonMarkers: any[] = []) => {
    const matchedMarkers = geoJsonMarkers
      .map((geoMarker) => {
        const coord = geoMarker.properties.coordinate;
        return markers.find(
          (original) =>
            Math.abs(original.latitude - coord.latitude) < 0.00001 &&
            Math.abs(original.longitude - coord.longitude) < 0.00001,
        );
      })
      .filter((m): m is MarkerType => !!m);

    const seen = new Set<number>();
    const uniqueMarkers = matchedMarkers.filter((marker) => {
      if (seen.has(marker.postId)) return false;
      seen.add(marker.postId);
      return true;
    });

    const posts = await Promise.all(uniqueMarkers.map((m) => getPostById({ postId: m.postId })));

    setClusterPosts(posts);
    setIsListOpen(true);
  };

  const startChat = async () => {
    if (!post) return;
    try {
      await createChat({
        postId: post?.id,
        content: message,
      });
      setMessage('');
      setSendChatModalVisible(false);
      Toast.show({
        type: 'success',
        text1: '쪽지를 보냈어요',
        text2: '상대방이 확인할 수 있어요.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
      setMessage('');
      setSendChatModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        maxZoomLevel={18}
        maxZoom={18}
        minZoom={0}
        minZoomLevel={15}
        tracksViewChanges={false}
        preserveClusterPressBehavior
        showsUserLocation
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          const { latitude, longitude } = region;
          if (isOutOfBound(latitude, longitude, bound) && !hasAnimatedBack) {
            setHasAnimatedBack(true);
            Alert.alert('지도 범위를 벗어났어요', '기본 위치로 돌아가요.', [
              {
                text: '확인',
                onPress: () => {
                  setHasAnimatedBack(false);
                },
              },
            ]);
            mapRef.current?.animateToRegion({
              latitude: bound.defaultLat,
              longitude: bound.defaultLon,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
        ref={mapRef}
        clusterColor={colors.primary.main}
        onClusterPress={handleClusterPress}
      >
        {markers &&
          markers
            .filter((marker): marker is MarkerType => !!marker)
            .map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={() => onPressMarker(marker)}
              >
                {marker.isWrittenBySelf ? (
                  <Image source={MarkerBySelfIcon} style={{ width: 40, height: 40 }} />
                ) : (
                  <Image source={markerIcons[marker.markerIdx].icon} style={{ width: 40, height: 40 }} />
                )}
              </Marker>
            ))}
      </MapView>

      <CustomBottomSheet isVisible={isVisible} height={contentHeight} onClose={() => setIsVisible(false)}>
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            setContentHeight(measuredHeight);
          }}
          style={{ paddingTop: 16, gap: 12, alignItems: 'center', position: 'relative' }}
        >
          <PostIcon
            width={292}
            height={292}
            style={{
              position: 'absolute',
              top: 40,
              zIndex: 0,
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
            <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', flexShrink: 1, marginBottom: 8 }}>
              {post?.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GlitterIcon width={16} height={16} />
                <Text style={{ color: colors.text.white, marginLeft: 4 }}>{post?.likeCount}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <EyeIcon width={16} height={16} />
                <Text style={{ color: colors.text.white, marginLeft: 4 }}>{post?.viewCount}</Text>
              </View>
            </View>
          </View>
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              backgroundColor: 'rgba(74, 87, 137, 0.2)',
              width: '100%',
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(251, 251, 251, 0.2)',
            }}
          >
            <CustomTextArea
              value={post?.content || ''}
              multiline
              onChangeText={() => {}}
              height={184}
              numberOfLines={10}
              editable={false}
            />
          </BlurView>
          {!post?.isWrittenBySelf ? (
            <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
              <CommonButton
                title=""
                variant={post?.isLikedBySelf ? 'primary' : 'view'}
                onPress={() =>
                  onPressBottomButton({
                    isWrittenBySelf: post?.isWrittenBySelf ?? false,
                    postId: post?.id ?? 0,
                  })
                }
                buttonIcon={post?.isLikedBySelf ? <GlitterBlueIcon /> : <GlitterIcon />}
                disabled={post?.isLikedBySelf}
                style={{
                  flex: 1,
                }}
              />
              <CommonButton
                title="  채팅하기"
                variant="view"
                onPress={() => setSendChatModalVisible(true)}
                buttonIcon={<BubbleIcon />}
                style={{
                  flex: 6,
                }}
              />
            </View>
          ) : (
            <CommonButton
              title="  당신의 반짝이가 이 글을 읽고 있을 지도 몰라요"
              variant="view"
              onPress={() => {
                Alert.alert('내가 쓴 글이에요.');
              }}
              buttonIcon={<GlitterIcon />}
              fontSize={12}
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Text
              style={{ fontSize: 12, color: colors.text.lightgray }}
              onPress={() => handleDeletePost(post?.id ?? 0, post?.isWrittenBySelf ?? false)}
            >
              {post?.isWrittenBySelf ? '게시글 삭제하기' : '게시글 신고하기'}
            </Text>
          </View>
        </View>
      </CustomBottomSheet>
      <CommonButton
        title="반짝이 기록하기"
        onPress={handleButtonPress}
        variant="maps"
        style={{
          position: 'absolute',
          bottom: isVisible ? 96 - insetBottom + 16 + contentHeight + 40 : 120 - insetBottom + 16,
          left: '50%',
          transform: [{ translateX: -70 }],
          borderWidth: 0,
        }}
        fontSize={16}
        buttonIcon={<GlitterIcon width={20} height={20} style={{ marginRight: 3 }} />}
      />
      <ClusteredMarkerModal
        isVisible={isListOpen}
        clusterPosts={clusterPosts}
        setPost={setPost}
        setIsVisible={setIsVisible}
        setIsListOpen={setIsListOpen}
      />
      <Modal
        animationType="fade"
        transparent
        visible={sendChatModalVisible}
        onRequestClose={() => {
          setSendChatModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              width: '80%',
              height: 200,
              backgroundColor: colors.background,
              borderRadius: 12,
              paddingVertical: 25,
              paddingHorizontal: 28,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: colors.text.white,
                fontWeight: 'bold',
              }}
            >
              채팅 시작하기
            </Text>
            <Spacing height={25} />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                height: 24,
                marginBottom: 16,
              }}
            >
              <Image
                source={post?.isWrittenBySelf ? MarkerBySelfIcon : markerIcons[post?.markerIdx ?? 0].icon}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text.white,
                  fontWeight: 'bold',
                }}
                ellipsizeMode="tail"
              >
                {post?.title}
              </Text>
            </View>
            <TouchableOpacity
              style={{ position: 'absolute', right: 28, top: 25 }}
              onPress={() => setSendChatModalVisible(false)}
            >
              <SimpleExitIcon width={16} height={16} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                width: '100%',
                gap: 8,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingTop: 8,
                  paddingBottom: 10,
                  backgroundColor: colors.backgroundLight,
                  borderRadius: 20,
                  gap: 8,
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    color: colors.text.white,
                    fontSize: 10,
                    paddingVertical: 0,
                  }}
                  placeholder="채팅을 입력하세요."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={message}
                  onChangeText={setMessage}
                  numberOfLines={1}
                  multiline
                />
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    backgroundColor: message ? colors.yellow.dark : colors.primary.main,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={startChat}
                  disabled={!message}
                >
                  <SendIcon width={13} height={13} />
                </TouchableOpacity>
              </View>
            </View>
            <Spacing height={20} />
            <Text
              style={{
                fontSize: 10,
                color: colors.text.gray,
              }}
            >
              채팅 목록에서 보낸 내용을 확인할 수 있어요.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapSearch;
