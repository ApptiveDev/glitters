import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { ChatroomSideBar } from '@/components/features/ChatroomSideBar';
import { useChatroom } from '@/contexts/ChatroomContext';

export const Chatroom = () => {
  const { selectedChatroom } = useChatroom();
  if (!selectedChatroom) {
    Alert.alert('에러', '채팅방을 불러올 수 없습니다.');
    router.back();
  }
  console.log('selectedChatroom', selectedChatroom);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ChatroomSideBar
        title={selectedChatroom?.post.title || ''}
        peerNickname={selectedChatroom?.peerNickname || ''}
        postId={selectedChatroom?.post.id ?? 0}
      />
      <View style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chatroom</Text>
      </View>
    </View>
  );
};

export default Chatroom;
