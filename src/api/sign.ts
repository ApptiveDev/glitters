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

export default getSchoolList;
