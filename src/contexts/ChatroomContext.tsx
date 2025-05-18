import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Chat } from '@/types/chat';

interface ChatroomContextType {
  selectedChatroom: Chat | null;
  setSelectedChatroom: (chatroom: Chat) => void;
}

const ChatroomContext = createContext<ChatroomContextType | undefined>(undefined);

export const ChatroomProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChatroom, setSelectedChatroom] = useState<Chat | null>(null);

  const contextValue = React.useMemo(() => ({ selectedChatroom, setSelectedChatroom }), [selectedChatroom]);

  return <ChatroomContext.Provider value={contextValue}>{children}</ChatroomContext.Provider>;
};

export const useChatroom = () => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error('useChatroom must be used within a ChatroomProvider');
  }
  return context;
};
