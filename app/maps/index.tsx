import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Marker, MarkerPressEvent } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';

import { getMarkers } from '@/api/markers';
import { getPostById } from '@/api/posts';
import MarkerBySelfIcon from '@/assets/icons/marker/marker_by_self.png';
import { ClusteredMarkerModal } from '@/components/features/ClusteredMarkerModal';
import { CreateGlitterButton } from '@/components/features/CreateGlitterButton';
import Loading from '@/components/features/Loading';
import { MapPostBottomSheet } from '@/components/features/MapPostBottomSheet';
import { RemainPost } from '@/components/features/RemainPost';
import { StartChatModal } from '@/components/features/StartChatModal';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { GetPostResponseType } from '@/types/post';
import { getCurrentLocation } from '@/utils/getCurrentLocation';
import { markerIcons } from '@/utils/markerIcons';
import { isOutOfBound } from '@/utils/markers';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(300);
  const [hasAnimatedBack, setHasAnimatedBack] = useState(false);
  const [sendChatModalVisible, setSendChatModalVisible] = useState(false);
  const [post, setPost] = useState<GetPostResponseType>();
  const [isVisible, setIsVisible] = useState(false);
  const [clusterMarkers, setClusterMakers] = useState<MarkerType[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [visibleRegion, setVisibleRegion] = useState(null);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(false);
  const isAnimatingRef = useRef(false);
  const { postId } = useLocalSearchParams();

  const { insetBottom } = useLayout();
  const { bound } = usePost();
  const mapRef = useRef<ClusteredMapView | null>(null);

  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);

  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers'],
    queryFn: getMarkers,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!postId) return;
    async function fetchPost() {
      const selectedPost = await getPostById({ postId: Number(postId) });
      if (selectedPost) {
        setPost(selectedPost);
        setIsVisible(true);
        setCurrentPosition({
          latitude: selectedPost.latitude,
          longitude: selectedPost.longitude,
        });
      }
    }
    fetchPost();
  }, [postId]);

  const memoizedMarkers = useMemo(() => {
    if (!markers) return [];

    return markers
      .filter((m): m is MarkerType => !!m && typeof m.latitude === 'number' && typeof m.longitude === 'number')
      .map((m) => ({
        ...m,
        location: {
          latitude: m.latitude,
          longitude: m.longitude,
        },
      }));
  }, [markers]);

  const visibleMarkers = useMemo(() => {
    if (!visibleRegion) return [];

    const { latitude, longitude, latitudeDelta, longitudeDelta } = visibleRegion;
    const latMin = latitude - latitudeDelta / 2;
    const latMax = latitude + latitudeDelta / 2;
    const lonMin = longitude - longitudeDelta / 2;
    const lonMax = longitude + longitudeDelta / 2;

    return memoizedMarkers.filter(
      ({ location }) =>
        location.latitude >= latMin &&
        location.latitude <= latMax &&
        location.longitude >= lonMin &&
        location.longitude <= lonMax,
    );
  }, [visibleRegion, memoizedMarkers]);

  const handleRegionChange = (region: any) => {
    setVisibleRegion(region);

    const { latitude, longitude } = region;

    if (isOutOfBound(latitude, longitude, bound) && !hasAnimatedBack && !isAnimatingRef.current) {
      setHasAnimatedBack(true);
      isAnimatingRef.current = true;

      Alert.alert('지도 범위를 벗어났어요', '기본 위치로 돌아가요.', [
        {
          text: '확인',
          onPress: () => {
            setHasAnimatedBack(false);
            mapRef.current?.getMapRef?.()?.animateToRegion(
              {
                latitude: currentPosition?.latitude,
                longitude: currentPosition?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500,
            );
          },
        },
      ]);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 600);
    }
  };

  const onPressMarker = async (marker: MarkerType) => {
    const response = await getPostById({ postId: marker.id });
    if (response) setPost(response);
  };

  useEffect(() => {
    setIsLoadingMarkers(true);

    const timeout = setTimeout(() => {
      setIsLoadingMarkers(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [visibleMarkers.length]);

  const renderMarker = useCallback((marker: MarkerType) => {
    const icon = marker.isWrittenBySelf ? MarkerBySelfIcon : markerIcons[marker.markerIdx]?.icon;
    if (!icon) return null;
    return (
      <Marker
        key={`marker-${marker.id}`}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        tracksViewChanges={false}
        onPress={() => onPressMarker(marker)}
      >
        <Image source={icon} style={{ width: 40, height: 40 }} />
      </Marker>
    );
  }, []);

  const renderCluster = useCallback(
    (cluster: { coordinate: any; pointCount: any }, onPress?: (event: MarkerPressEvent) => void) => {
      const { coordinate, pointCount } = cluster;
      return (
        <Marker coordinate={coordinate} onPress={onPress}>
          <View
            style={{
              backgroundColor: colors.primary.main,
              borderRadius: 999,
              width: Math.min(60, 30 + pointCount),
              height: Math.min(60, 30 + pointCount),
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary.darker,
                borderRadius: 999,
                width: Math.min(45, 20 + pointCount),
                height: Math.min(45, 20 + pointCount),
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{pointCount}</Text>
            </View>
          </View>
        </Marker>
      );
    },
    [],
  );

  const handleButtonPress = () => {
    if (!currentPosition) return;
    router.push({
      pathname: '/maps/create',
      params: {
        currentLat: String(currentPosition.latitude),
        currentLon: String(currentPosition.longitude),
      },
    });
  };

  useEffect(() => {
    if (!bound) return;
    getCurrentLocation({ bound }).then(({ location, errorMsg }) => {
      if (location) setCurrentPosition(location);
      else Alert.alert('위치 정보 오류', errorMsg || '위치 정보를 가져오는 데 실패했습니다.');
    });
  }, [bound]);

  useEffect(() => {
    if (post) setIsVisible(true);
  }, [post]);

  if (!currentPosition || isLoading || !bound) return <Loading />;

  const handleClusterPress = async (clusterId: any) => {
    const engine = mapRef.current?.getClusteringEngine();
    const leaves = engine.getLeaves(clusterId, 100);

    const postIds = leaves.map((leaf: { properties: { item: any } }) => leaf.properties?.item?.postId).filter(Boolean);

    const clusterMarker = markers?.filter((marker) => postIds.includes(marker.id)) ?? [];

    setClusterMakers(clusterMarker);
    setIsListOpen(true);
  };

  return (
    <View style={styles.container}>
      <ClusteredMapView
        ref={mapRef}
        style={styles.map}
        data={visibleMarkers.length === 0 ? memoizedMarkers : visibleMarkers}
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        renderMarker={renderMarker}
        renderCluster={renderCluster}
        onRegionChangeComplete={handleRegionChange}
        tracksViewChanges={false}
        preserveClusterPressBehavior={false}
        showsUserLocation
        minZoomLevel={14}
        maxZoomLevel={18}
        maxZoom={18}
        radius={80}
        minZoom={14}
        onClusterPress={handleClusterPress}
        animateClusters={false}
        isHideCollidedMarkers
        showsCompass={false}
      />
      <RemainPost />
      <MapPostBottomSheet
        isVisible={isVisible}
        post={post}
        setPost={setPost}
        setIsVisible={setIsVisible}
        setSendChatModalVisible={setSendChatModalVisible}
        setContentHeight={setContentHeight}
        contentHeight={contentHeight}
      />
      {isLoadingMarkers && (
        <View
          pointerEvents="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 9999,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      <CreateGlitterButton
        onPress={handleButtonPress}
        bottom={isVisible ? 96 - insetBottom + 24 + contentHeight + 40 : 120 - insetBottom + 24}
      />
      <ClusteredMarkerModal
        isVisible={isListOpen}
        clusterMarkers={clusterMarkers}
        setPost={setPost}
        setIsVisible={setIsVisible}
        setIsListOpen={setIsListOpen}
      />
      <StartChatModal
        visible={sendChatModalVisible}
        setVisible={setSendChatModalVisible}
        postId={post?.id || 0}
        markerIdx={post?.markerIdx || 0}
        title={post?.title || ''}
      />
    </View>
  );
};

export default MapSearch;
