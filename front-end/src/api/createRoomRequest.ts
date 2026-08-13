import type { CreateRoomResponse } from "shared-code";
import type { APIError } from "../types";

interface CreateRoomRequestParams {
  username: string;
}

export async function createRoomRequest({ username }: CreateRoomRequestParams) {
  return fetch("/api/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to create room",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.json();
  }) as Promise<CreateRoomResponse>;
}
