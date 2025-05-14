export interface Chat {
  id: number;
  peerNickname: string;
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
}

export interface ChatListResponse {
  chatrooms: Chat[];
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
