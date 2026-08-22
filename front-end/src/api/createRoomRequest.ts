import { createRoom, type CreateRoomResponse, type Room } from "shared-code";
import { LOCAL_ROOM_ID, STORAGE_KEYS } from "../constants";
import { addBotToRoom } from "../local-game-helpers";
import type { APIError } from "../types";

interface CreateRoomRequestParams {
  username: string;
}

export async function createRoomRequest(
  args: CreateRoomRequestParams,
): Promise<CreateRoomResponse> {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME) === "start") {
    return createOfflineRoomRequest(args);
  } else {
    return createOnlineRoomRequest(args);
  }
}

async function createOfflineRoomRequest({
  username: usernameParam,
}: CreateRoomRequestParams) {
  const username = usernameParam.trim().toUpperCase();
  const room = createRoom(username, LOCAL_ROOM_ID);
  const playerId = room.players[0]?.id;
  if (!playerId) {
    throw new Error(
      "Failed to create offline room: player ID not found",
    ) as APIError;
  }

  const bottedRoom = Array.from({ length: 3 }).reduce<Room>((acc) => {
    return addBotToRoom(acc);
  }, room);

  sessionStorage.setItem(STORAGE_KEYS.OFFLINE_GAME, JSON.stringify(bottedRoom));

  return {
    roomId: bottedRoom.id,
    playerId: playerId,
  } as CreateRoomResponse;
}

async function createOnlineRoomRequest({ username }: CreateRoomRequestParams) {
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
