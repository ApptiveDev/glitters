import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { getChatList } from '@/api/chat';
import { ChatCard } from '@/components/features/ChatCard';
import colors from '@/types/colors';

export const ChatRooms = () => {
  const { data } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatList,
  });

  return (
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
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatRooms;
