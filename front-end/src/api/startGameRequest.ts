import type { RoomOptions } from "shared-code";
import type { APIError } from "../types";

interface StartGameRequestParams {
  roomId: string;
  userId: string;
  roomOptions: RoomOptions;
}

export async function startGameRequest({
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
