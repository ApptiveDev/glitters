import apiInstance from '@/api/apiInstance';
import { SchoolListResponse } from '@/types/sign';

export const getSchoolList = async (): Promise<SchoolListResponse> => {
  try {
    const response = await apiInstance.get('/institutions');
    return response.data;
  } catch (error) {
    console.error('Error fetching school list:', error);
    throw new Error('Failed to fetch school list');
  }
};

export default getSchoolList;
