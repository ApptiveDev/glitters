import apiInstance from '@/api/apiInstance';
import { PostCreationStatusType } from '@/types/post';
import { getErrorMessage } from '@/utils/errorMessage';

export const getPostById = async ({ postId }: { postId: number }) => {
  try {
    const response = await apiInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPostCreationStatus = async (): Promise<PostCreationStatusType> => {
  try {
    const response = await apiInstance.get('/posts/availability');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default getPostById;
