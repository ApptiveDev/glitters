import apiInstance from '@/api/apiInstance';
import { UserInfoResponse, UserLoginRequest, UserRegistrationRequest } from '@/types/auth';
import { SchoolListResponse } from '@/types/utils';

export const getSchoolList = async (): Promise<SchoolListResponse> => {
  try {
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

export const loginUser = async (userLogin: UserLoginRequest) => {
  const { email, password } = userLogin;
  try {
    const response = await apiInstance.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch {
    throw new Error('Failed to login user');
  }
};

export const withdrawUser = async () => {
  try {
    const response = await apiInstance.delete('/members/me');
    return response.data;
  } catch (error) {
    console.error('Error withdrawing user:', error);
    throw new Error('Failed to withdraw user');
  }
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response = await apiInstance.get('/members/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw new Error('Failed to fetch user info');
  }
};
