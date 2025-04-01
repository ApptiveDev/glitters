import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Mapbox from '@rnmapbox/maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import pinIcon from '@/assets/images/pin.png';

import mapStyles, { mapPinLayer } from './mapStyles';

const defaultCamera = {
  centerCoordinate: [129.082794, 35.231154],
  zoomLevel: 17.4,
};

const featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'example',
        message: 'Hello!',
      },
      geometry: {
        type: 'Point',
        coordinates: [129.082794, 35.231154],
      },
    },
  ],
};

const token = Constants.expoConfig?.extra?.mapboxAccessToken;
Mapbox.setAccessToken(token);

function Example() {
  const cameraRef = React.useRef<Mapbox.Camera>(null);
  const [zoom, setZoom] = useState<number>(defaultCamera.zoomLevel);
  const [location, setLocation] = useState<Location.LocationObject>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [disableMode, setDisableMode] = useState(false);

  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log('Location:', location);
      }
    })();
  }, [location]);

  const handlePress = () => {
    bottomSheetRef.current?.expand();
    setDisableMode(true);
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setDisableMode(false);
    }
  }, []);

  const handleZoomIn = () => {
    if (zoom >= 18) {
      return;
    }
    setZoom((prevZoom) => prevZoom + 1);
    cameraRef.current?.setCamera({ zoomLevel: zoom });
  };

  const handleZoomOut = () => {
    if (zoom <= 14) {
      return;
    }
    setZoom((prevZoom) => prevZoom - 1);
    cameraRef.current?.setCamera({ zoomLevel: zoom });
  };

  return (
    <View style={mapStyles.container}>
      <Mapbox.MapView style={{ flex: 1 }} logoEnabled={false} attributionEnabled={false}>
        <Mapbox.UserLocation visible />
        <Mapbox.Camera defaultSettings={defaultCamera} ref={cameraRef} zoomLevel={zoom} />
        <Mapbox.Images images={{ exampleIcon: pinIcon }} />
        <Mapbox.ShapeSource id="mapPinsSource" shape={featureCollection} onPress={handlePress}>
          <Mapbox.SymbolLayer id="mapPinsLayer" style={mapPinLayer} />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>
      <View style={{ position: 'absolute', right: 20, bottom: 100 }}>
        <TouchableOpacity
          onPress={handleZoomIn}
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginBottom: 8,
            borderRadius: 8,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 20 }}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleZoomOut}
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 8,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 20 }}>－</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={mapStyles.button} onPress={handlePress} disabled={disableMode}>
        <Text style={mapStyles.buttonText}>등록하기</Text>
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['25%', '50%']}
        backgroundStyle={{ backgroundColor: '#fff' }}
        index={-1}
      >
        <BottomSheetView style={mapStyles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

export default Example;
