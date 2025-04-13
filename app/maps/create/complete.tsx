import { queryClient } from 'app/_layout';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import Heart from '@/assets/icons/heart.svg';
import colors from '@/types/colors';

export const Complete = () => {
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['markers'] });
    const timeout = setTimeout(() => {
      router.replace('/maps');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Text style={{ color: colors.text.white, fontSize: 20, fontWeight: 'bold' }}>작성이 완료되었어요!</Text>
        <Heart width={292} height={292} />
      </View>
    </SafeAreaView>
  );
};

export default Complete;
