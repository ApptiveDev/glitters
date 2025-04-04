import apiInstance from '@/api/apiInstance';
import { MarkerType } from '@/types/maps';

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data.markers;
  } catch (error) {
    console.error('Error fetching markers:', error);
    throw new Error('Failed to fetch markers');
  }
};

export default getMarkers;
