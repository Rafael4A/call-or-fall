import type { RoomDTO } from "shared-code";
import type { APIError } from "../types";

export async function getRoomRequest(roomId: string, userId: string) {
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
