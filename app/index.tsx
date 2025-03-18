import { Text, View } from "react-native";
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from 'expo-router';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation();
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
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
