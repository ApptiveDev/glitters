import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import Splash from '@/components/features/Splash';
import { registerForPushNotificationsAsync, requestBackgroundLocationPermission } from '@/utils/asyncStorage';
import { getToken } from '@/utils/authStorage';

const LOCATION_TASK_NAME = 'background-location-task';

SplashScreen.preventAutoHideAsync();

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;

  const { locations } = data as any;
  const location = locations?.[0];

  if (location) {
    const token = await SecureStore.getItemAsync('expoPushToken');

    Alert.alert('푸시 토큰', token ?? '푸시 토큰 없음');

    await fetch('https://your-server.com/location-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        token,
      }),
    });
  }
});

export const Index = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();

      await registerForPushNotificationsAsync();
      await requestBackgroundLocationPermission();

      setIsReady(true);
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isReady) return;

    const token = await getToken();

    if (token) {
      router.replace('/maps');

      const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!isStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 600000,
          deferredUpdatesInterval: 600000,
          distanceInterval: 0,
          showsBackgroundLocationIndicator: true,
          pausesUpdatesAutomatically: false,
        });
      }
    } else {
      router.replace('/login');
    }

    await SplashScreen.hideAsync();
  }, [isReady, router]);

  if (!isReady) return <Splash />;
  return <View style={{ flex: 1 }} onLayout={onLayoutRootView} />;
};

export default Index;
