import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type PropsWithChildren,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import { SOCKET_EVENTS } from "shared-code";
import type { Socket } from "socket.io-client";
import { useSnackAlert } from "./useSnackAlert";

type SocketContextType = {
  socketRef: RefObject<Socket | null>;
  initGlobalListeners: () => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

//eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
}

export function SocketProvider({ children }: Readonly<PropsWithChildren>) {
  const socketRef = useRef<Socket>(null);
  const hasLostConnection = useRef(false);

  const { openAlert } = useSnackAlert();
  const { t } = useTranslation();

  const initGlobalListeners = useCallback(() => {
    if (!socketRef.current) return;

    socketRef.current.off(SOCKET_EVENTS.DISCONNECT);
    socketRef.current.off(SOCKET_EVENTS.CONNECT);

    socketRef.current.on(SOCKET_EVENTS.DISCONNECT, (reason?: string) => {
      if (reason !== "io client disconnect") {
        openAlert({ severity: "error", content: t("lost-connection") });
        hasLostConnection.current = true;
      }
    });

    socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
      if (hasLostConnection.current) {
        openAlert({ severity: "error", content: t("reconnected") });
        hasLostConnection.current = false;
      }
    });
  }, [openAlert, t]);

  useEffect(() => {
    return () => {
      for (const prop in Object.values(SOCKET_EVENTS)) {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        socketRef.current?.off(prop);
      }
      socketRef.current?.disconnect();
      hasLostConnection.current = false;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketRef, initGlobalListeners }}>
      {children}
    </SocketContext.Provider>
  );
}
