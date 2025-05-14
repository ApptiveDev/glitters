import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { getChatList } from '@/api/chat';
import { ChatCard } from '@/components/features/ChatCard';
import { useChatroom } from '@/contexts/ChatroomContext';
import { Chat } from '@/types/chat';
import colors from '@/types/colors';

export const ChatRooms = () => {
  const { data } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatList,
  });
  const { setSelectedChatroom } = useChatroom();

  const handleChatRoomPress = (chatroom: Chat) => {
    setSelectedChatroom(chatroom);
    router.push('/chatrooms/chatroom');
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ fontSize: 20, color: colors.text.white, fontWeight: 'bold', marginVertical: 24 }}>쪽지함</Text>
        <ScrollView style={{ gap: 12 }}>
          {data?.chatrooms?.map((chatRoom) => (
            <ChatCard
              key={chatRoom.id}
              title={chatRoom.post.title}
              lastMessage={chatRoom.lastMessage.content}
              lastMessageTime={chatRoom.lastMessage.createdAt}
              iconIndex={chatRoom.post.iconIdx}
              onPress={() => handleChatRoomPress(chatRoom)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatRooms;
