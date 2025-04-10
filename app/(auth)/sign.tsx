import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { checkAuthCode, getSchoolList, verifyEmail } from '@/api/auth';
import { BottomButtonContainer } from '@/components/common/BottomButtonContainer';
import { CommonButton } from '@/components/common/Button';
import CustomDropdown from '@/components/common/Dropdown';
import { Heading } from '@/components/common/Heading';
import CommonInput from '@/components/common/Input';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import { useUser } from '@/contexts/UserContext';
import { useCountdownTimer } from '@/hooks/useCountDownTimer';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import colors from '@/types/colors';
import { InputField, SchoolListResponse } from '@/types/utils';
import { sleep } from '@/utils/sleep';

import styles from './styles';

interface InputStatus {
  loading: boolean;
  checked: boolean;
}

interface AuthField {
  email: InputField & { isVerified: boolean };
  authCode: InputField & { isVerified: boolean };
  password: InputField & { isVerified: boolean };
  recheck: string;
}

export const Sign = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [localPart, setLocalPart] = useState<string>('');
  const { width } = Dimensions.get('window');
  const [authCode, setAuthCode] = useState<string>('');
  const initialField = { value: '', isValid: false, isTouched: false };
  const [inputStatus, setInputStatus] = useState<InputStatus>({ loading: false, checked: false });
  const [authField, setAuthField] = useState<AuthField>({
    email: initialField as InputField & { isVerified: false },
    authCode: initialField as InputField & { isVerified: false },
    password: initialField as InputField & { isVerified: false },
    recheck: '',
  });

  const { user, updateUser } = useUser();

  const isKeyboardVisible = useKeyboardVisible();

  const { formatted, isRunning, start, reset } = useCountdownTimer(300);

  const updateField = (
    key: keyof Pick<AuthField, 'email' | 'password' | 'authCode'>,
    value: string,
    validateFn: (val: string) => boolean,
  ) => {
    setAuthField((prev) => ({
      ...prev,
      [key]: {
        value,
        isTouched: true,
        isValid: validateFn(value),
      },
    }));
  };

  const useVerifyEmailMutation = () => {
    return useMutation({
      mutationFn: (email: string) => verifyEmail(email),
    });
  };

  const useCheckAuthCodeMutation = () => {
    return useMutation({
      mutationFn: ({ email, code }: { email: string; code: string }) => checkAuthCode(email, code),
    });
  };

  const { data } = useQuery<SchoolListResponse>({
    queryKey: ['school_list'],
    queryFn: () => getSchoolList(),
    enabled: true,
  });

  const { mutateAsync: verifyEmailMutate } = useVerifyEmailMutation();
  const { mutateAsync: checkAuthCodeMutate } = useCheckAuthCodeMutation();

  const formattedList = useMemo(() => {
    const list = data?.institutions;
    return list?.map((item) => ({
      label: item.name,
      value: item.emailDomain,
    }));
  }, [data]);

  const onEmailChangeText = (text: string) => {
    setLocalPart(text);
    updateField('email', text, (val) => {
      const isValidFormat = /^[a-zA-Z0-9._%+-]+$/.test(val);
      return val.length >= 2 && val.length < 32 && isValidFormat;
    });
  };

  const buttonPress = async () => {
    reset();
    start();
    try {
      await verifyEmailMutate(`${localPart}${domain}`);
      setAuthField((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          isVerified: true,
        },
      }));
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  const debouncedCheck = useMemo(() => {
    return debounce(async (email: string, code: string) => {
      try {
        setInputStatus({ loading: true, checked: false });
        await checkAuthCodeMutate({ email, code });
        await sleep(500);
        setInputStatus({ loading: false, checked: true });
        setAuthField((prev) => ({
          ...prev,
          authCode: {
            ...prev.authCode,
            isVerified: true,
          },
        }));
      } catch (error) {
        console.error('인증 코드 오류:', error);
        setInputStatus({ loading: false, checked: false });
        setAuthField((prev) => ({
          ...prev,
          authCode: {
            ...prev.authCode,
            isVerified: false,
          },
        }));
      }
    }, 500);
  }, [checkAuthCodeMutate]);

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const onAuthCodeChangeText = (text: string) => {
    const isValidFormat = /^[0-9]*$/.test(text);
    if (isValidFormat) {
      setAuthCode(text);

      if (text.length === 6 && authField.email.isValid) {
        const email = `${localPart}${domain}`;
        updateField('authCode', text, () => true);
        debouncedCheck(email, text);
      }
    } else {
      setInputStatus({ loading: false, checked: false });
      updateField('authCode', text, () => false);
    }
  };

  const onChangePasswordText = (text: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",.<>/?\\|`~]).{10,25}$/;
    const isValid = regex.test(text);
    setAuthField((prev) => ({
      ...prev,
      password: {
        value: text,
        isTouched: true,
        isValid,
        isVerified: prev.password.isVerified,
      },
    }));
  };

  const onRecheckPasswordText = (text: string) => {
    const isPasswordValid = authField.password.value === text;

    setAuthField((prev) => ({
      ...prev,
      recheck: text,
    }));

    if (isPasswordValid) {
      setAuthField((prev) => ({
        ...prev,
        password: {
          ...prev.password,
          isVerified: true,
        },
      }));
    }
  };

  const goToNextScreen = () => {
    updateUser({
      email: `${localPart}${domain}`,
      password: authField.password.value,
    });
  };

  useEffect(() => {
    if (user.email && user.password) {
      router.replace('/sign-info');
    }
  }, [user.email, user.password]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardScrollContainer
        viewStyle={{
          gap: 16,
        }}
      >
        {!domain && (
          <View style={styles.element}>
            <Heading title="학교 선택하기" />
            <CustomDropdown
              data={formattedList || []}
              value={domain}
              setValue={setDomain}
              style={{ width: width - 56 }}
            />
          </View>
        )}

        {domain && (
          <View style={styles.element}>
            <Heading title="학교 이메일 입력하기" />
            <View style={[styles.inputContainer, { flexDirection: 'row' }]}>
              <CommonInput
                style={{ flex: 1, width: width / 2 - 28 }}
                isValid={authField.email.isValid}
                defaultValue=""
                value={localPart}
                onChangeText={onEmailChangeText}
                editable={!authField.authCode.isTouched}
              />
              <CommonInput
                style={{ flex: 1, width: width / 2 - 28 }}
                defaultValue={domain}
                isValid={authField.email.isValid}
                editable={false}
              />
            </View>
          </View>
        )}

        {authField.email.isVerified && !authField.authCode.isVerified && (
          <View style={styles.heading}>
            <Heading title="인증번호 입력하기" />
            <CommonInput
              style={{ width: width - 56 }}
              defaultValue=""
              value={authCode}
              onChangeText={onAuthCodeChangeText}
              placeholder="인증번호를 입력하세요."
              loading={inputStatus.loading}
              checked={inputStatus.checked}
              guideText={`${formatted}분 남음`}
              isGuide
              editable={!authField.authCode.isVerified && isRunning}
            />
            <Text style={{ fontSize: 12, flexDirection: 'row', paddingHorizontal: 8 }}>
              <Text style={{ color: colors.text.white }}>인증번호를 받지 못했나요? </Text>
              <Text
                style={{ color: colors.text.white, fontWeight: 'bold', textDecorationLine: 'underline' }}
                onPress={buttonPress}
              >
                재전송하기
              </Text>
            </Text>
          </View>
        )}
        {authField.authCode.isVerified && (
          <>
            <View style={styles.heading}>
              <Heading title="비밀번호 입력하기" />
              <CommonInput
                style={{ width: width - 56 }}
                secureTextEntry
                defaultValue=""
                value={authField.password.value}
                onChangeText={onChangePasswordText}
                placeholder="이용할 비밀번호를 입력하세요."
                isError={!authField.password.isValid && authField.password.isTouched}
                errorMessage="10자 이상 25자 이내의 영문, 숫자, 특수문자를 조합해주세요."
              />
            </View>

            {authField.password.isValid && (
              <View style={styles.heading}>
                <Heading title="비밀번호 확인하기" />
                <CommonInput
                  style={{ width: width - 56 }}
                  secureTextEntry
                  defaultValue=""
                  value={authField.recheck}
                  onChangeText={onRecheckPasswordText}
                  placeholder="비밀번호를 다시 한 번 입력해주세요."
                  isError={authField.password.value !== authField.recheck}
                  errorMessage="비밀번호가 일치하지 않습니다."
                />
              </View>
            )}
          </>
        )}
      </KeyboardScrollContainer>

      <BottomButtonContainer isKeyboardVisible={isKeyboardVisible}>
        {authField.email.isValid && !authField.email.isVerified && (
          <CommonButton title="인증번호 받기" onPress={buttonPress} isKeyboardVisible={isKeyboardVisible} />
        )}
        {authField.password.isVerified && (
          <CommonButton title="정보 입력하기" onPress={goToNextScreen} isKeyboardVisible={isKeyboardVisible} />
        )}
      </BottomButtonContainer>
    </View>
  );
};

export default Sign;
