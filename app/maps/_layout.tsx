import { Slot } from 'expo-router';
import { View } from 'react-native';

import { BottomNav } from '@/components/features/BottomNav';

export const MapLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <BottomNav />
    </View>
  );
};

export default MapLayout;
