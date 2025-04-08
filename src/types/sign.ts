import apiInstance from '@/api/apiInstance';

export interface SchoolListType {
  id: number;
  name: string;
  emailDomain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolListResponse {
  institutions: SchoolListType[];
}

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
