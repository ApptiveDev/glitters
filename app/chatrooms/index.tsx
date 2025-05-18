import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { getChatList } from '@/api/chat';
import { ChatCard } from '@/components/features/ChatCard';
import { useChatroom } from '@/contexts/ChatroomContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { Chat } from '@/types/chat';
import colors from '@/types/colors';

export const ChatRooms = () => {
  const { data } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatList,
  });

  const { setSelectedChatroom } = useChatroom();
  const { messagesByChatroom } = useWebSocketContext();

  const handleChatRoomPress = (chatroom: Chat) => {
    setSelectedChatroom(chatroom);
    router.push('/chatrooms/chatroom');
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ fontSize: 20, color: colors.text.white, fontWeight: 'bold', marginVertical: 24 }}>쪽지함</Text>
        <ScrollView style={{ gap: 12 }}>
          {data?.chatrooms?.map((chatRoom) => {
            const liveMessage: { content: string; createdAt: string } = messagesByChatroom?.[chatRoom.id] ?? [];

            const lastMessage = liveMessage?.content ?? chatRoom.lastMessage.content;
            const lastMessageTime = liveMessage?.createdAt ?? chatRoom.lastMessage.createdAt;

            return (
              <ChatCard
                key={chatRoom.id}
                title={chatRoom.post.title}
                lastMessage={lastMessage}
                lastMessageTime={lastMessageTime}
                iconIndex={chatRoom.post.iconIdx}
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
