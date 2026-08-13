import type { CreateRoomResponse } from "shared-code";
import type { APIError } from "../types";

interface JoinRoomRequestParams {
  username: string;
  roomId: string;
}

export async function joinRoomRequest({
  username,
  roomId,
}: JoinRoomRequestParams) {
  return fetch(`/api/room/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to join room",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.json();
  }) as Promise<CreateRoomResponse>;
}
