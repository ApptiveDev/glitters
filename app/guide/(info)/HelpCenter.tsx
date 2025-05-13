import { Linking, Text, View } from 'react-native';

import { Spacing } from '@/components/common/Spacing';
import colors from '@/types/colors';

const TextStyle = {
  lineHeight: 24,
  color: colors.text.white,
  fontSize: 16,
};

export const HelpCenter = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:admin@banjjak.me');
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        고객센터
      </Text>
      <Spacing height={24} />
      <Text style={TextStyle}>궁금한 점이나 불편 사항이 있으시면 언제든지</Text>
      <Text style={TextStyle}>아래 이메일로 문의해주세요</Text>
      <Spacing height={12} />
      <Text style={[TextStyle, { textDecorationLine: 'underline' }]} onPress={handleEmailPress}>
        admin@banjjak.me
      </Text>
    </View>
  );
};
export default HelpCenter;
