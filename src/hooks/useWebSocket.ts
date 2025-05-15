/* eslint-disable consistent-return */
import { queryClient } from 'app/_layout';
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (token: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messagesByChatroom, setMessagesByChatroom] = useState<
    Record<number, { content: string; createdAt: string; type: 'sentChat' | 'receivedChat' }>
  >({});

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`wss://banjjak.me:8444?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log('연결됨');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('메시지 수신:', data);
      if (data.type === 'receivedChat') {
        setMessagesByChatroom((prev) => ({
          ...prev,
          [data.chatroomId]: {
            content: data.content,
            createdAt: data.createdAt,
            type: 'receivedChat',
          },
        }));

        queryClient.setQueryData(['chatRooms'], (prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            chatrooms: prev.chatrooms.map((room: any) =>
              room.id === data.chatroomId
                ? {
                    ...room,
                    lastMessage: {
                      content: data.content,
                      createdAt: data.createdAt,
                    },
                    unreadMessageCount: (room.unreadMessageCount ?? 0) + 1,
                  }
                : room,
            ),
          };
        });
      }
    };

    ws.onclose = () => console.log('닫힘');
    ws.onerror = (err) => console.error('에러:', err);

    return () => {
      ws.close();
    };
  }, [token]);

  const sendChat = (chatroomId: number, content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'sentChat', chatroomId, content }));
      setMessagesByChatroom((prev) => ({
        ...prev,
        [chatroomId]: {
          content,
          createdAt: new Date().toISOString(),
          type: 'sentChat',
        },
      }));
    } else {
      console.warn('WebSocket이 아직 연결되지 않았습니다.');
    }
  };

  const readChat = (chatroomId: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'readChat', chatroomId }));
    } else {
      console.warn('WebSocket이 아직 연결되지 않았습니다.');
    }
  };

  return { sendChat, readChat, messagesByChatroom };
};

export default useWebSocket;
