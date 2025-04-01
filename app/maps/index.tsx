import Mapbox, { type SymbolLayerStyle } from '@rnmapbox/maps';
import { Feature } from '@turf/helpers';
import React, { useState } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import pinIcon from '../../assets/images/pin.png';
import Constants from 'expo-constants';
import { Alert, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LatLng, LeafletView, WebviewLeafletMessage } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView, BottomSheetModalProvider }  from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

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

type CustomCalloutViewProps = {
  message: string;
};

const CustomCalloutView = ({ message }: CustomCalloutViewProps) => {
  return (
    <View style={styles.calloutContainerStyle}>
      <Text style={styles.customCalloutText}>{message}</Text>
    </View>
  );
};

const token = Constants.expoConfig?.extra?.mapboxAccessToken;
Mapbox.setAccessToken(token);

const Example = () => {
  const cameraRef = React.useRef<Mapbox.Camera>(null);
  const [zoom, setZoom] = useState<number>(defaultCamera.zoomLevel);
  const [location, setLocation] = useState<Location.LocationObject>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const [disableMode, setDisableMode] = useState(false);

    useEffect(() => {
      (async () => {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
      })();
    }, []);

    useEffect(() => {
        (async () => {
          await SplashScreen.hideAsync();
      
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          }
        })();
      }, []);

  const handlePress = () => {
    bottomSheetRef.current?.expand();
    setDisableMode(true);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
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

  const [selectedFeature, setSelectedFeature] =
    useState<GeoJSON.Feature<GeoJSON.Point>>();

  const onPinPress = (e: { features: Array<GeoJSON.Feature> }): void => {
    if (selectedFeature) {
      setSelectedFeature(undefined);
      return;
    }

    const feature = e?.features[0] as Feature<GeoJSON.Point>;
    setSelectedFeature(feature);
  };

  return (
    <View style={styles.container}>
    <Mapbox.MapView 
      style={{ flex : 1 }}
      logoEnabled={false}
      attributionEnabled={false}
      >
      <Mapbox.Camera 
        defaultSettings={defaultCamera}
        ref={cameraRef}
        zoomLevel={zoom}
      />
      <Mapbox.Images 
        images={{ exampleIcon: pinIcon }}
      />
      <Mapbox.ShapeSource
        id="mapPinsSource"
        shape={featureCollection}
        onPress={onPinPress}
      >
        <Mapbox.SymbolLayer id="mapPinsLayer" style={styles.mapPinLayer} />
      </Mapbox.ShapeSource>
      {selectedFeature && (
        <Mapbox.MarkerView coordinate={selectedFeature.geometry.coordinates}>
          <CustomCalloutView message={selectedFeature?.properties?.message} />
        </Mapbox.MarkerView>
      )}
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
};

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

export default Example;
