import { Slot } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/features/BottomNav';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';

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
  const { isKeyboardVisible } = useKeyboardVisible();
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
        <Slot />
      </KeyboardAvoidingView>
      {!isKeyboardVisible && <BottomNav />}
    </View>
  );
};

export default MapLayout;
