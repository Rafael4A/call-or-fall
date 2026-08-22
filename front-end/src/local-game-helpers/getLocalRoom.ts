import type { Room } from "shared-code";
import { STORAGE_KEYS } from "../constants";
import type { APIError } from "../types";

export function getLocalRoom(roomId: string, userId: string) {
  const roomString = sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME);
  if (!roomString)
    throw new Error("No local room found in session storage") as APIError;

  const room = JSON.parse(roomString) as Room;

  if (room.id !== roomId)
    throw new Error("Room ID does not match local room") as APIError;

  const player = room.players.find((p) => p.id === userId);
  if (!player)
    throw new Error(
      "Player ID does not match any player in local room",
    ) as APIError;

  return room;
}
