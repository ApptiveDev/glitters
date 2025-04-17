import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import ExitIcon from '@/assets/icons/exit.svg';
import MarkerIcon from '@/assets/icons/marker.svg';
import TelescopeIcon from '@/assets/icons/telescope.svg';
import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import CustomBottomSheet from '@/components/features/BottomSheet';
import Loading from '@/components/features/Loading';
import { usePost } from '@/contexts/PostContext';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import colors from '@/types/colors';
import { LocationType } from '@/types/maps';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from '../styles';

export const CreateMarker = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingPlace, setIsFetchingPlace] = useState(false);
  const [markerPlace, setMarkerPlace] = useState<LocationType>();
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [contentHeight, setContentHeight] = useState(300);
  const inputRef = useRef<TextInput>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const { isKeyboardVisible } = useKeyboardVisible();
  const { updatePost } = usePost();

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

  useEffect(() => {
    if (location) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [location]);

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

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation
          onPress={handleMapPress}
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
      )}

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
