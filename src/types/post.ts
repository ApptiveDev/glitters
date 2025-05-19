export interface PostRequestType {
  title: string;
  content: string;
  address: string;
  iconIdx: number;
  markerIdx: number;
  latitude: number;
  longitude: number;
}

export interface PostResponseType {
  postId: number;
  markerId: number;
}

export interface GetPostResponseType {
  id: number;
  iconIdx: number;
  markerIdx: number;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string;
  address: string;
  addressDetail: string;
  isDeactivated: boolean;
  likeCount: number;
  viewCount: number;
  isWrittenBySelf: boolean;
  isLikedBySelf: boolean;
}

export type Post = PostRequestType & PostResponseType;

export interface ReportRequestType {
  reportType: 'POST_REPORT' | 'CHATROOM_REPORT';
  postId?: number;
  chatroomId?: number;
  reason: string;
}
