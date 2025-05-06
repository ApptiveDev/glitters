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
        alignItems: 'center',
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
          marginTop: 4,
        }}
      >
        {text}
      </Text>
      <CaretRightIcon
        width={16}
        height={16}
        style={{
          marginLeft: 'auto',
          marginTop: 4,
        }}
      />
    </View>
  );
};
export default ListItem;
