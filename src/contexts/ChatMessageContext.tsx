import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface ChatMessage {
  chatroomId: number;
  content: string;
  createdAt: string;
  type: 'sentChat' | 'receivedChat';
}

interface ChatMessageContextType {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
}

const ChatMessageContext = createContext<ChatMessageContextType | undefined>(undefined);

interface ChatMessageProviderProps {
  children: ReactNode;
}

export const ChatMessageProvider = ({ children }: ChatMessageProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const value = useMemo(() => ({ messages, addMessage }), [messages]);

  return <ChatMessageContext.Provider value={value}>{children}</ChatMessageContext.Provider>;
};

export const useChatMessages = () => {
  const context = useContext(ChatMessageContext);
  if (!context) throw new Error('useChatMessages must be used within ChatMessageProvider');
  return context;
};
