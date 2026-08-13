import type { APIError } from "../types";

interface LeaveRoomRequestParams {
  roomId: string;
  userId: string;
}

export async function leaveRoomRequest({
  roomId,
  userId,
}: LeaveRoomRequestParams) {
  return fetch(`/api/room/${roomId}/leave?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(
          data.error || "Failed to leave game",
        ) as APIError;
        error.status = res.status;
        throw error;
      });
    }
    return res.ok;
  });
}
