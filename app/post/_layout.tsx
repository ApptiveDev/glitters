import { Slot } from 'expo-router';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet } from 'react-native';

import colors from '@/types/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    marginBottom: 80,
    padding: 28,
  },
});

export const PostLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Slot />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostLayout;
