import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

import { updateNotificationToken } from '@/api/notifications';

export const registerForPushNotificationsAsync = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('푸시 알림 권한 거부됨');
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
    if (!projectId) throw new Error('Project ID 없음');
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;
    if (token) {
      await updateNotificationToken(token);
    }
    Alert.alert('푸시 알림 등록', token, [
      {
        text: '확인',
        onPress: () => console.log('푸시 알림 등록 완료'),
      },
    ]);
    await SecureStore.setItemAsync('expoPushToken', token);
  } catch (e) {
    console.error('푸시 등록 오류:', e);
  }
};

export const requestBackgroundLocationPermission = async () => {
  const fgStatus = await Location.requestForegroundPermissionsAsync();
  if (fgStatus.status !== 'granted') return;

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== 'granted') {
    console.warn('Background location permission denied');
  }
};
