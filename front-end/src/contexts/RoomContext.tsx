import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  type PropsWithChildren,
} from "react";
import { useTranslation } from "react-i18next";
import {
  GAME_STATE,
  SOCKET_EVENTS,
  type GameState,
  type PlayerLeftEventParams,
  type RoomDTO,
} from "shared-code";
import { getRoomRequest } from "../api";
import { ROOM_QUERY_KEY, STORAGE_KEYS, VIEWS } from "../constants";
import { useWebsocket } from "../hooks";
import type { APIError } from "../types";
import { useViewContext } from "./ViewContext";
import { useSnackAlert } from "./useSnackAlert";

const RoomContext = createContext<{
  clearRoomData: () => void;
  room?: RoomDTO;
  isLoading: boolean;
  refetch: () => void;
}>({
  clearRoomData: () => {
    throw new Error("clearRoomData function not implemented");
  },
  room: undefined,
  isLoading: false,
  refetch: () => {},
});

//eslint-disable-next-line react-refresh/only-export-components
export function useRoomContext() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: Readonly<PropsWithChildren>) {
  const { view, setView } = useViewContext();
  const queryClient = useQueryClient();

  const { connectSocket, disconnectSocket, registerEvent } = useWebsocket();

  const { openAlert } = useSnackAlert();
  const { t } = useTranslation();

  const room = useQuery({
    queryKey: [ROOM_QUERY_KEY],
    queryFn: () =>
      getRoomRequest(
        sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!,
        sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID)!,
      ),
    enabled:
      sessionStorage.getItem(STORAGE_KEYS.ROOM_ID) != null &&
      sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID) != null,
    retryDelay: 0,
  });

  const clearRoomData = () => {
    queryClient.removeQueries({ queryKey: [ROOM_QUERY_KEY], exact: true });
    sessionStorage.removeItem(STORAGE_KEYS.ROOM_ID);
    sessionStorage.removeItem(STORAGE_KEYS.PLAYER_ID);
    sessionStorage.removeItem(STORAGE_KEYS.OFFLINE_GAME);

    disconnectSocket();
    setView(VIEWS.HOME);
  };

  const updateConnection = useEffectEvent(() => {
    const roomId = sessionStorage.getItem(STORAGE_KEYS.ROOM_ID);
    const userId = sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID);

    if ((view !== VIEWS.HOME && !roomId) || !userId) {
      setView(VIEWS.HOME);
    }

    if (
      view !== VIEWS.GAME &&
      (
        [
          GAME_STATE.Playing,
          GAME_STATE.Predicting,
          GAME_STATE.TurnOver,
          GAME_STATE.RoundOver,
        ] as (GameState | undefined)[]
      ).includes(room.data?.gameState)
    ) {
      console.log("switched to game view by context");
      setView(VIEWS.GAME);
    }
    if (
      view !== VIEWS.WAITING_ROOM &&
      room.data?.gameState === GAME_STATE.WaitingForPlayers
    ) {
      console.log("switched to waiting room view by context");
      setView(VIEWS.WAITING_ROOM);
    }

    if (roomId && userId) {
      connectSocket(roomId, userId);

      registerEvent(SOCKET_EVENTS.ROOM_UPDATE, () => {
        console.log("Socket update received");
        room.refetch();
      });

      registerEvent(
        SOCKET_EVENTS.PLAYER_LEFT,
        ({ username }: PlayerLeftEventParams) => {
          openAlert({
            content: t("player-left-room", { username }),
            severity: "warning",
          });
          room.refetch();
        },
      );
    }

    if (room.isError) {
      console.log("#!!$", room.error);
      if ((room.error as APIError)?.status === 404) {
        clearRoomData();
      }
      setView(VIEWS.HOME);
    }
  });

  useEffect(updateConnection, [updateConnection]);

  return (
    <RoomContext
      value={{
        room: room.data,
        isLoading: room.isLoading,
        refetch: room.refetch,
        clearRoomData,
      }}
    >
      {children}
    </RoomContext>
  );
}
