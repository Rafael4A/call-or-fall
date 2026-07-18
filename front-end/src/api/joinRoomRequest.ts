import type { CreateRoomResponse } from "shared-code";

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
        throw new Error(data.error || "Failed to join room");
      });
    }
    return res.json();
  }) as Promise<CreateRoomResponse>;
}
