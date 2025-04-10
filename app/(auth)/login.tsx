import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Dimensions } from 'react-native';

import { loginUser } from '@/api/auth';
import { BottomButtonContainer } from '@/components/common/BottomButtonContainer';
import { CommonButton } from '@/components/common/Button';
import CommonInput from '@/components/common/Input';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import { useUser } from '@/contexts/UserContext';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { storeToken } from '@/utils/authStorage';

interface InputField {
  value: string;
  isValid: boolean;
  isTouched: boolean;
}

interface UserInfoField {
  email: InputField;
  password: InputField;
}

export const Login = () => {
  const { width } = Dimensions.get('window');
  const { setUser } = useUser();
  const [loginField, setLoginField] = useState<UserInfoField>({
    email: { value: '', isValid: false, isTouched: false },
    password: { value: '', isValid: false, isTouched: false },
  });

  const isKeyboardVisible = useKeyboardVisible();

  const usePostMutation = () => {
    return useMutation({
      mutationFn: loginUser,
    });
  };
  const { mutateAsync } = usePostMutation();

  const onEmailChangeText = (text: string) => {
    setLoginField((prev: any) => ({
      ...prev,
      email: {
        value: text,
        isTouched: true,
        isValid: text.includes('@'),
      },
    }));
  };
  const onPasswordChangeText = (text: string) => {
    setLoginField((prev: any) => ({
      ...prev,
      password: {
        value: text,
        isTouched: true,
        isValid: text.length >= 6,
      },
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await mutateAsync({
        email: loginField.email.value,
        password: loginField.password.value,
      });
      setUser(response.member);
      storeToken(response.token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  return (
    <>
      <KeyboardScrollContainer>
        <CommonInput
          placeholder="Email"
          style={{
            width: width - 28,
          }}
          onChangeText={onEmailChangeText}
          value={loginField.email.value}
        />
        <CommonInput
          placeholder="Password"
          secureTextEntry
          style={{
            width: width - 28,
          }}
          onChangeText={onPasswordChangeText}
          value={loginField.password.value}
        />
      </KeyboardScrollContainer>
      <BottomButtonContainer isKeyboardVisible={isKeyboardVisible}>
        <CommonButton title="로그인하기" onPress={handleLogin} isKeyboardVisible={isKeyboardVisible} />
      </BottomButtonContainer>
    </>
  );
};
export default Login;
