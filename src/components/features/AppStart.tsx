/* eslint-disable global-require */
import { router } from 'expo-router';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Spacing } from '@/components/common/Spacing';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';
import { setSeenAppStory } from '@/utils/asyncStorage';

const AppStart = () => {
  const { width, height } = useWindowDimensions();
  const { insetTop } = useLayout();
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: colors.absolute.white,
        alignItems: 'center',
      }}
    >
      <FastImage
        source={require('@/assets/images/story/4.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Spacing height={insetTop + 104} />
      <FastImage
        source={require('@/assets/images/story/name.png')}
        style={{ width: 230, height: 64 }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Spacing height={430} />
      <View
        style={{
          position: 'relative',
          width: 320,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -60,
            left: 0,
            right: 0,
            height: 64,
          }}
        >
          <FastImage
            source={require('@/assets/icons/telescope_big.png')}
            style={{ width: 64, height: 64 }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            setSeenAppStory();
            router.replace('/(auth)/sign');
          }}
          style={{
            width: 320,
            height: 41,
            backgroundColor: colors.yellow.main,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: colors.background,
            }}
          >
            반짝이맵 시작하기
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text.white }}>이미 계정이 있나요?</Text>
        <Text
          style={{ fontSize: 14, fontWeight: 'bold', color: colors.yellow.main }}
          onPress={() => {
            setSeenAppStory();
            router.replace('/');
          }}
        >
          로그인
        </Text>
      </View>
    </View>
  );
};
export default AppStart;
