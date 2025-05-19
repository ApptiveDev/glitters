import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import colors from '@/types/colors';
import { threeDIcons } from '@/utils/threeDIcons';

interface ChatCardProps {
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  iconIndex: number;
  unreadCount: number;
  onPress: () => void;
}

export const ChatCard = ({ title, lastMessage, lastMessageTime, iconIndex, onPress, unreadCount }: ChatCardProps) => {
  const Icon = useMemo(() => {
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(iconIndex);
    return iconsArray[index];
  }, [iconIndex]);

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <TouchableOpacity
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
        position: 'relative',
      }}
      onPress={onPress}
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
              lineHeight: 16,
              minHeight: 32,
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
          {formatDate(new Date(lastMessageTime))}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: [{ translateY: 12 }],
          width: 16,
          height: 16,
          borderRadius: 12,
          backgroundColor: colors.alert,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 8,
            color: colors.text.white,
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
