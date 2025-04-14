import { Image, View } from 'react-native';

import splashImage from '@/assets/images/splash-icon.png';
import colors from '@/types/colors';

const Splash = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={splashImage} resizeMode="contain" />
    </View>
  );
};

export default Splash;
