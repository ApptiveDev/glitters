import { router } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { withdrawUser } from '@/api/auth';
import { logout } from '@/api/login';
import { ListItem } from '@/components/common/ListItem';
import { Spacing } from '@/components/common/Spacing';
import { AdminList } from '@/components/features/AdminList';
import { useUser } from '@/contexts/UserContext';
import colors from '@/types/colors';
import { unsetSeenAppStory } from '@/utils/asyncStorage';
import { removeToken } from '@/utils/authStorage';
import { showErrorAlert } from '@/utils/errorMessage';

interface LabelValueProps {
  label: string;
  value: string;
}

const LabelValue = ({ label, value }: LabelValueProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: '100%',
      }}
    >
      <Text style={{ fontSize: 14, color: colors.text.gray }}>{label}</Text>
      <Text style={{ fontSize: 14, color: colors.text.white }}>{value}</Text>
    </View>
  );
};

export const Guide = () => {
  const { user } = useUser();

  const handleHelpPress = () => {
    router.push('/guide/(info)/help');
  };

  const onPressLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            await logout();
            removeToken();
            router.replace('/login');
          },
        },
      ],
      { cancelable: false },
    );
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
              await removeToken();
              await unsetSeenAppStory();
              Alert.alert('탈퇴 완료', '회원 탈퇴가 정상적으로 처리되었습니다.');
              router.replace('/login');
            } catch (error) {
              showErrorAlert('오류', error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.white }}>마이페이지</Text>
      <ScrollView>
        <Spacing height={28} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LabelValue label="이름" value={user.name ?? ''} />
          <LabelValue label="생년월일" value={user.birth.slice(0, 10) ?? ''} />
          <LabelValue label="성별" value={user?.gender === 0 ? '남성' : '여성'} />
          <LabelValue label="이메일" value={user.email ?? ''} />
          <LabelValue label="소속학교" value={user.institution.name ?? ''} />
          {user.isAdmin ? <AdminList /> : null}
        </View>
        <ListItem text="도움말" onPress={handleHelpPress} />
        <Spacing height={8} />
        <Text
          style={{
            fontSize: 14,
            padding: 16,
            color: colors.text.white,
          }}
          onPress={onPressLogout}
        >
          로그아웃
        </Text>
        <Spacing height={8} />
        <Text
          style={{
            fontSize: 14,
            padding: 16,
            color: colors.text.white,
          }}
          onPress={handleWithdraw}
        >
          회원탈퇴
        </Text>
      </ScrollView>
    </View>
  );
};

export default Guide;
