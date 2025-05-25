import { Image, View } from 'react-native';

import splashImage from '@/assets/images/splash.png';
import colors from '@/types/colors';

const Splash = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image source={splashImage} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
    </View>
  );
};

export default Splash;
