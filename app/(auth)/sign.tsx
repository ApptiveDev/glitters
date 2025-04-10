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
import { SchoolListResponse } from '@/types/utils';

import styles from './styles';

interface InputStatus {
  loading: boolean;
  checked: boolean;
}

interface FieldValidation {
  emailFormatValid: boolean;
  emailSent: boolean;
  authCodeFormatValid: boolean;
  authCodeVerified: boolean;
}

export const Sign = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [localPart, setLocalPart] = useState<string>('');
  const { width } = Dimensions.get('window');
  const [authCode, setAuthCode] = useState<string>('');
  const [inputStatus, setInputStatus] = useState<InputStatus>({ loading: false, checked: false });
  const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
    emailFormatValid: false,
    emailSent: false,
    authCodeFormatValid: false,
    authCodeVerified: false,
  });

  const { user, updateUser } = useUser();

  const isKeyboardVisible = useKeyboardVisible();

  const { formatted, isRunning, start, reset } = useCountdownTimer(300);

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
    const isValidFormat = /^[a-zA-Z0-9._%+-]+$/.test(text);
    if (isValidFormat) {
      setLocalPart(text);
      setFieldValidation({ ...fieldValidation, emailFormatValid: true });
    }
  };

  const buttonPress = async () => {
    reset();
    start();
    try {
      await verifyEmailMutate(`${localPart}${domain}`);
      setFieldValidation({ ...fieldValidation, emailSent: true });
    } catch (error) {
      console.error('Error verifying email:', error);
      setFieldValidation({ ...fieldValidation, emailSent: false });
    }
  };

  const debouncedCheck = useMemo(() => {
    return debounce(async (email: string, code: string) => {
      try {
        setInputStatus({ loading: true, checked: false });
        await checkAuthCodeMutate({ email, code });
        setInputStatus({ loading: false, checked: true });
        setFieldValidation((prev) => ({
          ...prev,
          authCodeVerified: true,
        }));
      } catch (error) {
        console.error('Error verifying auth code:', error);
        setInputStatus({ loading: false, checked: false });
        setFieldValidation((prev) => ({
          ...prev,
          authCodeVerified: false,
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

      if (text.length === 6 && fieldValidation.emailSent) {
        const email = `${localPart}${domain}`;
        setFieldValidation((prev) => ({
          ...prev,
          authCodeFormatValid: true,
        }));
        debouncedCheck(email, text);
      }
    } else {
      setInputStatus({ loading: false, checked: false });
      setFieldValidation((prev) => ({
        ...prev,
        authCodeFormatValid: false,
      }));
    }
  };

  useEffect(() => {
    if (user.email) {
      router.push('./sign-info');
    }
  }, [user.email]);

  const goToNextScreen = () => {
    updateUser({
      email: `${localPart}${domain}`,
    });
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
        <View style={styles.element}>
          {!domain && <Heading title="학교 선택하기" />}
          <CustomDropdown
            data={formattedList || []}
            value={domain}
            setValue={setDomain}
            style={{ width: width - 56 }}
          />
        </View>

        {domain && (
          <View style={styles.element}>
            <Heading title="학교 이메일 입력하기" />
            <View style={[styles.inputContainer, { flexDirection: 'row' }]}>
              <CommonInput
                style={{ flex: 1, width: width / 2 - 28 }}
                isValid={fieldValidation.emailFormatValid}
                defaultValue=""
                value={localPart}
                onChangeText={onEmailChangeText}
                editable={!fieldValidation.emailSent}
              />
              <CommonInput
                style={{ flex: 1, width: width / 2 - 28 }}
                defaultValue={domain}
                isValid={fieldValidation.emailFormatValid}
                editable={false}
              />
            </View>
          </View>
        )}

        {fieldValidation.emailSent ? (
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
              editable={!fieldValidation.authCodeVerified && isRunning}
            />
            {!fieldValidation.authCodeVerified && (
              <Text style={{ fontSize: 12, flexDirection: 'row', paddingHorizontal: 8 }}>
                <Text style={{ color: colors.text.white }}>인증번호를 받지 못했나요? </Text>
                <Text
                  style={{ color: colors.text.white, fontWeight: 'bold', textDecorationLine: 'underline' }}
                  onPress={buttonPress}
                >
                  재전송하기
                </Text>
              </Text>
            )}
          </View>
        ) : (
          <View style={{ flex: 1, width: '100%', gap: 8 }} />
        )}
      </KeyboardScrollContainer>

      <BottomButtonContainer isKeyboardVisible={isKeyboardVisible}>
        {fieldValidation.emailFormatValid && !fieldValidation.emailSent ? (
          <CommonButton title="인증번호 받기" onPress={buttonPress} isKeyboardVisible={isKeyboardVisible} />
        ) : (
          <View
            style={{
              height: 48,
              width: '100%',
            }}
          />
        )}
        {fieldValidation.authCodeVerified && (
          <CommonButton title="정보 입력하기" onPress={goToNextScreen} isKeyboardVisible={isKeyboardVisible} />
        )}
      </BottomButtonContainer>
    </View>
  );
};

export default Sign;
