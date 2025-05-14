import { Text, View } from 'react-native';

import { useChatroom } from '@/contexts/ChatroomContext';

export const Chatroom = () => {
  const { selectedChatroom } = useChatroom();
  console.log('selectedChatroom', selectedChatroom);
  return (
    <View>
      <Text>Chatroom</Text>
    </View>
  );
};

export default Chatroom;
