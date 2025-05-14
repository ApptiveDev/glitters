import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import MenuIcon from '@/assets/icons/menu.svg';
import SendIcon from '@/assets/icons/send.svg';
import { ChatMessageItem } from '@/components/features/ChatMessageItem';
import { ChatroomSideBar } from '@/components/features/ChatroomSideBar';
import { useChatMessages } from '@/contexts/ChatMessageContext';
import { useChatroom } from '@/contexts/ChatroomContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import colors from '@/types/colors';
import { getToken } from '@/utils/authStorage';

const ChatInput = ({ chatroomId }: { chatroomId: number }) => {
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const resolvedToken = await getToken();
      setToken(resolvedToken);
    };
    fetchToken();
  }, []);

  const { sendChat } = useWebSocket(token || '');

  const handleSend = () => {
    if (!message.trim()) return;
    if (!chatroomId) {
      Alert.alert('에러', '채팅방을 찾을 수 없습니다.');
      return;
    }

    sendChat(chatroomId, message);
    setMessage('');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        gap: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: colors.backgroundLight,
          borderRadius: 20,
          gap: 8,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            color: colors.text.white,
            fontSize: 14,
            lineHeight: 20,
            textAlignVertical: 'top',
            maxHeight: 20 * 5 + 10,
            paddingVertical: 0,
          }}
          placeholder="채팅을 입력하세요."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={message}
          onChangeText={setMessage}
          numberOfLines={1}
          multiline
        />
      </View>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: message ? colors.yellow.dark : colors.backgroundLight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleSend}
        disabled={!message}
      >
        <SendIcon width={24} height={24} opacity={0.3} />
      </TouchableOpacity>
    </View>
  );
};

export const Chatroom = () => {
  const { selectedChatroom } = useChatroom();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { messages } = useChatMessages();
  const scrollRef = useRef<ScrollView | null>(null);
  const { insetTop } = useLayout();

  const filteredMessages = messages.filter((msg) => msg.chatroomId === selectedChatroom?.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [filteredMessages]);

  if (!selectedChatroom) {
    Alert.alert('에러', '채팅방을 불러올 수 없습니다.');
    router.back();
  }
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <MenuIcon width={24} height={24} onPress={() => setSidebarVisible(true)} />
      </View>
      <Text style={{ color: colors.text.lightgray, fontSize: 12, marginTop: 20 }}>커뮤니티 가이드를 준수해주세요.</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insetTop + 44 : 0}
        style={{
          flex: 1,
          width: '100%',
          bottom: 0,
        }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, width: '100%', paddingTop: 24, marginBottom: 20 }}
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <ChatMessageItem
                content={message.content}
                isMine={message.type === 'sentChat'}
                createdAt={message.createdAt}
                peerNickname={selectedChatroom?.peerNickname || ''}
              />
            ))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.text.lightgray, fontSize: 14 }}>아직 메시지가 없습니다.</Text>
            </View>
          )}
        </ScrollView>
        <ChatInput chatroomId={selectedChatroom?.id || 0} />
      </KeyboardAvoidingView>
      <ChatroomSideBar
        title={selectedChatroom?.post.title || ''}
        peerNickname={selectedChatroom?.peerNickname || ''}
        chatroomId={selectedChatroom?.id || 0}
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
    </View>
  );
};

export default Chatroom;
