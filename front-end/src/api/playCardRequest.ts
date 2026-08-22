import { playCard, SOCKET_EVENTS, type CardCode } from "shared-code";
import { STORAGE_KEYS } from "../constants";
import {
  getLocalRoom,
  OfflineBridge,
  updateLocalRoom,
} from "../local-game-helpers";
import type { APIError } from "../types";

interface PlayCardRequestParams {
  roomId: string;
  userId: string;
  card: CardCode;
}

export async function playCardRequest(args: PlayCardRequestParams) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME)) {
    return playOfflineCardRequest(args);
  } else {
    return playOnlineCardRequest(args);
  }
}

export async function playOfflineCardRequest({
  card,
  roomId,
  userId,
}: PlayCardRequestParams) {
  const room = getLocalRoom(roomId, userId);
  const newRoom = playCard(room, userId, card);
  updateLocalRoom(newRoom);

  OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
  // haveBotsPlayCard(newRoom);

  return true;
}

export async function playOnlineCardRequest({
  card,
  roomId,
  userId,
}: PlayCardRequestParams) {
  return fetch(`/api/room/${roomId}/play-card?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ card }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to play card",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.ok;
  });
}
