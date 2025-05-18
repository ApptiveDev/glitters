import { Slot } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/features/BottomNav';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import colors from '@/types/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundmypage,
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
  const { isKeyboardVisible } = useKeyboardVisible();
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Slot />
      </KeyboardAvoidingView>
      {!isKeyboardVisible && <BottomNav />}
    </SafeAreaView>
  );
};

export default GuideLayout;
