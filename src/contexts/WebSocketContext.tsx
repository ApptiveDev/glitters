import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useWebSocket } from '@/hooks/useWebSocket';
import { getToken } from '@/utils/authStorage';

const WebSocketContext = createContext<{
  sendChat: (chatroomId: number, content: string) => void;
  readChat: (chatroomId: number) => void;
  messagesByChatroom: Record<
    number,
    { content?: string; createdAt?: string; type: 'sentChat' | 'receivedChat' | 'error'; message?: string }
  >;
}>({
  sendChat: () => {},
  readChat: () => {},
  messagesByChatroom: {},
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  const { sendChat, readChat, messagesByChatroom } = useWebSocket(token ?? '');

  const contextValue = useMemo(
    () => ({ sendChat, readChat, messagesByChatroom }),
    [sendChat, readChat, messagesByChatroom],
  );

  if (!token) return null;

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => useContext(WebSocketContext);
