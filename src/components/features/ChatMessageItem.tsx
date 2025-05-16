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
  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <View
      style={{
        width: '100%',
        alignItems: isMine ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}
    >
      {!isMine && (
        <Text
          style={{
            color: colors.text.grayblue,
            fontSize: 12,
            marginBottom: 4,
            marginLeft: 4,
          }}
        >
          {peerNickname}
        </Text>
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {isMine && (
          <Text
            style={{
              color: colors.primary.main,
              fontSize: 10,
              marginTop: 4,
              alignSelf: 'flex-end',
            }}
          >
            {formatDate(new Date(createdAt))}
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
            maxWidth: '80%',
            flexShrink: 1,
            alignSelf: isMine ? 'flex-end' : 'flex-start',
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
              fontSize: 10,
              marginTop: 4,
              alignSelf: 'flex-end',
            }}
          >
            {formatDate(new Date(createdAt))}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChatMessageItem;
