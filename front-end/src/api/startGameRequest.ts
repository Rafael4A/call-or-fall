import { SOCKET_EVENTS, startGame, type RoomOptions } from "shared-code";
import { STORAGE_KEYS } from "../constants";
import {
  getLocalRoom,
  OfflineBridge,
  updateLocalRoom,
} from "../local-game-helpers";
import type { APIError } from "../types";

interface StartGameRequestParams {
  roomId: string;
  userId: string;
  roomOptions: RoomOptions;
}

export async function startGameRequest(args: StartGameRequestParams) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME)) {
    return startOfflineGameRequest(args);
  } else {
    return startOnlineGameRequest(args);
  }
}

export async function startOfflineGameRequest({
  roomId,
  userId,
  roomOptions,
}: StartGameRequestParams) {
  const room = getLocalRoom(roomId, userId);
  const newRoom = startGame(room, roomOptions);

  updateLocalRoom(newRoom);
  OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);

  //haveBotsPredict(newRoom);

  return true;
}

export async function startOnlineGameRequest({
  roomId,
  userId,
  roomOptions,
}: StartGameRequestParams) {
  return fetch(`/api/room/${roomId}/start?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomOptions),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to start game",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.ok;
  });
}
