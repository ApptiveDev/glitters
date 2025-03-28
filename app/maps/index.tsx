import { Alert, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useCallback, useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { router, useNavigation } from 'expo-router';
import { LatLng, LeafletView, WebviewLeafletMessage } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView, BottomSheetModalProvider }  from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type MapMarker = {
  id: string;
  position: LatLng;
  icon: string;
  size?: [number, number];
  title?: string;
};

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [addMode, setAddMode] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
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

  const handleOnMessageReceived = (message: WebviewLeafletMessage) => {
    if (message.event === 'onMapClicked' && addMode) {
      const { lat, lng } = message.payload?.touchLatLng;
      Alert.alert('마커 추가', '이곳에 마커를 추가할까요?', [
        { text: '취소' },
        {
          text: '확인',
          onPress: () => {
            const newMarker = {
              id: `marker-${Date.now()}`,
              position: { lat, lng },
              icon: '✨',
              title: `마커 (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
            };
            setMarkers(prev => [...prev, newMarker]);
          },
        },
      ]);
    }
  };

  const handlePress = () => {
    bottomSheetRef.current?.expand();
    setDisableMode(true);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <LeafletView
          mapCenterPosition={{ lat: 35.233872, lng: 129.079250 }}
          zoom={18}
          onMessageReceived={handleOnMessageReceived}
          mapMarkers={markers}
        />
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

const styles = StyleSheet.create({
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
  contentContainer: {
    padding: 36,
    alignItems: 'center',
    zIndex: 100,
  },
});

