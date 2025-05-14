import apiInstance from './apiInstance';

type BlockUserRequest = {
  blockType: 'post' | 'chatroom';
  postId?: number;
  chatroomId?: number;
};

export const blockUser = async ({ blockType, postId, chatroomId }: BlockUserRequest) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append('blockType', blockType);
    if (blockType === 'post' && postId !== undefined) {
      queryParams.append('postId', postId.toString());
    }
    if (blockType === 'chatroom' && chatroomId !== undefined) {
      queryParams.append('chatroomId', chatroomId.toString());
    }

    const response = await apiInstance.post(`/blocks?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export default blockUser;
