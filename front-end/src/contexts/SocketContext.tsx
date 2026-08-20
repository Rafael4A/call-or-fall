import {
  createContext,
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

const SocketContext = createContext<RefObject<Socket | null>>({
  current: null,
});

//eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: Readonly<PropsWithChildren>) {
  const socketRef = useRef<Socket>(null);

  const hasLostConnection = useRef(false);
  const intentionalDisconnection = useRef(false);

  const { openAlert } = useSnackAlert();
  const { t } = useTranslation();

  useEffect(() => {
    intentionalDisconnection.current = false;
    return () => {
      intentionalDisconnection.current = true;
    };
  }, []);

  useEffect(() => {
    // TODO: Enable later
    // socket.current?.on(SOCKET_EVENTS.PlayerDisconnected, (msg) => {
    //   toast.error(msg);
    // });

    socketRef.current?.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("disconnected from socket");
      if (!intentionalDisconnection)
        openAlert({ severity: "error", content: t("lost-connection") });
      hasLostConnection.current = true;
    });

    socketRef.current?.on(SOCKET_EVENTS.CONNECT, () => {
      if (hasLostConnection.current) {
        openAlert({ severity: "error", content: t("reconnected") });
        hasLostConnection.current = false;
      }
    });

    return () => {
      for (const prop in Object.values(SOCKET_EVENTS)) {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        socketRef.current?.off(prop);
      }
      socketRef.current?.disconnect();
      hasLostConnection.current = false;
    };
  }, [socketRef, hasLostConnection, intentionalDisconnection, openAlert]);

  return <SocketContext value={socketRef}>{children}</SocketContext>;
}
