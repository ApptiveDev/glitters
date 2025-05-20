import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

interface NotificationData {
  type: 'chat' | 'posts' | 'likes' | 'views';
  count: number;
  postId?: number;
}

export const useNotificationListener = () => {
  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationData;
      if (data?.type === 'posts') {
        router.push('/maps');
      } else if (data?.type === 'likes' || data?.type === 'views') {
        const postId = data.postId || 0;
        router.push({
          pathname: '/post',
          params: {
            postId,
          },
        });
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
};

export default useNotificationListener;
