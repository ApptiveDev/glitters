import { Text, View } from 'react-native';

import CaretRightIcon from '@/assets/icons/caret_right.svg';
import colors from '@/types/colors';

interface ListItemProps {
  text: string;
  onPress: () => void;
}

export const ListItem = ({ text, onPress }: ListItemProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16,
      }}
      onTouchEnd={onPress}
    >
      <Text
        style={{
          fontSize: 14,
          color: colors.text.white,
        }}
      >
        {text}
      </Text>
      <CaretRightIcon
        width={16}
        height={16}
        style={{
          marginLeft: 'auto',
          marginTop: 2,
        }}
      />
    </View>
  );
};
export default ListItem;
