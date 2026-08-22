import { mapRoomToRoomDTO, type RoomDTO } from "shared-code";
import { STORAGE_KEYS } from "../constants";
import { continueGame, getLocalRoom } from "../local-game-helpers";
import type { APIError } from "../types";

export async function getRoomRequest(roomId: string, userId: string) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME)) {
    return getOfflineRoomRequest(roomId, userId);
  } else {
    return getOnlineRoomRequest(roomId, userId);
  }
}

export async function getOfflineRoomRequest(roomId: string, userId: string) {
  const room = getLocalRoom(roomId, userId);
  continueGame(room);
  return mapRoomToRoomDTO(room, userId);
}

export async function getOnlineRoomRequest(roomId: string, userId: string) {
  return fetch(`/api/room/${roomId}?userId=${userId}`).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to fetch room",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.json();
  }) as Promise<RoomDTO>;
}
