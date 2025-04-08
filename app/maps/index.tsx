import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getMarkers } from '@/api/markers';
import MarkerIcon from '@/assets/icons/marker.svg';
import Loading from '@/components/common/Loading';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { PNU_BOUND_MOCK } from '@/utils/mocks';

import styles from './styles';

const MapSearch = () => {
  const { location } = useCurrentLocation({ bound: PNU_BOUND_MOCK });

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers'],
    queryFn: getMarkers,
  });

  const handleButtonPress = () => {
    router.push('/maps/create');
  };

  if (!location || isLoading) {
    return <Loading />;
  }

  console.log(typeof MarkerIcon);

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
              <MarkerIcon style={{ width: 40, height: 40 }} />
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
          <Text style={styles.bottomSheetMainText}>여기에 포스트 내용 들어감</Text>
          <Text style={styles.bottomSheetSubText}>포스트 여기다가 써야지</Text>
        </BottomSheetView>
      </BottomSheet>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>기록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapSearch;
