import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import fetchNearestPlaceName from '@/lib/googlePlaces';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './mapStyles';

const MapSearch = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });

  const [placeName, setPlaceName] = useState<string | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const handleMapPress = async (e: any) => {
    if (!createMode) {
      console.log('Create mode is enabled');
      return;
    }
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const name = await fetchNearestPlaceName(latitude, longitude);
    setPlaceName(name);
    console.log('Nearest place name:', name);
  };

  const handleButtonPress = () => {
    setCreateMode((prev) => !prev);
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
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        onPress={handleMapPress}
      />
      {placeName && (
        <Text style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10 }}>
          {placeName}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>누르기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapSearch;
