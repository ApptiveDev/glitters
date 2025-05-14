import { Slot, usePathname } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/features/BottomNav';
import { ChatroomProvider } from '@/contexts/ChatroomContext';
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

export const ChatLayout = () => {
  const pathname = usePathname();
  return (
    <SafeAreaView style={styles.container}>
      <ChatroomProvider>
        <KeyboardAvoidingView style={styles.content}>
          <Slot />
        </KeyboardAvoidingView>
        {pathname !== '/chatrooms/chatroom' && <BottomNav />}
      </ChatroomProvider>
    </SafeAreaView>
  );
};

export default ChatLayout;
