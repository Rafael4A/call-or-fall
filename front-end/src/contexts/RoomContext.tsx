import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import {
  GAME_STATE,
  SOCKET_EVENTS,
  type GameState,
  type PlayerLeftEventParams,
  type RoomDTO,
} from "shared-code";
import { getRoomRequest } from "../api";
import { STORAGE_KEYS, VIEWS } from "../constants";
import { useWebsocket } from "../hooks";
import { useViewContext } from "./ViewContext";
import { useSnackAlert } from "./useSnackAlert";

const RoomContext = createContext<{
  updateConnection: () => void;
  clearRoomData: () => void;
  room: UseQueryResult<RoomDTO, unknown>;
}>({
  updateConnection: () => {
    throw new Error("updateConnection function not implemented");
  },
  clearRoomData: () => {
    throw new Error("clearRoomData function not implemented");
  },
  room: {} as UseQueryResult<RoomDTO, unknown>,
});

//eslint-disable-next-line react-refresh/only-export-components
export function useRoomContext() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: Readonly<PropsWithChildren>) {
  const { setView } = useViewContext();

  const queryClient = useQueryClient();

  const { connectSocket, registerEvent } = useWebsocket();

  const { openAlert } = useSnackAlert();

  const room = useQuery({
    queryKey: ["room"],
    queryFn: () =>
      getRoomRequest(
        sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!,
        sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID)!,
      ),
    enabled:
      sessionStorage.getItem(STORAGE_KEYS.ROOM_ID) != null &&
      sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID) != null,
  });

  const updateConnection = () => {
    const roomId = sessionStorage.getItem(STORAGE_KEYS.ROOM_ID)!;
    const userId = sessionStorage.getItem(STORAGE_KEYS.PLAYER_ID)!;

    if (!roomId || !userId || room.data?.gameState === GAME_STATE.GameOver) {
      setView(VIEWS.HOME);
    }
    console.log("passei");
    if (
      (
        [
          GAME_STATE.Playing,
          GAME_STATE.Predicting,
          GAME_STATE.TurnOver,
          GAME_STATE.RoundOver,
        ] as (GameState | undefined)[]
      ).includes(room.data?.gameState)
    ) {
      console.log("swtiched to game view by context");
      setView(VIEWS.GAME);
    }
    if (room.data?.gameState === GAME_STATE.WaitingForPlayers) {
      console.log("swtiched to game view by context");
      setView(VIEWS.WAITING_ROOM);
    }

    connectSocket(roomId, userId);
    registerEvent(SOCKET_EVENTS.ROOM_UPDATE, () => {
      console.log("Socket update received");
      room.refetch();
    });
    registerEvent(
      SOCKET_EVENTS.PLAYER_LEFT,
      ({ username }: PlayerLeftEventParams) => {
        openAlert({
          content: `${username} left the room`,
          severity: "warning",
        });
        room.refetch();
      },
    );

    if (room.isError) {
      console.log("#!!$", room.error);
      setView(VIEWS.HOME);
    }
  };
  useEffect(updateConnection, [updateConnection]);

  const clearRoomData = () => {
    queryClient.removeQueries({ queryKey: ["room"], exact: true });
    sessionStorage.removeItem(STORAGE_KEYS.ROOM_ID);
    sessionStorage.removeItem(STORAGE_KEYS.PLAYER_ID);
    setView(VIEWS.HOME);
  };

  return (
    <RoomContext value={{ updateConnection, room, clearRoomData }}>
      {children}
    </RoomContext>
  );
}
