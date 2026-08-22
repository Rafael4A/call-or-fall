import { STORAGE_KEYS } from "../constants";
import type { APIError } from "../types";

interface LeaveRoomRequestParams {
  roomId: string;
  userId: string;
}

export async function leaveRoomRequest(args: LeaveRoomRequestParams) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME)) {
    return leaveOfflineRoomRequest();
  } else {
    return leaveOnlineRoomRequest(args);
  }
}

export async function leaveOfflineRoomRequest() {
  sessionStorage.removeItem(STORAGE_KEYS.OFFLINE_GAME);

  return true;
}

export async function leaveOnlineRoomRequest({
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
