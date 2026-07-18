import io from "socket.io-client";
import { useSocketContext } from "../contexts";

export function useWebsocket() {
  const socketRef = useSocketContext();

  const connectSocket = (roomId: string, playerId: string) => {
    //console.log("called", socketRef.current);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(location.origin, {
      query: {
        roomId,
        playerId,
      },
      path: "/api/socket.io",
    });
    socketRef.current.onAny((event, ...args) => {
      console.log("# event received:");
      console.log(event);
      console.log(args);
    });
  };

  const registerEvent = (
    event: string,
    callback: (...args: unknown[]) => void,
  ) => {
    socketRef.current?.on(event, callback);
  };

  return { connectSocket, registerEvent, socketRef };
}
