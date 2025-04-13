export interface PostRequestType {
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface PostResponseType {
  postId: number;
  markerId: number;
}

export type Post = PostRequestType & PostResponseType;
