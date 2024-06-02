import { useCallback } from "react";

export const useWebSocket = () => {
  const getWs = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onclose = () => {
      console.log("disconnected");
    };
    return ws;
  }, []);
  return { getWs };
};
