import { Slot } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/features/BottomNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
});

export const MapLayout = () => {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
        <Slot />
      </KeyboardAvoidingView>
      <BottomNav />
    </View>
  );
};

export default MapLayout;
