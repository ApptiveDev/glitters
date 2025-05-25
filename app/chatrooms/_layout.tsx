import { BlurView } from 'expo-blur';
import { Slot, usePathname } from 'expo-router';
import { Image, KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import ChatBackground from '@/assets/images/chat_bg.png';
import { BottomNav } from '@/components/features/BottomNav';
import { ChatMessageProvider } from '@/contexts/ChatMessageContext';
import { ChatroomProvider } from '@/contexts/ChatroomContext';
import { useLayout } from '@/contexts/LayoutContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import colors from '@/types/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundmypage,
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 28,
  },
});

export const ChatLayout = () => {
  const pathname = usePathname();
  const { insetTop } = useLayout();
  return (
    <>
      {pathname === '/chatrooms/chatroom' ? (
        <>
          <Image
            source={ChatBackground}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
          <BlurView
            intensity={30}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            tint="dark"
          />
        </>
      ) : null}
      <View style={{ flex: 1, position: 'relative', marginTop: insetTop }}>
        <ChatMessageProvider>
          <WebSocketProvider>
            <ChatroomProvider>
              <KeyboardAvoidingView style={[styles.content, pathname === '/chatrooms' && { marginBottom: 80 }]}>
                <Slot />
              </KeyboardAvoidingView>
              {pathname === '/chatrooms' ? <BottomNav /> : null}
            </ChatroomProvider>
          </WebSocketProvider>
        </ChatMessageProvider>
      </View>
    </>
  );
};

export default ChatLayout;
