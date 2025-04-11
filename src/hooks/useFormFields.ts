import { useState } from 'react';

import { InputField } from '@/types/utils';

interface FieldState extends InputField {
  isVerified: boolean;
}

interface FormFields {
  email: FieldState;
  authCode: FieldState;
  password: FieldState;
  recheck: string;
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
    recheck: '',
  });

  const setFieldValue = (
    key: keyof Pick<FormFields, 'email' | 'password' | 'authCode'>,
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

  return {
    formFields,
    setFieldValue,
    setFieldVerified,
    setRecheckPassword,
    setFormFields,
  };
};

export default useFormFields;
