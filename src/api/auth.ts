import apiInstance from '@/api/apiInstance';
import { UserInfoResponse, UserLoginRequest, UserRegistrationRequest } from '@/types/auth';
import { SchoolListResponse } from '@/types/utils';
import { getErrorMessage } from '@/utils/errorMessage';

export const getSchoolList = async (): Promise<SchoolListResponse> => {
  try {
    const response = await apiInstance.get('/institutions');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const verifyEmail = async (email: string) => {
  try {
    const response = await apiInstance.post('/verify-email', {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
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
    throw new Error(getErrorMessage(error));
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
    throw new Error(getErrorMessage(error));
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
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const withdrawUser = async () => {
  try {
    const response = await apiInstance.delete('/members/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response = await apiInstance.get('/members/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
