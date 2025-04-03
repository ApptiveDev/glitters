import apiInstance from '@/api/apiInstance';
import { MarkerResponse } from '@/types/maps';

export const getMarkers = async (): Promise<MarkerResponse> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data;
  } catch (error) {
    console.error('Error fetching markers:', error);
    throw new Error('Failed to fetch markers');
  }
};

export default getMarkers;
