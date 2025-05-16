import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export const useNotificationListener = () => {
  const router = useRouter();

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title || '알림';
      const body = notification.request.content.body || '내용 없음';
      Alert.alert(title, body);
    });

    return () => {
      subscription1.remove();
    };
  }, [router]);
};

export default useNotificationListener;
