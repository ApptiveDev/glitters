import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { getChatList } from '@/api/chat';
import { ChatCard } from '@/components/features/ChatCard';
import { useChatroom } from '@/contexts/ChatroomContext';
import { useUser } from '@/contexts/UserContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { Chat } from '@/types/chat';
import colors from '@/types/colors';

export const ChatRooms = () => {
  const { data } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatList,
  });

  const { user, updateUser } = useUser();
  const { setSelectedChatroom } = useChatroom();
  const { messagesByChatroom } = useWebSocketContext();

  const handleChatRoomPress = (chatroom: Chat) => {
    setSelectedChatroom(chatroom);
    router.push('/chatrooms/chatroom');
  };

  const hasUnreadMessages = data?.chatrooms?.some((chatRoom) => chatRoom.unreadMessageCount > 0);

  useEffect(() => {
    if (data?.chatrooms && !hasUnreadMessages && user.hasUnreadChat) {
      updateUser({ hasUnreadChat: false });
    }
  }, [data, hasUnreadMessages, updateUser, user.hasUnreadChat]);

  console.log(hasUnreadMessages);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ fontSize: 20, color: colors.text.white, fontWeight: 'bold', marginVertical: 24 }}>쪽지함</Text>
        <ScrollView style={{ gap: 12 }}>
          {data?.chatrooms?.map((chatRoom) => {
            const liveMessage: { content?: string; createdAt?: string } = messagesByChatroom?.[chatRoom.id] ?? [];

            const lastMessage = liveMessage?.content ?? chatRoom.lastMessage.content;
            const lastMessageTime = liveMessage?.createdAt ?? chatRoom.lastMessage.createdAt;

            return (
              <ChatCard
                key={chatRoom.id}
                title={chatRoom.post.title}
                lastMessage={lastMessage}
                lastMessageTime={lastMessageTime}
                iconIndex={chatRoom.post.iconIdx}
                markerIdx={chatRoom.post.markerIdx}
                unreadCount={chatRoom.unreadMessageCount}
                onPress={() => handleChatRoomPress(chatRoom)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatRooms;
