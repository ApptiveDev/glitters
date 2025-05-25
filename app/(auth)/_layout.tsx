import { Slot } from 'expo-router';
import { SafeAreaView, View } from 'react-native';

import colors from '@/types/colors';

export const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, width: '100%' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default AuthLayout;
