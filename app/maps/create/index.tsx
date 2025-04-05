import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import markerIcon from '@/assets/images/marker.png';
import Loading from '@/components/common/Loading';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import colors from '@/types/colors';
import { LocationType } from '@/types/maps';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from '../styles';

export const CreateMarker = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [vicinity, setvicinity] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingPlace, setIsFetchingPlace] = useState(false);
  const [markerPlace, setMarkerPlace] = useState<LocationType>();

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPlace({ latitude, longitude });

    setIsFetchingPlace(true);

    try {
      const data = await fetchNearestPlaceName(latitude, longitude);
      setPlaceName(data.name);
      setvicinity(data.vicinity);
    } catch (err) {
      console.error('장소 불러오기 실패', err);
    } finally {
      setIsFetchingPlace(false);
    }
  };

  useEffect(() => {
    if (location) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [location]);

  if (isLoading) {
    return <Loading />;
  }

  const handleButtonPress = () => {
    router.replace('/maps/create/write');
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
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
              <Image source={markerIcon} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </Marker>
          )}
        </MapView>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%']}
        index={0}
        backgroundStyle={{ backgroundColor: `${colors.background}` }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {isFetchingPlace ? (
            <View style={styles.bottomContentView}>
              <ActivityIndicator size="large" color={colors.absolute.white} />
            </View>
          ) : (
            <View style={styles.bottomContentView}>
              <Text style={styles.bottomSheetMainText}>{placeName}</Text>
              <Text style={styles.bottomSheetSubText}>{vicinity}</Text>
              <TouchableOpacity style={styles.bottomSheetButton} onPress={handleButtonPress}>
                <Text style={styles.bottomSheetButtonText}>반짝이 기록하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default CreateMarker;
