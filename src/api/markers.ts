import apiInstance from '@/api/apiInstance';
import { InstitutionBoundType, MarkerType } from '@/types/maps';
import { PostRequestType, ReportRequestType } from '@/types/post';

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await apiInstance.get('/markers');
    return response.data.markers;
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const createMarker = async (marker: PostRequestType): Promise<void> => {
  try {
    await apiInstance.post('/posts', marker);
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const addLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.post(`/likes?postId=${postId}`);
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const deleteLike = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/likes?postId=${postId}`);
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const deleteMarker = async (postId: number): Promise<void> => {
  try {
    await apiInstance.delete(`/posts/${postId}`);
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const reportMarker = async (report: ReportRequestType): Promise<void> => {
  try {
    await apiInstance.post(`/reports`, report);
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const getBoundMarkers = async (): Promise<InstitutionBoundType[]> => {
  try {
    const response = await apiInstance.get('/institutions/bounds');
    return response.data.bounds;
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};
