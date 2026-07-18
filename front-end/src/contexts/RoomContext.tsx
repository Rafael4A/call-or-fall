import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext, type PropsWithChildren } from "react";
import { GAME_STATE, SOCKET_EVENTS, type RoomDTO } from "shared-code";
import { getRoomRequest } from "../api";
import { STORAGE_KEYS, VIEWS } from "../constants";
import { useWebsocket } from "../hooks";
import { useViewContext } from "./ViewContext";

const RoomContext = createContext<{
  updateConnection: () => void;
  room: UseQueryResult<RoomDTO, unknown>;
}>({
  updateConnection: () => {
    throw new Error("updateConnection function not implemented");
  },
  room: {} as UseQueryResult<RoomDTO, unknown>,
});

//eslint-disable-next-line react-refresh/only-export-components
export function useRoomContext() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: Readonly<PropsWithChildren>) {
  const { setView } = useViewContext();

  const { connectSocket, registerEvent } = useWebsocket();

  const room = useQuery({
    queryKey: ["room"],
    queryFn: () =>
      getRoomRequest(
        sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!,
        sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID)!,
      ),
  });

  const updateConnection = () => {
    const roomId = sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!;
    const userId = sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID)!;
    if (!roomId || !userId) {
      setView(VIEWS.HOME);
    }

    if (room.data?.gameState === GAME_STATE.Playing) setView(VIEWS.GAME);

    connectSocket(roomId, userId);
    registerEvent(SOCKET_EVENTS.ROOM_UPDATE, () => {
      console.log("Socket update received");
      room.refetch();
    });
    if (room.isError) setView(VIEWS.HOME);
  };

  return (
    <RoomContext value={{ updateConnection, room }}>{children}</RoomContext>
  );
}
