import { useState } from 'react';

import { InputField } from '@/types/utils';

interface FieldState extends InputField {
  isVerified: boolean;
}

interface FormFields {
  email: FieldState;
  authCode: FieldState;
  password: FieldState;
  name: FieldState;
  birth: FieldState;
  gender: FieldState;
  title: FieldState;
  content: FieldState;
  recheck: string;
  agreedToPrivacyPolicy: boolean;
  agreedToTermsOfService: boolean;
}

const initialField: FieldState = {
  value: '',
  isTouched: false,
  isValid: false,
  isVerified: false,
};

export const useFormFields = () => {
  const [formFields, setFormFields] = useState<FormFields>({
    email: { ...initialField },
    authCode: { ...initialField },
    password: { ...initialField },
    name: { ...initialField },
    birth: { ...initialField },
    gender: { ...initialField },
    title: { ...initialField },
    content: { ...initialField },
    recheck: '',
    agreedToPrivacyPolicy: false,
    agreedToTermsOfService: false,
  });

  const setFieldValue = (
    key: keyof Pick<FormFields, 'email' | 'password' | 'authCode' | 'name' | 'birth' | 'gender' | 'title' | 'content'>,
    value: string,
    validateFn: (val: string) => boolean,
  ) => {
    setFormFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        isTouched: true,
        isValid: validateFn(value),
      },
    }));
  };

  const setFieldVerified = (key: keyof Pick<FormFields, 'email' | 'password' | 'authCode'>, verified: boolean) => {
    setFormFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isVerified: verified,
      },
    }));
  };

  const setRecheckPassword = (value: string) => {
    setFormFields((prev) => ({
      ...prev,
      recheck: value,
    }));
  };

  const setAgreedToPrivacyPolicy = (value: boolean) => {
    setFormFields((prev) => ({
      ...prev,
      agreedToPrivacyPolicy: value,
    }));
  };

  const setAgreedToTermsOfService = (value: boolean) => {
    setFormFields((prev) => ({
      ...prev,
      agreedToTermsOfService: value,
    }));
  };

  return {
    formFields,
    setFieldValue,
    setFieldVerified,
    setRecheckPassword,
    setFormFields,
    setAgreedToPrivacyPolicy,
    setAgreedToTermsOfService,
  };
};

export default useFormFields;
