import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import colors from '@/types/colors';
import { threeDIcons } from '@/utils/threeDIcons';

interface ChatCardProps {
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  iconIndex: number;
}

export const ChatCard = ({ title, lastMessage, lastMessageTime, iconIndex }: ChatCardProps) => {
  const Icon = useMemo(() => {
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(iconIndex);
    return iconsArray[index];
  }, [iconIndex]);

  const lastMessageTimeFormatted = new Date(lastMessageTime).toLocaleString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 20,
        backgroundColor: colors.absolute.white,
        alignItems: 'center',
        width: '100%',
        borderRadius: 12,
        marginBottom: 16,
        gap: 16,
        height: 100,
      }}
    >
      <Icon width={44} height={44} />
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.text.black,
            }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text.gray,
              marginTop: 4,
            }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {lastMessage}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: colors.text.gray,
          }}
        >
          {lastMessageTimeFormatted}
        </Text>
      </View>
    </View>
  );
};

export default ChatCard;
