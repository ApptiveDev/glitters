import { queryClient } from 'app/_layout';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import colors from '@/types/colors';
import { markerIcons } from '@/utils/markerIcons';
import { festivalIcons, threeDIcons } from '@/utils/threeDIcons';

export const Complete = () => {
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['markers'] });
    const timeout = setTimeout(() => {
      router.replace('/maps');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  const { iconIndex, markerIdx } = useLocalSearchParams();

  const RandomIcon = useMemo(() => {
    if (markerIcons[Number(markerIdx)].name === 'festival') {
      return festivalIcons[Number(iconIndex)];
    }
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(iconIndex);
    return iconsArray[index];
  }, [iconIndex, markerIdx]);

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
        <Animated.View style={{ transform: [{ translateY }] }}>
          <RandomIcon width={216} height={216} />
        </Animated.View>
        <Text style={{ color: colors.text.white, fontSize: 20, fontWeight: 'bold' }}>작성이 완료되었어요!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Complete;
