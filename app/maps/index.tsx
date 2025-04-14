import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Text, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { addLike, deleteLike, getMarkers } from '@/api/markers';
import { getPostById } from '@/api/posts';
import EyeIcon from '@/assets/icons/eye.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import MarkerIcon from '@/assets/icons/marker.svg';
import MarkerBySelfIcon from '@/assets/icons/markerBySelf.svg';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import { CustomTextArea } from '@/components/common/TextArea';
import Loading from '@/components/features/Loading';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { GetPostResponseType } from '@/types/post';
import darkMapStyle from '@/utils/darkMapStyles';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const snapPoints = useMemo(() => {
    return contentHeight > 0 ? [contentHeight + 40] : ['25%'];
  }, [contentHeight]);

  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });
  const [post, setPost] = useState<GetPostResponseType>();
  const [sheetIndex, setSheetIndex] = useState<number>(-1);
  const windowHeight = useWindowDimensions().height;

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers'],
    queryFn: getMarkers,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handleButtonPress = () => {
    router.push('/maps/create');
  };

  useEffect(() => {
    if (post && contentHeight > 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [post, contentHeight]);

  if (!location || isLoading) {
    return <Loading />;
  }

  const onPressMarker = async (marker: MarkerType) => {
    console.log('Marker pressed:', marker);
    const response = await getPostById(marker);
    console.log('Post response:', response);
    setPost(response);
  };

  const handleMapPress = () => {
    bottomSheetRef.current?.close();
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
      Alert.alert('좋아요를 취소할까요?', '', [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            deleteLike(postId);
            setPost((prev) =>
              prev
                ? {
                    ...prev,
                    isLikedBySelf: false,
                    likeCount: prev.likeCount - 1,
                  }
                : undefined,
            );
          },
        },
      ]);
    } else {
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

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        showsUserLocation
        onPress={handleMapPress}
        customMapStyle={darkMapStyle}
      >
        {markers &&
          markers.map((marker: MarkerType) => (
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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: `${colors.background}` }}
        onChange={(index) => {
          setSheetIndex(index);
        }}
      >
        <BottomSheetView
          style={styles.contentContainer}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Heading title={post?.title || ''} fontSize={24} />
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
          <CustomTextArea
            value={post?.content || ''}
            multiline
            onChangeText={() => {}}
            height={184}
            numberOfLines={10}
            editable={false}
          />
          <CommonButton
            title="반짝이가 본인 같다면 버튼을 눌러주세요!"
            variant="view"
            onPress={() =>
              onPressBottomButton({
                isWrittenBySelf: post?.isWrittenBySelf ?? false,
                isLikedBySelf: post?.isLikedBySelf ?? false,
                postId: post?.id ?? 0,
              })
            }
            buttonIcon={<GlitterIcon />}
          />
          <Text style={{ fontSize: 12, color: colors.text.lightgray }}>
            {post?.isWrittenBySelf ? '게시글 삭제하기' : '게시글 신고하기'}
          </Text>
        </BottomSheetView>
      </BottomSheet>
      <CommonButton
        title="반짝이 기록하기"
        onPress={handleButtonPress}
        variant="maps"
        style={{
          position: 'absolute',
          bottom: sheetIndex === -1 ? 60 : windowHeight * 0.5,
          left: '50%',
          transform: [{ translateX: -70 }],
          borderWidth: 0,
        }}
        fontSize={16}
        buttonIcon={<GlitterIcon width={20} height={20} style={{ marginRight: 3 }} />}
      />
    </View>
  );
};

export default MapSearch;
