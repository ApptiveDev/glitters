import { Text, View } from 'react-native';

import CaretRightIcon from '@/assets/icons/CaretRight.svg';
import colors from '@/types/colors';

interface ListItemProps {
  text: string;
}

export const ListItem = ({ text }: ListItemProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16,
      }}
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
