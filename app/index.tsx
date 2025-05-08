import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import Splash from '@/components/features/Splash';
import { registerForPushNotificationsAsync, requestBackgroundLocationPermission } from '@/utils/asyncStorage';
import { getToken } from '@/utils/authStorage';

const LOCATION_TASK_NAME = 'background-location-task';

SplashScreen.preventAutoHideAsync();

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
    const token = await SecureStore.getItemAsync('expoPushToken');

    await fetch('https://banjjak.me:8444/api/locations', {
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

  useEffect(() => {
    // 앱이 foreground 상태일 때 알림 수신
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 알림 수신됨:', notification);
      // 여기서 Alert.alert 등으로 표시할 수 있어요
    });

    // 사용자가 알림을 탭했을 때
    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('📬 알림 반응:', response);
      // 원하는 페이지로 이동 등 처리
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
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
