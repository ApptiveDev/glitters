import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { checkAuthCode, verifyEmail } from '@/api/auth';
import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import CommonInput from '@/components/common/Input';
import { Spacing } from '@/components/common/Spacing';
import { useCountdownTimer } from '@/hooks/useCountDownTimer';
import { useFormFields } from '@/hooks/useFormFields';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';

export const FindPassword = () => {
  const { formFields, setFieldValue, setFieldVerified } = useFormFields();
  const { width } = Dimensions.get('window');
  const [authCode, setAuthCode] = useState('');
  const [isSend, setIsSend] = useState(false);

  const useCheckAuthCodeMutation = () => {
    return useMutation({
      mutationFn: ({ email, code, type }: { email: string; code: string; type: 'REGISTER' | 'RESET_PASSWORD' }) =>
        checkAuthCode(email, code, type),
    });
  };
  const { mutateAsync: checkAuthCodeMutate } = useCheckAuthCodeMutation();
  const { formatted, isRunning, start, reset } = useCountdownTimer(300);

  const emailValidate = (val: string) =>
    val.length >= 2 && val.length < 32 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);

  const onEmailChangeText = (value: string) => {
    setFieldValue('email', value, emailValidate);
  };

  const onAuthCodeChangeText = (text: string) => {
    const isValidFormat = /^[0-9]*$/.test(text);
    if (isValidFormat) {
      setAuthCode(text);
    }
    setFieldValue('authCode', text, (val) => {
      return val.length === 6;
    });
  };

  const verifyAuthCode = async () => {
    try {
      await checkAuthCodeMutate({ email: formFields.email.value, code: authCode, type: 'RESET_PASSWORD' });
      setFieldVerified('authCode', true);
    } catch (error) {
      showErrorAlert('인증번호 오류', error);
      setFieldVerified('authCode', false);
      setFieldValue('authCode', '', () => false);
      setAuthCode('');
    }
  };

  const sendEmail = async () => {
    try {
      reset();
      start();
      setIsSend(true);
      Toast.show({
        type: 'success',
        text1: '인증번호 전송 완료',
        text2: '메일함을 확인해주세요.',
      });
      await verifyEmail(formFields.email.value, 'RESET_PASSWORD');
      setFieldVerified('email', true);
    } catch (error) {
      setIsSend(true);
      showErrorAlert('이메일 인증 오류', error);
      setFieldVerified('email', false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
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
          비밀번호 찾기
        </Text>
        <Spacing height={24} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CommonInput
            placeholder="이메일"
            style={{
              width: width - 136,
            }}
            onChangeText={onEmailChangeText}
            value={formFields.email.value}
            isValid={formFields.email.isValid}
            isError={!formFields.email.isValid && formFields.email.isTouched}
            errorMessage="이메일 형식이 아닙니다."
            editable={!formFields.email.isVerified || !isSend}
          />
          <TouchableOpacity
            onPress={sendEmail}
            style={{
              backgroundColor:
                formFields.email.isVerified || isSend || !formFields.email.isValid
                  ? colors.gray.light
                  : colors.yellow.main,
              borderRadius: 4,
              width: 80,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={formFields.email.isVerified || isSend || !formFields.email.isValid}
          >
            <Text
              style={{
                fontSize: 10,
                color: colors.background,
                lineHeight: 12,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              인증번호 전송
            </Text>
          </TouchableOpacity>
        </View>
        {formFields.email.isVerified && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ gap: 8, marginTop: 12 }}>
              <CommonInput
                style={{ width: width - 136 }}
                defaultValue=""
                value={authCode}
                onChangeText={onAuthCodeChangeText}
                placeholder="인증번호를 입력하세요."
                guideText={isRunning ? `${formatted}분 남음` : ''}
                isGuide
                editable={!formFields.authCode.isVerified && isRunning}
              />
              <Text style={{ fontSize: 12, flexDirection: 'row', paddingHorizontal: 8 }}>
                <Text style={{ color: colors.text.white }}>인증번호를 받지 못했나요? </Text>
                <Text
                  style={{ color: colors.text.white, fontWeight: 'bold', textDecorationLine: 'underline' }}
                  onPress={sendEmail}
                >
                  재전송하기
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={verifyAuthCode}
              style={{
                backgroundColor: formFields.authCode.isValid ? colors.yellow.main : colors.gray.light,
                borderRadius: 4,
                width: 80,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={formFields.authCode.isVerified || !isRunning}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: colors.background,
                  lineHeight: 12,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                인증번호 확인
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Spacing height={24} />
        {formFields.authCode.isVerified && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/(auth)/find-password/reset-password',
                params: {
                  email: formFields.email.value,
                },
              });
            }}
            style={{
              backgroundColor: colors.yellow.main,
              borderRadius: 4,
              width: '100%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.background,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              비밀번호 재설정하기
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default FindPassword;
