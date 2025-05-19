import apiInstance from '@/api/apiInstance';
import { PostCreationStatusType } from '@/types/post';

export const getPostById = async ({ postId }: { postId: number }) => {
  try {
    const response = await apiInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const getPostCreationStatus = async (): Promise<PostCreationStatusType> => {
  try {
    const response = await apiInstance.get('/posts/availability');
    return response.data;
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export default getPostById;
