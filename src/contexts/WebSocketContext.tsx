import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useWebSocket } from '@/hooks/useWebSocket';
import { getToken } from '@/utils/authStorage';

const WebSocketContext = createContext<{
  sendChat: (chatroomId: number, content: string) => void;
  messagesByChatroom: Record<number, { content: string; createdAt: string }>;
}>({
  sendChat: () => {},
  messagesByChatroom: {},
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  const { sendChat, messagesByChatroom } = useWebSocket(token ?? '');

  const contextValue = useMemo(() => ({ sendChat, messagesByChatroom }), [sendChat, messagesByChatroom]);

  if (!token) return null;

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => useContext(WebSocketContext);
