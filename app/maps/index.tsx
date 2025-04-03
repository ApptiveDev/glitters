import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './mapStyles';

const MapSearch = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });

  const [placeName, setPlaceName] = useState<string | null>(null);
  const [vicinity, setvicinity] = useState<string | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleMapPress = async (e: any) => {
    if (!createMode) return;

    const { latitude, longitude } = e.nativeEvent.coordinate;
    const data = await fetchNearestPlaceName(latitude, longitude);
    console.log(data);
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

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
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
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%', '50%']}
        index={-1}
        backgroundStyle={{ backgroundColor: '#404C7A' }}
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
