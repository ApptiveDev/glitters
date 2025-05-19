import apiInstance from '@/api/apiInstance';
import { InstitutionBoundType, MarkerType } from '@/types/maps';
import { PostRequestType, ReportRequestType } from '@/types/post';
import { getErrorMessage } from '@/utils/errorMessage';

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data.markers;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createMarker = async (marker: PostRequestType): Promise<void> => {
  try {
    await apiInstance.post('/posts', marker);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const addLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.post(`/likes?postId=${postId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/likes?postId=${postId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteMarker = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/posts/${postId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const reportMarker = async (report: ReportRequestType): Promise<void> => {
  try {
    await apiInstance.post(`/reports`, report);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBoundMarkers = async (): Promise<InstitutionBoundType[]> => {
  try {
    const response = await apiInstance.get('/institutions/bounds');
    return response.data.bounds;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
