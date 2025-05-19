import apiInstance from '@/api/apiInstance';
import { ChatListResponse, ChatMessageResponse, CreateChatRequest } from '@/types/chat';
import { getErrorMessage } from '@/utils/errorMessage';

export const createChat = async ({ postId, content }: CreateChatRequest) => {
  try {
    const response = await apiInstance.post('/chatrooms', {
      postId,
      content,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getChatList = async (): Promise<ChatListResponse> => {
  try {
    const response = await apiInstance.get('/chatrooms');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
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
    throw new Error(getErrorMessage(error));
  }
};

export const deleteChatroom = async (chatroomId: number) => {
  try {
    const response = await apiInstance.delete(`/chatrooms/${chatroomId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
