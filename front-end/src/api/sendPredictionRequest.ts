import type { APIError } from "../types";

interface SendPredictionRequestParams {
  roomId: string;
  userId: string;
  prediction: number;
}

export async function sendPredictionRequest({
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
