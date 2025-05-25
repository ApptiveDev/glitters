import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

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
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
    if (!projectId) throw new Error('Project ID 없음');

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;
    if (token) {
      await updateNotificationToken(token);
    }
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

const TUTORIAL_KEY = 'tutorial_seen';

export const setTutorialSeen = async () => {
  try {
    await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
  } catch (e) {
    console.error('튜토리얼 확인 실패', e);
  }
};

export const hasSeenTutorial = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(TUTORIAL_KEY);
    return value === 'true';
  } catch (e) {
    console.error('튜토리얼 확인 실패', e);
    return false;
  }
};

export const hasSeenAppStory = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('appStory');
    return value === 'true';
  } catch (e) {
    console.error('앱 스토리 확인 실패', e);
    return false;
  }
};

export const setSeenAppStory = async () => {
  try {
    await AsyncStorage.setItem('appStory', 'true');
  } catch (e) {
    console.error('앱 스토리 확인 실패', e);
  }
};

export const unsetSeenAppStory = async () => {
  try {
    await AsyncStorage.removeItem('appStory');
  } catch (e) {
    console.error('앱 스토리 확인 실패', e);
  }
};
