import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './mapStyles';

const MapSearch = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });
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
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
