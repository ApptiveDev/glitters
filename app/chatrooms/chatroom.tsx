import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import { getChatMessages } from '@/api/chat';
import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import SendIcon from '@/assets/icons/send.svg';
import { ChatMessageItem } from '@/components/features/ChatMessageItem';
import { ChatroomSideBar } from '@/components/features/ChatroomSideBar';
import { useChatroom } from '@/contexts/ChatroomContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { ChatMessage } from '@/types/chat';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';

const ChatInput = ({ chatroomId, onSend }: { chatroomId: number; onSend: (message: string) => void }) => {
  const [message, setMessage] = useState('');

  const { sendChat } = useWebSocketContext();

  const handleSend = () => {
    if (!message.trim()) return;
    if (!chatroomId) {
      Alert.alert('에러', '채팅방을 찾을 수 없습니다.');
      return;
    }

    sendChat(chatroomId, message);
    onSend(message);
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
          placeholder="보내고 싶은 말을 입력하세요."
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
  const scrollRef = useRef<ScrollView | null>(null);
  const { insetTop } = useLayout();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { messagesByChatroom } = useWebSocketContext();
  const currentRoomMessage = messagesByChatroom[selectedChatroom?.id ?? 0];
  const { readChat } = useWebSocketContext();
  const [lastMessageId, setLastMessageId] = useState(0);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [moreChatButtonVisible, setMoreChatButtonVisible] = useState(true);

  useEffect(() => {
    if (currentRoomMessage && currentRoomMessage.type === 'receivedChat') {
      if (selectedChatroom?.id !== undefined) {
        readChat(selectedChatroom.id);
      }
      if (currentRoomMessage.content) {
        setChatMessages((prev) => [
          ...prev,
          {
            ...currentRoomMessage,
            type: 'receivedChat',
            content: currentRoomMessage.content || '',
            createdAt: currentRoomMessage.createdAt || new Date().toISOString(),
          },
        ]);
      }
    }
    if (currentRoomMessage && currentRoomMessage.type === 'error') {
      Alert.alert('에러', currentRoomMessage.message);
      router.back();
    }
  }, [currentRoomMessage, readChat, selectedChatroom?.id]);

  if (!selectedChatroom) {
    Alert.alert('에러', '채팅방을 불러올 수 없습니다.');
    router.back();
  }

  const handleSend = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      content: text,
      createdAt: new Date().toISOString(),
      type: 'sentChat',
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedChatroom) return;
      try {
        const response = await getChatMessages(selectedChatroom.id, undefined, 20);
        setChatMessages(response.chats.reverse());
        setLastMessageId(response.lastChatId);
      } catch (error) {
        showErrorAlert('오류', error);
      }
    };

    fetchChatMessages();
  }, [selectedChatroom]);

  const handleGetPreviousMessages = async () => {
    if (!selectedChatroom) return;
    try {
      const response = await getChatMessages(selectedChatroom.id, lastMessageId, 20);
      if (response.chats.length === 0) {
        setMoreChatButtonVisible(false);
      } else {
        setChatMessages((prev) => [...response.chats.reverse(), ...prev]);
        setLastMessageId(response.lastChatId);
        setScrollToTop(true);
      }
    } catch (error) {
      showErrorAlert('오류', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CaretLeftIcon width={24} height={24} onPress={() => router.back()} />
        <MenuIcon width={24} height={24} onPress={() => setSidebarVisible(true)} />
      </View>
      <Text style={{ color: colors.text.lightgray, fontSize: 12, marginTop: 12 }}>커뮤니티 가이드를 준수해주세요.</Text>
      {moreChatButtonVisible ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 4,
            marginTop: 12,
            height: 20,
            borderRadius: 999,
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary.main,
          }}
          onPress={handleGetPreviousMessages}
        >
          <RefreshIcon width={12} height={12} />
          <Text
            style={{
              fontSize: 10,
              color: colors.background,
              lineHeight: 12,
              textAlign: 'center',
              marginRight: 4,
              fontWeight: 'bold',
            }}
          >
            이전 채팅 더보기
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ height: 32 }} />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insetTop + 44 : 0}
        style={{
          flex: 1,
          width: '100%',
          paddingTop: 12,
        }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, width: '100%', paddingTop: 12, marginBottom: 20 }}
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (scrollToTop) {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
              setScrollToTop(false);
            } else {
              scrollRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          {chatMessages.length > 0 ? (
            chatMessages.map((message) => (
              <ChatMessageItem
                key={message.id}
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
        <ChatInput chatroomId={selectedChatroom?.id || 0} onSend={handleSend} />
      </KeyboardAvoidingView>
      <ChatroomSideBar
        title={selectedChatroom?.post.title || ''}
        peerNickname={selectedChatroom?.peerNickname || ''}
        chatroomId={selectedChatroom?.id || 0}
        sidebarVisible={sidebarVisible}
        myNickname={selectedChatroom?.myNickname || ''}
        setSidebarVisible={setSidebarVisible}
        postId={selectedChatroom?.post.id || 0}
      />
    </View>
  );
};

export default Chatroom;
