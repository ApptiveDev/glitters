/* eslint-disable import/no-extraneous-dependencies */
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { postLocation } from '@/api/notifications';
import Splash from '@/components/features/Splash';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import { getToken } from '@/utils/authStorage';

const LOCATION_TASK_NAME = 'background-location-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;

  const { locations } = data as any;
  const location = locations?.[0];
  console.log('🔍 위치 업데이트:', location);

  if (location) {
    await postLocation(location.coords.latitude, location.coords.longitude);
  }
});

export const Index = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();

      // await requestBackgroundLocationPermission();
      // await registerForPushNotificationsAsync();

      setIsReady(true);
    };

    prepare();
  }, []);

  useNotificationListener();

  const onLayoutRootView = useCallback(async () => {
    if (!isReady) return;

    const token = await getToken();

    if (token) {
      router.replace('/maps');

      const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!isStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
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
