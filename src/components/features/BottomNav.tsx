import { queryClient } from 'app/_layout';
import { router, usePathname } from 'expo-router';
import { Alert, View } from 'react-native';

import ChatIcon from '@/assets/icons/chat.svg';
import MapIcon from '@/assets/icons/map.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import colors from '@/types/colors';

export const BottomNav = () => {
  const onPressChat = () => {
    Alert.alert('준비중이에요.');
  };

  const pathname = usePathname();

  const onPressMap = () => {
    if (pathname === '/maps') {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
      return;
    }

    Alert.alert('경고!', '진행중인 작업이 취소될 수 있습니다.', [
      {
        text: '이동하기',
        onPress: () => {
          router.replace('/maps');
        },
      },
    ]);
  };

  const onPressProfile = () => {
    Alert.alert('준비중이에요.');
  };
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.background,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        paddingTop: 32,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        zIndex: 11,
      }}
    >
      <ChatIcon onPress={onPressChat} />
      <MapIcon onPress={onPressMap} />
      <ProfileIcon onPress={onPressProfile} />
    </View>
  );
};

export default BottomNav;
