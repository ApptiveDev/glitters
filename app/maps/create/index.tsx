import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import ExitIcon from '@/assets/icons/exit.svg';
import MarkerIcon from '@/assets/icons/marker.svg';
import TelescopeIcon from '@/assets/icons/telescope.svg';
import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import CustomBottomSheet from '@/components/features/BottomSheet';
import { usePost } from '@/contexts/PostContext';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import colors from '@/types/colors';
import { LocationType } from '@/types/maps';

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

  const { isKeyboardVisible } = useKeyboardVisible();
  const { updatePost, bound } = usePost();

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPlace({ latitude, longitude });
    setIsFetchingPlace(true);
    try {
      const data = await fetchNearestPlaceName(latitude, longitude);
      setPlaceName(data.name);
      setIsFetchingPlace(false);
      setBottomSheetVisible(true);
    } catch (err) {
      console.error('장소 불러오기 실패', err);
    }
  };

  useEffect(() => {
    if (placeName) {
      setIsValid(true);
    }
    return undefined;
  }, [placeName]);

  const handleButtonPress = () => {
    updatePost({
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

  const isOutOfBound = (latitude: number, longitude: number) => {
    return (
      bound &&
      (latitude < bound.startLat || latitude > bound.endLat || longitude < bound.startLon || longitude > bound.endLon)
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        maxZoomLevel={20}
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
          if (isOutOfBound(latitude, longitude)) {
            mapRef.current?.animateToRegion({
              latitude: bound?.defaultLat ?? 0,
              longitude: bound?.defaultLon ?? 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
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
            <MarkerIcon style={{ width: 40, height: 40 }} />
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
            setContentHeight(measuredHeight + 52); // + padding
          }}
          style={{ paddingVertical: 24, gap: 8 }}
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
          <Spacing height={24} />
          <CommonButton
            title="이 위치 반짝이기"
            onPress={handleButtonPress}
            variant={isValid ? 'primary' : 'disable'}
          />
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
