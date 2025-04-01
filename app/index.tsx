import { useRouter } from 'expo-router';
import { useEffect, useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 400, fade: true });

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  console.log('Index 컴포넌트 렌더링');

  useEffect(() => {
    setIsReady(true);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
      router.replace('/maps');
      console.log(`onLayout 완료 → /maps로 이동`);
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onLayout={onLayoutRootView}
    />
  );
}
