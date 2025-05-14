import { useEffect, useRef } from 'react';

import { useChatMessages } from '@/contexts/ChatMessageContext';

export const useWebSocket = (token: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { addMessage } = useChatMessages();

  useEffect(() => {
    const ws = new WebSocket(`wss://banjjak.me:8444?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket 연결됨');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('서버로부터 수신:', data);

      if (data.type === 'receivedChat') {
        addMessage({
          chatroomId: data.chatroomId,
          content: data.content,
          createdAt: data.createdAt,
          type: 'receivedChat',
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket 닫힘');
    };

    return () => {
      ws.close();
    };
  }, [addMessage, token]);

  const sendChat = (chatroomId: number, content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'sentChat',
        chatroomId,
        content,
      };

      socketRef.current.send(JSON.stringify(message));

      addMessage({
        chatroomId,
        content,
        createdAt: new Date().toISOString(),
        type: 'sentChat',
      });
    } else {
      console.warn('WebSocket이 아직 연결되지 않았습니다.');
    }
  };

  return {
    sendChat,
  };
};

export default useWebSocket;
