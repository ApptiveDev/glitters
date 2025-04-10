import { Text, View } from 'react-native';

import CaretRightIcon from '@/assets/icons/CaretRight.svg';
import CheckIcon from '@/assets/icons/check.svg';
import CheckWhiteIcon from '@/assets/icons/checkWhite.svg';
import colors from '@/types/colors';

interface TermsItemProps {
  isChecked: boolean;
  onPress: () => void;
  title: string;
}

export const TermsItem = ({ isChecked, onPress, title }: TermsItemProps) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
      onTouchEnd={onPress}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {isChecked ? <CheckWhiteIcon width={12} height={12} /> : <CheckIcon width={12} height={12} />}
        <Text
          style={{
            fontSize: 12,
            color: isChecked ? colors.text.white : colors.primary.main,
            textAlign: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>에 동의합니다.
        </Text>
      </View>
      <CaretRightIcon width={12} height={12} />
    </View>
  );
};

export default TermsItem;
