import BottomSheet from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'app/_layout';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SvgProps } from 'react-native-svg';

import { addLike, deleteMarker, getBoundMarkers, getMarkers } from '@/api/markers';
import { getPostById } from '@/api/posts';
import HeartIcon from '@/assets/icons/3d/heart.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import GlitterBlueIcon from '@/assets/icons/glitter_blue.svg';
import MarkerIcon from '@/assets/icons/marker.svg';
import MarkerBySelfIcon from '@/assets/icons/markerBySelf.svg';
import { CommonButton } from '@/components/common/Button';
import { CustomTextArea } from '@/components/common/TextArea';
import CustomBottomSheet from '@/components/features/BottomSheet';
import Loading from '@/components/features/Loading';
import { usePost } from '@/contexts/PostContext';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { GetPostResponseType } from '@/types/post';
import { getCurrentLocation } from '@/utils/getCurrentLocation';
import { threeDIcons } from '@/utils/threeDIcons';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(300);
  const [hasAnimatedBack, setHasAnimatedBack] = useState(false);

  const { bound, setBound } = usePost();
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [post, setPost] = useState<GetPostResponseType>();
  const [overrideButtonText, setOverrideButtonText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<any>(null);
  const [clusterPosts, setClusterPosts] = useState<GetPostResponseType[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);

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
    const fetchBound = async () => {
      try {
        const response = await getBoundMarkers();
        setBound(response[0]);
      } catch (error) {
        console.error('Bound markers error:', error);
      }
    };

    fetchBound();
  }, [setBound]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!bound) return;
      const { location, errorMsg } = await getCurrentLocation({ bound });
      if (location) {
        setCurrentPosition(location);
      } else {
        console.warn(errorMsg);
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

  const isOutOfBound = (latitude: number, longitude: number) => {
    return (
      bound &&
      (latitude < bound.startLat || latitude > bound.endLat || longitude < bound.startLon || longitude > bound.endLon)
    );
  };

  const onPressMarker = async (marker: MarkerType) => {
    const response = await getPostById(marker);
    setPost(response);
  };

  const handleMapPress = () => {
    bottomSheetRef.current?.close();
  };

  const getButtonText = (isWrittenBySelf: boolean, isLikedBySelf: boolean) => {
    if (isWrittenBySelf) {
      return '당신의 반짝이가 이 글을 읽고 있을 지도 몰라요.';
    }
    if (isLikedBySelf) {
      return '마음에 들어온 반짝이에요';
    }
    return '이 반짝이가 마음에 들어요';
  };

  const onPressBottomButton = async ({
    isWrittenBySelf,
    isLikedBySelf,
    postId,
  }: {
    isWrittenBySelf: boolean;
    isLikedBySelf: boolean;
    postId: number;
  }) => {
    if (isWrittenBySelf) {
      Alert.alert('내가 쓴 글입니다');
    } else if (isLikedBySelf) {
      Alert.alert('이미 누른 글이에요');
    } else {
      setOverrideButtonText(' 반짝반짝');
      await addLike(postId);
      setTimeout(() => {
        setOverrideButtonText(null);
      }, 1000);
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
        maxZoomLevel={19}
        maxZoom={18}
        minZoom={0}
        minZoomLevel={15}
        tracksViewChanges={false}
        preserveClusterPressBehavior
        showsUserLocation
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          const { latitude, longitude } = region;
          if (isOutOfBound(latitude, longitude) && !hasAnimatedBack) {
            setHasAnimatedBack(true);
            mapRef.current?.animateToRegion({
              latitude: bound.defaultLat,
              longitude: bound.defaultLon,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          } else if (!isOutOfBound(latitude, longitude) && hasAnimatedBack) {
            setHasAnimatedBack(false);
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
                  <MarkerBySelfIcon pointerEvents="none" style={{ width: 40, height: 40 }} />
                ) : (
                  <MarkerIcon pointerEvents="none" style={{ width: 40, height: 40 }} />
                )}
              </Marker>
            ))}
      </MapView>

      <CustomBottomSheet isVisible={isVisible} height={contentHeight} onClose={() => setIsVisible(false)}>
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            setContentHeight(measuredHeight + 40); // + padding
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
          <CommonButton
            title={overrideButtonText ?? getButtonText(post?.isWrittenBySelf ?? false, post?.isLikedBySelf ?? false)}
            variant={overrideButtonText === ' 반짝반짝' || post?.isLikedBySelf ? 'primary' : 'view'}
            onPress={() =>
              onPressBottomButton({
                isWrittenBySelf: post?.isWrittenBySelf ?? false,
                isLikedBySelf: post?.isLikedBySelf ?? false,
                postId: post?.id ?? 0,
              })
            }
            buttonIcon={overrideButtonText === ' 반짝반짝' ? <GlitterBlueIcon /> : <GlitterIcon />}
            disabled={overrideButtonText === ' 반짝반짝' || post?.isLikedBySelf}
          />
          <Text
            style={{ fontSize: 12, color: colors.text.lightgray }}
            onPress={() => handleDeletePost(post?.id ?? 0, post?.isWrittenBySelf ?? false)}
          >
            {post?.isWrittenBySelf ? '게시글 삭제하기' : '게시글 신고하기'}
          </Text>
        </View>
      </CustomBottomSheet>
      <CommonButton
        title="반짝이 기록하기"
        onPress={handleButtonPress}
        variant="maps"
        style={{
          position: 'absolute',
          bottom: isVisible ? contentHeight + 16 : 50,
          left: '50%',
          transform: [{ translateX: -70 }],
          borderWidth: 0,
        }}
        fontSize={16}
        buttonIcon={<GlitterIcon width={20} height={20} style={{ marginRight: 3 }} />}
      />
      {isListOpen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <TouchableWithoutFeedback onPress={() => setIsListOpen(false)}>
            <BlurView
              intensity={20}
              tint="dark"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 15,
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
            />
          </TouchableWithoutFeedback>
          <ScrollView
            style={{
              position: 'absolute',
              top: 100,
              left: '50%',
              transform: [{ translateX: -150 }],
              width: 300,
              height: 200,
              backgroundColor: colors.background,
              borderRadius: 12,
              padding: 28,
              zIndex: 20,
            }}
          >
            {clusterPosts.map((clusterPost) => (
              <TouchableOpacity
                key={clusterPost.id + clusterPost.title}
                style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                onPress={() => {
                  setPost(clusterPost);
                  setIsVisible(true);
                  setIsListOpen(false);
                }}
              >
                {clusterPost.isWrittenBySelf ? (
                  <MarkerBySelfIcon width={24} height={24} />
                ) : (
                  <MarkerIcon width={24} height={24} />
                )}
                <Text
                  style={{
                    color: colors.text.white,
                    fontWeight: 'bold',
                  }}
                >
                  {clusterPost.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MapSearch;
