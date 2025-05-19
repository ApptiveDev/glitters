import apiInstance from '@/api/apiInstance';

export const updateNotificationToken = async (token: string) => {
  try {
    await apiInstance.put('/notifications', { token });
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const postLocation = async (latitude: number, longitude: number) => {
  try {
    await apiInstance.post('/locations', { latitude, longitude });
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};
