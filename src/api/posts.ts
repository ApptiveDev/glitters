import apiInstance from '@/api/apiInstance';

export const getPostById = async ({ postId }: { postId: number }) => {
  try {
    const response = await apiInstance.get(`/posts/${postId}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch posts');
  }
};

export default getPostById;
