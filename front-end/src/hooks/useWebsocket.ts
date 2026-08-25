import { useCallback } from "react";
import io, { type Socket } from "socket.io-client";
import { STORAGE_KEYS } from "../constants";
import { useSocketContext } from "../contexts/SocketContext";
import { OfflineSocketMock } from "../local-game-helpers";

export function useWebsocket() {
  const { socketRef, initGlobalListeners } = useSocketContext();

  const connectSocket = useCallback(
    (roomId: string, playerId: string) => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const isOffline = sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME);

      if (isOffline) {
        socketRef.current = new OfflineSocketMock() as unknown as Socket;
      } else {
        socketRef.current = io(location.origin, {
          query: { roomId, playerId },
          path: "/api/socket.io",
        });
      }

      initGlobalListeners();

      socketRef.current.onAny((event: string, ...args: unknown[]) => {
        console.log(
          `[${isOffline ? "OFFLINE" : "ONLINE"}] event received:`,
          event,
          "args:",
          args,
        );
      });
    },
    [socketRef, initGlobalListeners],
  );

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, [socketRef]);

  const registerEvent = (
    event: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void,
  ) => {
    socketRef.current?.on(event, callback);
  };

  const emitEvent = (event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  };

  return {
    connectSocket,
    disconnectSocket,
    registerEvent,
    emitEvent,
    socketRef,
  };
}
