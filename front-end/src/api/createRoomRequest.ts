import type { CreateRoomResponse } from "shared-code";

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
        throw new Error(data.error || "Failed to create room");
      });
    }
    return res.json();
  }) as Promise<CreateRoomResponse>;
}
