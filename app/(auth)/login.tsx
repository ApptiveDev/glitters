import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Dimensions, Text } from 'react-native';

import { loginUser } from '@/api/auth';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import CommonInput from '@/components/common/Input';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import { Spacing } from '@/components/common/Spacing';
import { useUser } from '@/contexts/UserContext';
import { useFormFields } from '@/hooks/useFormFields';
import { storeToken } from '@/utils/authStorage';

import styles from './styles';

export const Login = () => {
  const { width } = Dimensions.get('window');
  const { setUser } = useUser();
  const { formFields, setFieldValue } = useFormFields();

  const emailValidate = (val: string) =>
    val.length >= 2 && val.length < 32 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);

  const usePostMutation = () => {
    return useMutation({
      mutationFn: loginUser,
    });
  };
  const { mutateAsync } = usePostMutation();

  const handleLogin = async () => {
    try {
      const response = await mutateAsync({
        email: formFields.email.value,
        password: formFields.password.value,
      });
      setUser(response.member);
      storeToken(response.token);
      router.replace('/maps');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const onEmailChangeText = (value: string) => {
    setFieldValue('email', value, emailValidate);
  };
  const onPasswordChangeText = (value: string) => {
    setFieldValue('password', value, (val) => val.length >= 1);
  };

  const goToSignUpPage = () => {
    router.push('/sign');
  };

  return (
    <KeyboardScrollContainer>
      <Spacing height={84} />
      <Heading title="로그인" justifyContent="center" />
      <Spacing height={56} />
      <CommonInput
        placeholder="이메일"
        style={{
          width: width - 56,
        }}
        onChangeText={onEmailChangeText}
        value={formFields.email.value}
        isValid={formFields.email.isValid}
        isError={!formFields.email.isValid && formFields.email.isTouched}
        errorMessage="이메일 형식이 아닙니다."
      />
      <CommonInput
        placeholder="비밀번호"
        secureTextEntry
        style={{
          width: width - 56,
        }}
        onChangeText={onPasswordChangeText}
        value={formFields.password.value}
        isValid={formFields.password.isValid}
        isError={!formFields.password.isValid && formFields.password.isTouched}
        errorMessage="비밀번호를 입력해주세요."
      />
      <CommonButton
        title="로그인"
        onPress={handleLogin}
        variant={formFields.email.isValid && formFields.password.isValid ? 'primary' : 'disable'}
      />
      <Text style={styles.signText} onPress={goToSignUpPage}>
        보이는 반짝이가 처음이신가요?
      </Text>
    </KeyboardScrollContainer>
  );
};
export default Login;
