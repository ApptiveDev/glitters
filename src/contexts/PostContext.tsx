import { createContext, useContext, useMemo, useState } from 'react';

import { Post } from '@/types/post';

const initialPostState: Post = {
  postId: 0,
  markerId: 0,
  title: '',
  content: '',
  address: '',
  latitude: 0,
  longitude: 0,
};

type PostContextType = {
  post: Post | null;
  setPost: (Post: Post) => void;
  updatePost: (fields: Partial<Post>) => void;
};

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [post, setPost] = useState<Post>(initialPostState);

  const updatePost = (fields: Partial<Post>) => {
    setPost((prev) => ({ ...prev, ...fields }));
  };

  const value = useMemo(() => ({ post, setPost, updatePost }), [post]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('Error');
  return context;
};
