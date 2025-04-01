import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Mapbox, { type SymbolLayerStyle } from '@rnmapbox/maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import pinIcon from '@/assets/pin.png';

const styles: {
  matchParent: StyleProp<ViewStyle>;
  mapPinLayer: SymbolLayerStyle;
  customCalloutText: StyleProp<TextStyle>;
  calloutContainerStyle: StyleProp<ViewStyle>;
  contentContainer: StyleProp<ViewStyle>;
  container: StyleProp<ViewStyle>;
  button: StyleProp<ViewStyle>;
  buttonText: StyleProp<TextStyle>;
} = {
  matchParent: {
    flex: 1,
  },
  mapPinLayer: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.05,
    iconImage: 'exampleIcon',
  },
  customCalloutText: {
    color: 'black',
    fontSize: 16,
  },
  calloutContainerStyle: {
    backgroundColor: 'white',
    width: 60,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 36,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#354BA5',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

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
    <View style={styles.container}>
      <Mapbox.MapView style={{ flex: 1 }} logoEnabled={false} attributionEnabled={false}>
        <Mapbox.UserLocation visible />
        <Mapbox.Camera defaultSettings={defaultCamera} ref={cameraRef} zoomLevel={zoom} />
        <Mapbox.Images images={{ exampleIcon: pinIcon }} />
        <Mapbox.ShapeSource id="mapPinsSource" shape={featureCollection} onPress={handlePress}>
          <Mapbox.SymbolLayer id="mapPinsLayer" style={styles.mapPinLayer} />
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

      <TouchableOpacity style={styles.button} onPress={handlePress} disabled={disableMode}>
        <Text style={styles.buttonText}>등록하기</Text>
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['25%', '50%']}
        backgroundStyle={{ backgroundColor: '#fff' }}
        index={-1}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

export default Example;
