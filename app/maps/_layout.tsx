import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/features/BottomNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
});

export const MapLayout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>

      <BottomNav />
    </View>
  );
};

export default MapLayout;
