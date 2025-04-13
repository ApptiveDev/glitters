import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { getToken } from '@/utils/authStorage';

SplashScreen.preventAutoHideAsync();

export const Index = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      setIsReady(true);
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      const token = await getToken();
      console.log('token', token);
      if (token) {
        router.replace('/maps');
      } else {
        router.replace('/login');
      }
      // router.replace('/maps/create/complete');

      await SplashScreen.hideAsync();
    }
  }, [isReady, router]);

  if (!isReady) return null;

  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onLayout={onLayoutRootView} />;
};

export default Index;
