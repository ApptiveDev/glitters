import { AxiosError } from 'axios';
import { Alert } from 'react-native';

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
  }
  return '알 수 없는 오류가 발생했습니다.';
};

export const showErrorAlert = (title: string, error: unknown) => {
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
  Alert.alert(title, message);
};
