import apiInstance from '@/api/apiInstance';

export const updateNotificationToken = async (token: string) => {
  try {
    await apiInstance.put('/notifications', { token });
  } catch (error) {
    console.error('Error updating notification token:', error);
    throw new Error('Failed to update notification token');
  }
};

export const postLocation = async (latitude: number, longitude: number) => {
  try {
    await apiInstance.post('/locations', { latitude, longitude });
  } catch (error) {
    console.error('Error posting location:', error);
    throw new Error('Failed to post location');
  }
};
