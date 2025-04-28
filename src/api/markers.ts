import apiInstance from '@/api/apiInstance';
import { MarkerType } from '@/types/maps';
import { PostRequestType, ReportRequestType } from '@/types/post';

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data.markers;
  } catch {
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

export const addLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.post(`/likes?postId=${postId}`);
  } catch (error) {
    console.error('Error adding like:', error);
    throw new Error('Failed to add like');
  }
};

export const deleteLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/likes?postId=${postId}`);
  } catch (error) {
    console.error('Error deleting like:', error);
    throw new Error('Failed to delete like');
  }
};

export const deleteMarker = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/posts/${postId}`);
  } catch (error) {
    console.error('Error deleting marker:', error);
    throw new Error('Failed to delete marker');
  }
};

export const reportMarker = async (report: ReportRequestType): Promise<void> => {
  try {
    await apiInstance.post(`/reports`, report);
  } catch (error) {
    console.error('Error reporting marker:', error);
    throw new Error('Failed to report marker');
  }
};
