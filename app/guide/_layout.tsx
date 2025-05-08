import { Slot } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/features/BottomNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    marginBottom: 80,
    padding: 28,
  },
});

export const GuideLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.content}>
        <Slot />
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default GuideLayout;
