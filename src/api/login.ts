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
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiInstance.post('/logout');
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export default getSchoolList;
