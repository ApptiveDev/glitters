import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { ListItem } from '@/components/common/ListItem';
import colors from '@/types/colors';

export const Guide = () => {
  const helpCenterPress = () => {
    router.push('/guide/(info)/HelpCenter');
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
        <ListItem text="서비스이용약관" />
        <ListItem text="개인정보처리방침" />
      </View>
    </View>
  );
};

export default Guide;
