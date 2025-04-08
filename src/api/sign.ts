import apiInstance from '@/api/apiInstance';
import { SchoolListResponse } from '@/types/sign';

export const getSchoolList = async (): Promise<SchoolListResponse> => {
  try {
    if (__DEV__) {
      return {
        institutions: [
          {
            id: 1,
            name: '부산대학교',
            emailDomain: '@pusan.ac.kr',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
    }
    const response = await apiInstance.get('/institutions');
    return response.data;
  } catch (error) {
    console.error('Error fetching school list:', error);
    throw new Error('Failed to fetch school list');
  }
};

export const verifyEmail = async (email: string) => {
  try {
    const response = await apiInstance.post('/verify-email', {
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw new Error('Failed to verify email');
  }
};

export const checkAuthCode = async (email: string, code: string) => {
  try {
    const response = await apiInstance.put('/verify-email', {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying auth code:', error);
    throw new Error('Failed to verify auth code');
  }
};
