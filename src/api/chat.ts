import apiInstance from '@/api/apiInstance';
import { CreateChatRequest, CreateChatResponse } from '@/types/chat';

export const createChat = async ({ postId, content }: CreateChatRequest) => {
  try {
    const response = await apiInstance.post('/chatrooms', {
      postId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw new Error('Failed to create chat');
  }
};

export const getChatList = async (): Promise<CreateChatResponse> => {
  try {
    const response = await apiInstance.get('/chatrooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw new Error('Failed to fetch chat list');
  }
};
