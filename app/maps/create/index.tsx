import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import CaretRightIcon from '@/assets/icons/caret_right.svg';
import ExitIcon from '@/assets/icons/exit.svg';
import TelescopeIcon from '@/assets/icons/telescope.svg';
import { CommonButton } from '@/components/common/Button';
import CustomBottomSheet from '@/components/features/BottomSheet';
import { usePost } from '@/contexts/PostContext';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import colors from '@/types/colors';
import { LocationType } from '@/types/maps';
import { markerIcons } from '@/utils/markerIcons';
import { isOutOfBound } from '@/utils/markers';

import styles from '../styles';

export const CreateMarker = () => {
  const { currentLat, currentLon } = useLocalSearchParams();
  const lat = Number(currentLat);
  const lon = Number(currentLon);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [isFetchingPlace, setIsFetchingPlace] = useState(false);
  const [markerPlace, setMarkerPlace] = useState<LocationType>();
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [contentHeight, setContentHeight] = useState(300);
  const inputRef = useRef<TextInput>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [hasAnimatedBack, setHasAnimatedBack] = useState(false);
  const [currentMarkerIconIndex, setCurrentMarkerIconIndex] = useState(0);

  const { isKeyboardVisible } = useKeyboardVisible();
  const { updatePost, bound } = usePost();

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (isOutOfBound(latitude, longitude, bound)) {
      Alert.alert('경고!', '이 위치는 반짝일 수 없어요.');
      return;
    }
    setMarkerPlace({ latitude, longitude });
    setIsFetchingPlace(true);
    try {
      const data = await fetchNearestPlaceName(latitude, longitude);
      setPlaceName(data.name);
      setIsFetchingPlace(false);
      setBottomSheetVisible(true);
    } catch {
      setPlaceName('어디인가요?');
      setIsFetchingPlace(false);
      setBottomSheetVisible(true);
    }
  };

  useEffect(() => {
    if (placeName) {
      setIsValid(true);
    }
    return undefined;
  }, [placeName]);

  const handleButtonPress = () => {
    if (!isValid) {
      Alert.alert('경고!', '위치 정보를 입력해주세요.');
      return;
    }
    updatePost({
      markerIdx: currentMarkerIconIndex,
      address: placeName || '',
      latitude: markerPlace?.latitude || 0,
      longitude: markerPlace?.longitude || 0,
    });
    router.replace('/maps/create/write');
  };

  const handleInputChange = (text: string) => {
    setPlaceName(text.length > 63 ? text.slice(0, 63) : text);
    if (text.length === 0) setIsValid(false);
  };

  const onPressExitButton = () => {
    Alert.alert('경고!', '진행중인 작업이 취소될 수 있습니다.', [
      {
        text: '이동하기',
        onPress: () => router.replace('/maps'),
      },
    ]);
  };

  const handleNextButtonPress = () => {
    if (currentMarkerIconIndex < markerIcons.length - 1) {
      setCurrentMarkerIconIndex((prev) => prev + 1);
    } else {
      setCurrentMarkerIconIndex(0);
    }
  };

  const handlePrevButtonPress = () => {
    if (currentMarkerIconIndex > 0) {
      setCurrentMarkerIconIndex((prev) => prev - 1);
    } else {
      setCurrentMarkerIconIndex(markerIcons.length - 1);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        maxZoomLevel={19}
        minZoomLevel={15}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          const { latitude, longitude } = region;
          if (isOutOfBound(latitude, longitude, bound) && !hasAnimatedBack) {
            Alert.alert('안내', '지정된 지역을 벗어났어요. 되돌아갑니다.');
            setHasAnimatedBack(true);
            mapRef.current?.animateToRegion({
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
          } else if (!isOutOfBound(latitude, longitude, bound) && hasAnimatedBack) {
            setHasAnimatedBack(false);
          }
        }}
      >
        {markerPlace && (
          <Marker
            coordinate={{
              latitude: markerPlace.latitude,
              longitude: markerPlace.longitude,
            }}
          >
            <Image source={markerIcons[currentMarkerIconIndex].icon} style={{ width: 40, height: 40 }} />
          </Marker>
        )}
      </MapView>

      {isFetchingPlace && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 10,
              elevation: 10,
            },
          ]}
          pointerEvents="auto"
        />
      )}

      <CustomBottomSheet
        isVisible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        height={contentHeight}
        isKeyboardVisible={isKeyboardVisible}
      >
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            setContentHeight(measuredHeight); // + padding
          }}
          style={{ paddingVertical: 24, gap: 12 }}
        >
          <TextInput
            style={styles.bottomSheetMainText}
            value={placeName || ''}
            onChangeText={handleInputChange}
            editable={isEditable}
            ref={inputRef}
          />
          <Text
            style={styles.bottomSheetSubText}
            onPress={() => {
              setIsEditable(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            이 위치가 아닌가요?
          </Text>
          <View
            style={{
              width: '100%',
              height: 92,
              backgroundColor: colors.backgroundLight,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <CaretLeftIcon width={20} height={20} onPress={handlePrevButtonPress} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                width: '80%',
              }}
            >
              <Image source={markerIcons[currentMarkerIconIndex].icon} style={{ width: 40, height: 40 }} />
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text.white }}>
                {markerIcons[currentMarkerIconIndex].explain}
              </Text>
            </View>
            <CaretRightIcon width={20} height={20} onPress={handleNextButtonPress} />
          </View>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 48,
              backgroundColor: markerIcons[currentMarkerIconIndex].backgroundColor,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleButtonPress}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: markerIcons[currentMarkerIconIndex].textColor,
              }}
            >
              이 위치 반짝이기
            </Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      <View
        style={{
          position: 'absolute',
          top: 80,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 12,
        }}
      >
        <CommonButton
          title={isFetchingPlace ? '위치를 찾는 중이에요...' : '반짝이를 발견한 위치를 터치해주세요.'}
          onPress={handleButtonPress}
          variant="maps"
          style={{
            borderWidth: isFetchingPlace ? 1 : 0,
            borderColor: colors.yellow.dark,
          }}
          buttonIcon={isFetchingPlace ? null : <TelescopeIcon width={22} height={19} style={{ marginRight: 6 }} />}
        />
      </View>

      <ExitIcon
        style={{
          position: 'absolute',
          top: 85,
          right: 20,
          zIndex: 20,
          elevation: 10,
        }}
        width={28}
        height={28}
        onPress={onPressExitButton}
      />
    </View>
  );
};

export default CreateMarker;
