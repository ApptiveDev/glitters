import { router } from 'expo-router';
import { Alert, Linking, Text, View } from 'react-native';

import { withdrawUser } from '@/api/auth';
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

  const handleWithdraw = () => {
    Alert.alert(
      '정말 탈퇴하시겠습니까?',
      '삭제된 데이터는 복구할 수 없어요.',
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await withdrawUser();
              Alert.alert('탈퇴 완료', '회원 탈퇴가 정상적으로 처리되었습니다.');
              router.replace('/login');
            } catch {
              Alert.alert('탈퇴 실패', '회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
          },
        },
      ],
      { cancelable: true },
    );
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
      <Text
        style={{
          position: 'absolute',
          color: colors.text.lightgray,
          fontSize: 10,
          textDecorationLine: 'underline',
          bottom: 20,
          width: '100%',
          textAlign: 'center',
        }}
        onPress={handleWithdraw}
      >
        회원탈퇴
      </Text>
    </View>
  );
};
export default HelpCenter;
