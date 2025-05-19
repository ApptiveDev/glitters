import apiInstance from '@/api/apiInstance';
import { PostCreationStatusType } from '@/types/post';

export const getPostById = async ({ postId }: { postId: number }) => {
  try {
    const response = await apiInstance.get(`/posts/${postId}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

export const getPostCreationStatus = async (): Promise<PostCreationStatusType> => {
  try {
    const response = await apiInstance.get('/posts/availability');
    return response.data;
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

export default getPostById;
