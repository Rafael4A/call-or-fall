import type { RoomDTO } from "shared-code";

export async function getRoomRequest(roomId: string, userId: string) {
  return fetch(`/api/room/${roomId}?userId=${userId}`).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.error || "Failed to fetch room");
      });
    }
    return res.json();
  }) as Promise<RoomDTO>;
}
