import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { logout } from '@/api/login';
import { ListItem } from '@/components/common/ListItem';
import colors from '@/types/colors';
import { removeToken } from '@/utils/authStorage';

export const Guide = () => {
  const helpCenterPress = () => {
    router.push('/guide/(info)/HelpCenter');
  };

  const termsOfServicePress = () => {
    router.push('/guide/(info)/TermsOfService');
  };

  const privacyPolicyPress = () => {
    router.push('/guide/(info)/PrivacyPolicy');
  };

  const onPressLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            await logout();
            removeToken();
            router.replace('/login');
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'flex-start',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text.white,
        }}
      >
        도움말
      </Text>
      <View
        style={{
          gap: 12,
          marginTop: 32,
        }}
      >
        <ListItem text="고객센터" onPress={helpCenterPress} />
        <ListItem text="서비스이용약관" onPress={termsOfServicePress} />
        <ListItem text="개인정보처리방침" onPress={privacyPolicyPress} />
      </View>
      <Text
        style={{
          fontSize: 12,
          color: colors.text.lightgray,
          marginTop: 24,
          textDecorationLine: 'underline',
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: [{ translateX: -20 }],
        }}
        onPress={onPressLogout}
      >
        로그아웃
      </Text>
    </View>
  );
};

export default Guide;
