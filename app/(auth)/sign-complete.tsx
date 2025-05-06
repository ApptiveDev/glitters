import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Modal, Text, View } from 'react-native';

import TwinkleIcon from '@/assets/icons/3d/twinkle_3d.svg';
import BlueBackground from '@/assets/images/blue_background.png';
import colors from '@/types/colors';

export const SignComplete = () => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/maps');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

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
  return (
    <Modal style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={BlueBackground}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.white }}>회원가입이 완료되었어요!</Text>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <TwinkleIcon width={292} height={292} />
        </Animated.View>
        <Text style={{ fontSize: 16, color: colors.text.white, fontWeight: 'bold' }}>
          주변의 반짝이를 만나러 가 볼까요?
        </Text>
      </View>
    </Modal>
  );
};

export default SignComplete;
