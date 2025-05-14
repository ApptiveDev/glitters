export interface Chat {
  id: number;
  peerNickname: string;
  myNickname: string;
  post: {
    id: number;
    iconIdx: number;
    title: string;
    content: string;
    createdAt: string;
    expiresAt: string;
    address: string;
    isDeactivated: true;
    likeCount: number;
    viewCount: number;
  };
  lastMessage: {
    createdAt: string;
    content: string;
  };
  unreadMessageCount: number;
}

export interface ChatListResponse {
  chatrooms: Chat[];
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  type: 'sentChat' | 'receivedChat';
}

export interface ChatMessageResponse {
  chats: ChatMessage[];
  lastChatId: number;
}

export interface CreateChatRequest {
  postId: number;
  content: string;
}

export interface CreateChatResponse {
  type: string;
  chatroomId: number;
  content: string;
  createdAt: string;
  authorNickname: string;
}
