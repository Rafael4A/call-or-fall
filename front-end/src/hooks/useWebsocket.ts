import io, { type Socket } from "socket.io-client";
import { STORAGE_KEYS } from "../constants";
import { useSocketContext } from "../contexts";
import { OfflineSocketMock } from "../local-game-helpers";

export function useWebsocket() {
  const socketRef = useSocketContext();

  const connectSocket = (roomId: string, playerId: string) => {
    //console.log("called", socketRef.current);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const isOffline = sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME);

    if (isOffline) {
      // Initialize our local event bus to run the offline match
      socketRef.current = new OfflineSocketMock() as unknown as Socket;
    } else {
      // Connect to the real server
      socketRef.current = io(location.origin, {
        query: { roomId, playerId },
        path: "/api/socket.io",
      });
    }

    socketRef.current.onAny((event: string, ...args: unknown[]) => {
      console.log(
        `[${isOffline ? "OFFLINE" : "ONLINE"}] event received:`,
        event,
        "args:",
        args,
      );
    });
  };

  const registerEvent = (
    event: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void,
  ) => {
    socketRef.current?.on(event, callback);
  };

  // TODO: DELETE IF UNUSED, AGNOSTIC EMITTER
  const emitEvent = (event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  };

  return { connectSocket, registerEvent, emitEvent, socketRef };
}
