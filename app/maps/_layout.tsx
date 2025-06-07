import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const [seenTutorial, setSeenTutorial] = useState(true); // 기본값을 true로 설정

  useEffect(() => {
    const checkTutorialSeen = async () => {
      try {
        const seen = await hasSeenTutorial();
        setSeenTutorial(seen);
      } catch (error) {
        console.error('튜토리얼 상태 확인 실패:', error);
        setSeenTutorial(true); // 에러 발생 시 튜토리얼을 보이지 않게 함
      }
    };

    checkTutorialSeen();
  }, []);

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
