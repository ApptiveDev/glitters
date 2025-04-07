import apiInstance from '@/api/apiInstance';
import { MarkerType, PostRequestType } from '@/types/maps';

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data.markers;
  } catch (error) {
    console.error('Error fetching markers:', error);
    throw new Error('Failed to fetch markers');
  }
};

export const createMarker = async (marker: PostRequestType): Promise<void> => {
  try {
    await apiInstance.post('/posts', marker);
  } catch (error) {
    console.error('Error creating marker:', error);
    throw new Error('Failed to create marker');
  }
};
