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

export const getSchoolList = async (): Promise<SchoolListResponse> => {
  try {
    const response = await apiInstance.get('/institutions');
    return response.data;
  } catch (error) {
    console.error('Error fetching school list:', error);
    throw new Error('Failed to fetch school list');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiInstance.post('/logout');
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout');
  }
};

export default getSchoolList;
