import * as Location from 'expo-location';
import { router, SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';

import { getUserInfo } from '@/api/auth';
import { getBoundMarkers } from '@/api/markers';
import Splash from '@/components/features/Splash';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';
import { hasSeenAppStory, registerForPushNotificationsAsync } from '@/utils/asyncStorage';
import { getToken, removeToken } from '@/utils/authStorage';

export const Index = () => {
  const { setUser } = useUser();
  const { setBound } = usePost();
  const [isRoutingDone, setIsRoutingDone] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Location.requestForegroundPermissionsAsync();
        await registerForPushNotificationsAsync();

        const seen = await hasSeenAppStory();
        if (!seen) {
          await SplashScreen.hideAsync();
          router.replace('/app-story');
          return;
        }

        const token = await getToken();
        if (!token) {
          await SplashScreen.hideAsync();
          router.replace('/login');
          return;
        }

        const userRes = await getUserInfo();
        if (!userRes) {
          await SplashScreen.hideAsync();
          removeToken();
          router.replace('/login');
          return;
        }

        setUser(userRes.member);
        const bounds = await getBoundMarkers();
        setBound(bounds[userRes.member.institution.id]);

        await SplashScreen.hideAsync();
        router.replace('/maps');
      } catch {
        await SplashScreen.hideAsync();
        router.replace('/');
      } finally {
        setIsRoutingDone(true);
      }
    };

    init();
  }, [setUser, setBound]);

  if (!isRoutingDone) return <Splash />;
  return null;
};

export default Index;
