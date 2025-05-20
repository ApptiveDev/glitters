import { router } from 'expo-router';
import { Dimensions, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import CommonInput from '@/components/common/Input';
import { Spacing } from '@/components/common/Spacing';
import { useFormFields } from '@/hooks/useFormFields';
import colors from '@/types/colors';

export const ResetPassword = () => {
  const { formFields, setFieldValue, setFieldVerified, setRecheckPassword } = useFormFields();
  const { width } = Dimensions.get('window');

  const onChangePasswordText = (text: string) => {
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",.<>/?\\|`~]).{10,25}$/.test(text);
    setFieldValue('password', text, (val) => {
      return val.length >= 10 && val.length <= 25 && isValid;
    });
  };

  const onRecheckPasswordText = (text: string) => {
    const isPasswordValid = formFields.password.value === text;

    setRecheckPassword(text);

    if (isPasswordValid) {
      setFieldVerified('password', true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 16,
          width: '100%',
          alignItems: 'flex-start',
        }}
        onTouchEnd={() => {
          router.back();
        }}
      >
        <CaretLeftIcon width={16} height={16} />
        <Text style={{ fontSize: 12, color: colors.text.lightgray }}>로그인</Text>
      </View>
      <KeyboardAvoidingView>
        <Spacing height={40} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.white, marginBottom: 8 }}>
          비밀번호 재설정하기
        </Text>
        <Spacing height={24} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.white, marginBottom: 8 }}>
          비밀번호 입력하기
        </Text>
        <CommonInput
          style={{ width: width - 56 }}
          secureTextEntry
          defaultValue=""
          value={formFields.password.value}
          onChangeText={onChangePasswordText}
          placeholder="이용할 비밀번호를 입력하세요."
          isError={!formFields.password.isValid && formFields.password.isTouched}
          errorMessage="10자 이상 25자 이내의 영문, 숫자, 특수문자를 조합해주세요."
        />
        <Spacing height={24} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.white, marginBottom: 8 }}>
          비밀번호 확인하기
        </Text>
        <CommonInput
          style={{ width: width - 56 }}
          secureTextEntry
          defaultValue=""
          value={formFields.recheck}
          onChangeText={onRecheckPasswordText}
          placeholder="비밀번호를 다시 한 번 입력해주세요."
          isError={formFields.password.value !== formFields.recheck}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
        <Spacing height={24} />
        <TouchableOpacity
          onPress={() => {
            Toast.show({
              type: 'success',
              text1: '비밀번호 재설정 완료',
              text2: '변경된 비밀번호로 로그인 해주세요.',
            });
            router.push('/login');
          }}
          style={{
            backgroundColor: formFields.password.isVerified ? colors.yellow.main : colors.gray.light,
            borderRadius: 4,
            width: '100%',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled={!formFields.password.isVerified}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.background,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            완료
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;
