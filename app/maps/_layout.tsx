import { Slot } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/features/BottomNav';
import { MapTutorial } from '@/components/features/MapTutorial';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { hasSeenTutorial } from '@/utils/asyncStorage';

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
  const seenTutorial = hasSeenTutorial();
  return (
    <>
      {!seenTutorial ? <MapTutorial /> : null}
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.content}>
          <Slot />
        </KeyboardAvoidingView>
        {!isKeyboardVisible ? <BottomNav /> : null}
      </View>
    </>
  );
};

export default MapLayout;
