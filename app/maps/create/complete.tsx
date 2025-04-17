import { queryClient } from 'app/_layout';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import colors from '@/types/colors';
import { threeDIcons } from '@/utils/threeDIcons';

export const Complete = () => {
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['markers'] });
    const timeout = setTimeout(() => {
      router.replace('/maps');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const RandomIcon = useMemo(() => {
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const randomIndex = Math.floor(Math.random() * iconsArray.length);
    return iconsArray[randomIndex];
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
        <RandomIcon width={256} height={256} />
        <Text style={{ color: colors.text.white, fontSize: 20, fontWeight: 'bold' }}>작성이 완료되었어요!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Complete;
