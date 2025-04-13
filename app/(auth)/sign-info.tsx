import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Dimensions, View } from 'react-native';

import { registerUser } from '@/api/auth';
import { BottomButtonContainer } from '@/components/common/BottomButtonContainer';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import CommonInput from '@/components/common/Input';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import GenderSelector from '@/components/GenderSelector';
import { TermsItem } from '@/components/TermsItem';
import { useUser } from '@/contexts/UserContext';
import { useFormFields } from '@/hooks/useFormFields';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { storeToken } from '@/utils/authStorage';

import styles from './styles';

export const SignInfo = () => {
  const { user, setUser } = useUser();
  const { formFields, setFieldValue, setAgreedToPrivacyPolicy, setAgreedToTermsOfService } = useFormFields();
  const { width } = Dimensions.get('window');
  const { isKeyboardVisible } = useKeyboardVisible();

  const usePostMutation = () => {
    return useMutation({
      mutationFn: registerUser,
    });
  };

  const { mutateAsync } = usePostMutation();

  const onUserNameChangeText = (text: string) => {
    setFieldValue('name', text, (val) => val.length >= 2 && val.length <= 10);
  };

  const onUserBirthChangeText = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '');
    const regex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

    if (raw.length === 8 && regex.test(raw)) {
      const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      setFieldValue('birth', formatted, () => true);
    } else {
      setFieldValue('birth', text, () => false);
    }
  };

  const handleButtonPress = async () => {
    try {
      const response = await mutateAsync({
        name: formFields.name.value,
        email: user.email,
        password: user.password,
        birth: formFields.birth.value,
        termsAccepted: formFields.agreedToPrivacyPolicy && formFields.agreedToTermsOfService,
      });
      setUser(response.member);
      storeToken(response.token);
      router.replace('/maps');
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
            value={formFields.name.value}
            onChangeText={onUserNameChangeText}
            placeholder="이름을 입력하세요."
            isError={!formFields.name.isValid && formFields.name.isTouched}
            errorMessage="이름은 2자 이상 10자 이하로 입력해주세요."
          />
        </View>
        <View style={styles.heading}>
          <Heading title="생년월일 입력하기(8자리)" />
          <CommonInput
            style={{ width: width - 56 }}
            defaultValue=""
            value={formFields.birth.value}
            onChangeText={onUserBirthChangeText}
            placeholder="생년월일을 입력하세요."
            isError={!formFields.birth.isValid && formFields.birth.isTouched}
            errorMessage="생년월일은 8자리 숫자로 입력해주세요."
          />
        </View>
        <View style={styles.heading}>
          <Heading title="성별 선택하기" />
          <GenderSelector
            selected={formFields.gender.value as '남성' | '여성' | ''}
            onSelect={(val) => setFieldValue('gender', val, (value) => value === '남성' || value === '여성')}
            isError={!formFields.gender.value && formFields.gender.isTouched}
            errorMessage="성별을 선택해주세요."
          />
        </View>
        {formFields.name.isValid && formFields.birth.isValid && formFields.gender.isValid && (
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <TermsItem
              isChecked={formFields.agreedToPrivacyPolicy}
              onPress={() => setAgreedToPrivacyPolicy(!formFields.agreedToPrivacyPolicy)}
              title="개인정보 처리방침"
            />
            <TermsItem
              isChecked={formFields.agreedToTermsOfService}
              onPress={() => setAgreedToTermsOfService(!formFields.agreedToTermsOfService)}
              title="서비스 이용약관"
            />
          </View>
        )}
      </KeyboardScrollContainer>
      <BottomButtonContainer isKeyboardVisible={isKeyboardVisible}>
        {formFields.agreedToPrivacyPolicy && formFields.agreedToTermsOfService && (
          <CommonButton title="회원가입 완료하기" onPress={handleButtonPress} isKeyboardVisible={isKeyboardVisible} />
        )}
      </BottomButtonContainer>
    </View>
  );
};

export default SignInfo;
