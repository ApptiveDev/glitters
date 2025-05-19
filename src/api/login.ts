import { getErrorMessage } from '@/utils/errorMessage';

import apiInstance from './apiInstance';

interface SchoolListType {
  id: number;
  name: string;
  email_domain: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SchoolListResponse {
  institutions: SchoolListType[];
}

export const getSchoolList = async (): Promise<SchoolListResponse | undefined> => {
  try {
    const response = await apiInstance.get('/institutions');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiInstance.post('/logout');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default getSchoolList;
