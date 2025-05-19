import BottomSheet from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Toast from 'react-native-toast-message';

import { createChat } from '@/api/chat';
import { getBoundMarkers, getMarkers } from '@/api/markers';
import { getPostById } from '@/api/posts';
import MarkerBySelfIcon from '@/assets/icons/marker/marker_by_self.png';
import SendIcon from '@/assets/icons/send.svg';
import SimpleExitIcon from '@/assets/icons/simple_exit.svg';
import { Spacing } from '@/components/common/Spacing';
import { ClusteredMarkerModal } from '@/components/features/ClusteredMarkerModal';
import { CreateGlitterButton } from '@/components/features/CreateGlitterButton';
import Loading from '@/components/features/Loading';
import { MapPostBottomSheet } from '@/components/features/MapPostBottomSheet';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { GetPostResponseType } from '@/types/post';
import { showErrorAlert } from '@/utils/errorMessage';
import { getCurrentLocation } from '@/utils/getCurrentLocation';
import { markerIcons } from '@/utils/markerIcons';
import { isOutOfBound } from '@/utils/markers';

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
        showErrorAlert('오류', error);
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
      showErrorAlert('오류', error);
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
      <MapPostBottomSheet
        isVisible={isVisible}
        post={post}
        setPost={setPost}
        setIsVisible={setIsVisible}
        setSendChatModalVisible={setSendChatModalVisible}
        setContentHeight={setContentHeight}
        contentHeight={contentHeight}
      />
      <CreateGlitterButton
        onPress={handleButtonPress}
        bottom={isVisible ? 96 - insetBottom + 16 + contentHeight + 40 : 120 - insetBottom + 16}
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
