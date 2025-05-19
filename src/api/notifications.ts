import apiInstance from '@/api/apiInstance';
import { getErrorMessage } from '@/utils/errorMessage';

export const updateNotificationToken = async (token: string) => {
  try {
    await apiInstance.put('/notifications', { token });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const postLocation = async (latitude: number, longitude: number) => {
  try {
    await apiInstance.post('/locations', { latitude, longitude });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
