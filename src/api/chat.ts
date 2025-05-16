import apiInstance from '@/api/apiInstance';
import { ChatListResponse, ChatMessageResponse, CreateChatRequest } from '@/types/chat';

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

export const getChatList = async (): Promise<ChatListResponse> => {
  try {
    const response = await apiInstance.get('/chatrooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw new Error('Failed to fetch chat list');
  }
};

export const getChatMessages = async (
  chatroomId: number,
  cursor?: number,
  limit?: number,
): Promise<ChatMessageResponse> => {
  try {
    const response = await apiInstance.get(`/chatrooms/${chatroomId}`, {
      params: {
        cursor,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw new Error('Failed to fetch chat messages');
  }
};

export const deleteChatroom = async (chatroomId: number) => {
  try {
    const response = await apiInstance.delete(`/chatrooms/${chatroomId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting chatroom:', error);
    throw new Error('Failed to delete chatroom');
  }
};
