import apiInstance from '@/api/apiInstance';
import { UserRegistrationRequest } from '@/types/user';
import { SchoolListResponse } from '@/types/utils';

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
          {
            id: 2,
            name: '서울대학교',
            emailDomain: '@snu.ac.kr',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            name: '연세대학교',
            emailDomain: '@yonsei.ac.kr',
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

export const registerUser = async (user: UserRegistrationRequest) => {
  const { email, password, name, birth, termsAccepted } = user;
  try {
    const response = await apiInstance.post('/register', {
      email,
      password,
      name,
      birth,
      termsAccepted,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};
