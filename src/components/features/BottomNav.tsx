import ChatIcon from '@assets/icons/chat.svg';
import MapIcon from '@assets/icons/map.svg';
import ProfileIcon from '@assets/icons/profile.svg';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

import colors from '@/types/colors';

export const BottomNav = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      }}
    >
      <ChatIcon />
      <MapIcon />
      <ProfileIcon />
    </View>
  );
};

export default BottomNav;
