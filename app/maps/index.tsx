import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { useCurrentLocation } from '@/hooks/useCurrentLocation';

import styles from './mapStyles';

const MapSearch = () => {
  const { location } = useCurrentLocation();
  console.log('location', location);

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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      />
      <View style={styles.overlay}>
        <Text style={{ color: 'white' }}>Search</Text>
      </View>
    </View>
  );
};

export default MapSearch;
