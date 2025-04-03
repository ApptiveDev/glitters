// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
// import { useQuery } from '@tanstack/react-query';
// import * as Location from 'expo-location';
// import * as SplashScreen from 'expo-splash-screen';
// import { Feature, GeoJsonProperties, Point } from 'geojson';
// import React, { useCallback, useEffect, useRef } from 'react';
// import { Text, View } from 'react-native';

// import { getMarkers } from '@/api/markers';
// import { MarkerResponse } from '@/types/markers';

// import mapStyles from './maps/mapStyles';

// const defaultCamera = {
//   centerCoordinate: [129.082794, 35.231154],
//   zoomLevel: 17.4,
// };

// const Example = () => {
//   const bottomSheetRef = useRef<BottomSheet>(null);

//   const { data } = useQuery<MarkerResponse>({
//     queryKey: ['markers'],
//     queryFn: getMarkers,
//     enabled: true,
//   });

//   useEffect(() => {
//     if (data) {
//       data.markers.forEach((marker) => {
//         const newFeature: Feature<Point, GeoJsonProperties> = {
//           type: 'Feature',
//           geometry: {
//             type: 'Point',
//             coordinates: [marker.longitude, marker.latitude],
//           },
//           properties: {
//             screenPointX: 10,
//             screenPointY: 30,
//           },
//         };
//         setMarkers((prev) => [...prev, newFeature]);
//       });
//     }
//   }, [data]);

//   useEffect(() => {
//     (async () => {
//       await SplashScreen.hideAsync();

//       const permission = await Location.requestForegroundPermissionsAsync();
//       if (permission.status === 'granted') {
//         const currentLocation = await Location.getCurrentPositionAsync({});
//         setLocation(currentLocation);
//       }
//     })();
//   }, []);

//   const handleSheetChanges = useCallback((index: number) => {
//     if (index === -1) {
//       setDisableMode(false);
//     }
//   }, []);

//   return (
//     <View style={mapStyles.container}>
//       <BottomSheet
//         ref={bottomSheetRef}
//         onChange={handleSheetChanges}
//         snapPoints={['25%', '50%']}
//         backgroundStyle={{ backgroundColor: '#fff' }}
//         index={-1}
//       >
//         <BottomSheetView style={mapStyles.contentContainer}>
//           <Text>Awesome 🎉</Text>
//         </BottomSheetView>
//       </BottomSheet>
//     </View>
//   );
// };

// export default Example;
