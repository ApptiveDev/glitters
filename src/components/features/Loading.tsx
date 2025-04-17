import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import loadingImage from '@/assets/images/loading-image.png';
import colors from '@/types/colors';

const Loading = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: -insets.bottom,
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <Text
        style={{
          color: colors.text.white,
          fontWeight: 'bold',
          fontSize: 20,
          lineHeight: 32,
          textAlign: 'center',
        }}
      >
        어쩌면 오늘 주변 어딘가에서 당신이
      </Text>
      <Text
        style={{
          color: colors.text.white,
          fontWeight: 'bold',
          fontSize: 20,
          lineHeight: 32,
          textAlign: 'center',
        }}
      >
        반짝였을지도 몰라요!
      </Text>
      <Image source={loadingImage} resizeMode="contain" style={{ width: 512, height: 528 }} />
    </View>
  );
};

export default Loading;
