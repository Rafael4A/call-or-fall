import { predictRound, SOCKET_EVENTS } from "shared-code";
import { STORAGE_KEYS } from "../constants";
import {
  getLocalRoom,
  OfflineBridge,
  updateLocalRoom,
} from "../local-game-helpers";
import type { APIError } from "../types";

interface SendPredictionRequestParams {
  roomId: string;
  userId: string;
  prediction: number;
}

export async function sendPredictionRequest(args: SendPredictionRequestParams) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME)) {
    return sendOfflinePredictionRequest(args);
  } else {
    return sendOnlinePredictionRequest(args);
  }
}

export async function sendOfflinePredictionRequest({
  prediction,
  roomId,
  userId,
}: SendPredictionRequestParams) {
  const room = getLocalRoom(roomId, userId);
  const newRoom = predictRound(room, userId, prediction);

  updateLocalRoom(newRoom);
  OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);

  return true;
}

export async function sendOnlinePredictionRequest({
  prediction,
  roomId,
  userId,
}: SendPredictionRequestParams) {
  return fetch(`/api/room/${roomId}/predict?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prediction }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to send prediction",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.ok;
  });
}
