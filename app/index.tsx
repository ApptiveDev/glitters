import { Alert, Text, View } from "react-native";
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from 'expo-router';
import { LatLng, LeafletView, MapLayerType, WebviewLeafletMessage } from 'react-native-leaflet-view';
import * as Location from 'expo-location';

type MapMarker = {
  id: string;                       // 고유 ID (필수)
  position: LatLng;                 // 위도와 경도 (필수)
  icon: string;                    // 마커에 표시할 아이콘 (이모지 또는 URL 가능)
  size?: [number, number];          // 아이콘 크기 (너비, 높이), optional
  title?: string;                   // 마커 제목 (optional)
};

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject>(); // 실시간 위치 정보 저장예정
  const [markers, setMarkers] = useState<MapMarker[]>([]); // 마커 배열
  const [ok, setOk] = useState(true);
  const [message, setMessage] = useState('');
  const ask = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if(permission.status !== 'granted') {
      setOk(false);
    }
    const location = await Location.getCurrentPositionAsync({});
    console.log(location);
  };

  useEffect(() => {
    ask();
  }, []);

  const handleOnMessageReceived = (message: WebviewLeafletMessage) => {
    if (message.event === 'onMapClicked') {
      const { lat, lng } = message.payload?.touchLatLng;
  
      Alert.alert('이곳에 표시하시겠습니까?', '마커를 추가하시겠습니까?', [
        {
          text: '아니요',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => {
            const newMarker = {
              id: `marker-${Date.now()}`,
              position: { lat, lng },
              icon: '✨',
              title: `마커 (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
            };
            setMarkers(prevMarkers => [...prevMarkers, newMarker]);
          },
        },
      ]);
    }
  };  

  
  useEffect(() => {
    console.log('useEffect')
    setIsReady(true);
  }, []);
  
  const onLayoutRootView = useCallback(() => {
    if(isReady) {
      SplashScreen.hide();
      console.log(`onLayout, readyState: ${isReady}`);
    }
  }, [isReady]);

  if(! isReady) {
    return null;
  }

  

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onLayout={onLayoutRootView}
    >
      <LeafletView
        // mapLayers={[
        //   {
        //     id: 'watercolor-layer',
        //     baseLayer: true,
        //     baseLayerIsChecked: true,
        //     baseLayerName: '수채화 지도',
        //     layerType: MapLayerType.TILE_LAYER,
        //     attribution: 'Map tiles by Stamen Design',
        //     url: 'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=6lizmocF3DjFqMg3EAMb',
        //     opacity: 1.0,
        //     zIndex: 1,
        //   },
        // ]}
        
        mapCenterPosition={{lat: 35.233872, lng: 129.079250}} // 부산대학교, 맵 중심 받아옴
        zoom={18}
        // mapCenterPosition={{lat: location.coords.latitude, lng: location.coords.longitude}} // 위치정보를 사용하려면 이렇게 사용
        onMessageReceived={handleOnMessageReceived}
        mapMarkers={markers}
      />
      <Text>{message}</Text>
    </View>
  );
}
