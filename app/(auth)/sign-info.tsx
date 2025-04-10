import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { registerUser } from '@/api/auth';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import CommonInput from '@/components/common/Input';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import GenderSelector from '@/components/GenderSelector';
import { TermsItem } from '@/components/TermsItem';
import { useUser } from '@/contexts/UserContext';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { InputField } from '@/types/utils';

import styles from './styles';

interface UserInfoField {
  name: InputField;
  birth: InputField;
  gender: InputField;
  agreedToPrivacyPolicy: boolean;
  agreedToTermsOfService: boolean;
}

export const SignInfo = () => {
  const { setUser } = useUser();
  const initialField = { value: '', isValid: false, isTouched: false };
  const [userInfoField, setUserInfoField] = useState<UserInfoField>({
    name: initialField,
    birth: initialField,
    gender: initialField,
    agreedToPrivacyPolicy: false,
    agreedToTermsOfService: false,
  });
  const { width } = Dimensions.get('window');
  const isKeyboardVisible = useKeyboardVisible();
  const insets = useSafeAreaInsets();

  const usePostMutation = () => {
    return useMutation({
      mutationFn: registerUser,
    });
  };

  const { mutateAsync } = usePostMutation();

  const updateField = (
    key: keyof Pick<UserInfoField, 'name' | 'birth' | 'gender'>,
    value: string,
    validateFn: (val: string) => boolean,
  ) => {
    setUserInfoField((prev) => ({
      ...prev,
      [key]: {
        value,
        isTouched: true,
        isValid: validateFn(value),
      },
    }));
  };

  const onUserNameChangeText = (text: string) => {
    updateField('name', text, (val) => val.length >= 2 && val.length <= 10);
  };

  const onUserBirthChangeText = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '');

    const regex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

    if (raw.length === 8 && regex.test(raw)) {
      const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      updateField('birth', formatted, () => true);
    } else {
      updateField('birth', text, () => false);
    }
  };

  const handleButtonPress = async () => {
    try {
      const response = await mutateAsync({
        name: userInfoField.name.value,
        email: 'ming0820@pusan.ac.kr',
        password: 'gDWQ^5kvLrC85w(',
        birth: userInfoField.birth.value,
        termsAccepted: userInfoField.agreedToPrivacyPolicy && userInfoField.agreedToTermsOfService,
      });
      setUser(response.member);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardScrollContainer
        viewStyle={{
          gap: 28,
        }}
      >
        <View style={styles.heading}>
          <Heading title="이름 입력하기" />
          <CommonInput
            style={{ width: width - 56 }}
            defaultValue=""
            value={userInfoField.name.value}
            onChangeText={onUserNameChangeText}
            placeholder="이름을 입력하세요."
            isError={!userInfoField.name.isValid && userInfoField.name.isTouched}
            errorMessage="이름은 2자 이상 10자 이하로 입력해주세요."
          />
        </View>
        <View style={styles.heading}>
          <Heading title="생년월일 입력하기(8자리)" />
          <CommonInput
            style={{ width: width - 56 }}
            defaultValue=""
            value={userInfoField.birth.value}
            onChangeText={onUserBirthChangeText}
            placeholder="생년월일을 입력하세요."
            isError={!userInfoField.birth.isValid && userInfoField.birth.isTouched}
            errorMessage="생년월일은 8자리 숫자로 입력해주세요."
          />
        </View>
        <View style={styles.heading}>
          <Heading title="성별 선택하기" />
          <GenderSelector
            selected={userInfoField.gender.value as '남성' | '여성' | ''}
            onSelect={(val) => updateField('gender', val, (value) => value === '남성' || value === '여성')}
            isError={!userInfoField.gender.value && userInfoField.gender.isTouched}
            errorMessage="성별을 선택해주세요."
          />
        </View>
        {userInfoField.name.isValid && userInfoField.birth.isValid && userInfoField.gender.isValid && (
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <TermsItem
              isChecked={userInfoField.agreedToPrivacyPolicy}
              onPress={() =>
                setUserInfoField((prev) => ({
                  ...prev,
                  agreedToPrivacyPolicy: !prev.agreedToPrivacyPolicy,
                }))
              }
              title="개인정보 처리방침"
            />
            <TermsItem
              isChecked={userInfoField.agreedToTermsOfService}
              onPress={() =>
                setUserInfoField((prev) => ({
                  ...prev,
                  agreedToTermsOfService: !prev.agreedToTermsOfService,
                }))
              }
              title="서비스 이용약관"
            />
          </View>
        )}
      </KeyboardScrollContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}
      >
        <View
          style={{
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: isKeyboardVisible ? 0 : 28,
          }}
        >
          {userInfoField.agreedToPrivacyPolicy && userInfoField.agreedToTermsOfService && (
            <CommonButton title="회원가입 완료하기" onPress={handleButtonPress} isKeyboardVisible={isKeyboardVisible} />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInfo;
