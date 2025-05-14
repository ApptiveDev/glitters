import { Text, View } from 'react-native';

import colors from '@/types/colors';

export const ChatMessageItem = ({
  content,
  isMine,
  createdAt,
  peerNickname,
}: {
  content: string;
  isMine: boolean;
  createdAt: string;
  peerNickname: string;
}) => {
  const formattedTime = new Date(createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        paddingVertical: 4,
        gap: 8,
      }}
    >
      <View style={{ gap: 8 }}>
        {!isMine && (
          <Text
            style={{
              color: colors.text.grayblue,
              fontSize: 12,
            }}
          >
            {peerNickname}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          {isMine && (
            <Text
              style={{
                color: colors.primary.main,
                fontSize: 8,
              }}
            >
              {formattedTime}
            </Text>
          )}
          <View
            style={{
              backgroundColor: isMine ? 'transparent' : colors.yellow.dark,
              borderWidth: isMine ? 1 : 0,
              borderColor: isMine ? colors.primary.main : 'transparent',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 12,
              maxWidth: '75%',
            }}
          >
            <Text
              style={{
                color: isMine ? colors.text.white : colors.text.lightblack,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {content}
            </Text>
          </View>
          {!isMine && (
            <Text
              style={{
                color: colors.primary.main,
                fontSize: 8,
              }}
            >
              {formattedTime}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatMessageItem;
