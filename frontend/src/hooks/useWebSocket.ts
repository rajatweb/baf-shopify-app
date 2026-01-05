/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageTypes,
  MessageTemplates,
  WebSocketMessage,
} from "../../../shared/types/socket";

const RECONNECT_DELAY = 4000;

export const useWebSocket = (shop: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const processOrderMessage = (message: WebSocketMessage) => {
    if (Object.values(MessageTypes).includes(message.type)) {
      return (MessageTemplates as any)[message.type](
        message.payload.data?.name
      );
    }
    return message;
  };

  const updateMessages = (newMessage: WebSocketMessage) => {
    setMessages(() => {
      // Remove previous messages for the same order
      // const filteredMessages = prev.filter(
      //   (msg) => msg.payload?.orderId !== newMessage.payload?.orderId
      // );

      // Add new message at the beginning
      return [newMessage].slice(0, 5);
    });
  };

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const isLocalhost = process.env.NODE_ENV === "development";

    const wsProtocol = isLocalhost ? "ws" : "wss";
    const wsHost = isLocalhost
      ? `ws://localhost:${process.env.WS_PORT}/ws?shop=${shop}`
      : `${wsProtocol}//${window.location.host}/ws?shop=${shop}`;



    const ws = new WebSocket(wsHost);

    ws.onopen = () => {

      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        const processedMessage = processOrderMessage(message);
        if (processedMessage) {
          updateMessages(processedMessage as WebSocketMessage);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    ws.onclose = () => {
      
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    wsRef.current = ws;
  }, [shop]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: MessageTypes.MESSAGE,
        payload,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
    reconnect: connect,
  };
};
