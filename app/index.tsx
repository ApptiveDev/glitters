/* eslint-disable import/no-extraneous-dependencies */
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { getUserInfo } from '@/api/auth';
import { getBoundMarkers } from '@/api/markers';
import Splash from '@/components/features/Splash';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';
import { hasSeenAppStory, registerForPushNotificationsAsync } from '@/utils/asyncStorage';
import { getToken, removeToken } from '@/utils/authStorage';

export const Index = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const { setUser } = useUser();
  const { setBound } = usePost();
  const [seenAppStory, setSeenAppStory] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      await Location.requestForegroundPermissionsAsync();
      await registerForPushNotificationsAsync();

      setIsReady(true);
    };
    const checkTutorialSeen = async () => {
      const seen = await hasSeenAppStory();
      setSeenAppStory(seen);
    };
    prepare();
    checkTutorialSeen();
  }, []);

  console.log('seenAppStory', seenAppStory);

  const onLayoutRootView = useCallback(async () => {
    if (!isReady) return;

    const token = await getToken();

    if (!seenAppStory) {
      router.replace('/app-story');
      return;
    }

    if (token) {
      const userRes = await getUserInfo();
      if (userRes) {
        setUser(userRes.member);

        const bounds = await getBoundMarkers();
        setBound(bounds[userRes.member.institution.id]);
        router.replace('/maps');
      } else {
        router.replace('/login');
      }
    } else {
      removeToken();
      router.replace('/login');
    }
  }, [isReady, router, setBound, setUser]);

  if (!isReady) return <Splash />;
  return <View style={{ flex: 1 }} onLayout={onLayoutRootView} />;
};

export default Index;
