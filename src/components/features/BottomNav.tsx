import { queryClient } from 'app/_layout';
import { router, usePathname } from 'expo-router';
import { Alert, View } from 'react-native';

import ChatIcon from '@/assets/icons/chat.svg';
import MapIcon from '@/assets/icons/map.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import SelectedMapIcon from '@/assets/icons/selected_map.svg';
import SelectedProfileIcon from '@/assets/icons/selected_profile.svg';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';

export const BottomNav = () => {
  const { insetBottom } = useLayout();
  const onPressChat = () => {
    Alert.alert('준비중이에요.');
  };

  const pathname = usePathname();

  const onPressMap = () => {
    if (pathname === '/maps') {
      queryClient.refetchQueries({ queryKey: ['markers'] });
    } else if (pathname.startsWith('/guide')) {
      router.replace('/maps');
    } else {
      Alert.alert('경고!', '진행중인 작업이 취소될 수 있습니다.', [
        {
          text: '이동하기',
          onPress: () => {
            router.replace('/maps');
          },
        },
      ]);
    }
  };

  const onPressProfile = () => {
    router.replace('/guide');
  };

  const isSelected = (route: string) => pathname.startsWith(route);

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.background,
        width: '100%',
        height: 120 - insetBottom,
        overflow: 'hidden',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <ChatIcon onPress={onPressChat} />
        {isSelected('/maps') ? <SelectedMapIcon onPress={onPressMap} /> : <MapIcon onPress={onPressMap} />}
        {isSelected('/guide') ? (
          <SelectedProfileIcon onPress={onPressProfile} />
        ) : (
          <ProfileIcon onPress={onPressProfile} />
        )}
      </View>
    </View>
  );
};

export default BottomNav;
