import { Slot } from 'expo-router';
import { View } from 'react-native';

export const AuthLayout = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 28, gap: 20 }}>
      <Slot />
    </View>
  );
};

export default AuthLayout;
