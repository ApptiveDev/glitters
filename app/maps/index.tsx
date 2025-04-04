import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getMarkers } from '@/api/markers';
import markerIcon from '@/assets/images/marker.png';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './styles';

const MapSearch = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });

  const [placeName, setPlaceName] = useState<string | null>(null);
  const [vicinity, setvicinity] = useState<string | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers'],
    queryFn: getMarkers,
  });

  const handleMapPress = async (e: any) => {
    if (!createMode) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const data = await fetchNearestPlaceName(latitude, longitude);
    setPlaceName(data.name);
    setvicinity(data.vicinity);

    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleButtonPress = () => {
    setCreateMode((prev) => !prev);
    if (createMode) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  if (!location || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.absolute.white} />
        <Text style={{ color: 'white' }}>위치 정보를 불러오는 중...</Text>
      </View>
    );
  }

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
      >
        {markers &&
          markers.map((marker: MarkerType) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              <Image source={markerIcon} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </Marker>
          ))}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%', '50%']}
        index={-1}
        backgroundStyle={{ backgroundColor: `${colors.background}` }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.bottomSheetMainText}>{placeName}</Text>
          <Text style={styles.bottomSheetSubText}>{vicinity}</Text>
          <TouchableOpacity style={styles.bottomSheetButton} onPress={handleButtonPress}>
            <Text style={styles.bottomSheetButtonText}>반짝이 기록하기</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
      {!createMode && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>기록하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MapSearch;
