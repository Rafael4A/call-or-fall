import { randomInt } from "node:crypto";
import {
  createPlayer,
  createRoom,
  GAME_STATE,
  playCard as logicPlayCard,
  predictRound as logicPredictRound,
  startGame as logicStartGame,
  ROOM_ID_CHARS,
  SOCKET_EVENTS,
  type CardCode,
  type Player,
  type Room,
  type RoomOptions,
} from "shared-code";
import type { Server } from "socket.io";

export const Rooms = new Map<string, Room>();

export function getRoomById(roomId: string): Room | undefined {
  return Rooms.get(roomId);
}

export function getRoomByIdWithUser(
  roomId: string,
  userId: string,
): Room | undefined {
  const found = Rooms.get(roomId);
  return found?.players.find((p) => p.id === userId) ? found : undefined;
}

export function addPlayerToRoom(room: Room, username: string): Player {
  const newPlayer = createPlayer(username);
  room.players.push(newPlayer);
  return newPlayer;
}

export function startGame(room: Room, roomOptions?: RoomOptions): Room {
  const newRoom = logicStartGame(room, roomOptions);
  Rooms.set(newRoom.id, newRoom);
  return newRoom;
}

export function predictRound(
  room: Room,
  playerId: string,
  prediction: number,
): Room {
  const newRoom = logicPredictRound(room, playerId, prediction);
  Rooms.set(room.id, newRoom);
  return newRoom;
}

export function playCard(room: Room, playerId: string, card: CardCode): Room {
  const newRoom = logicPlayCard(room, playerId, card);
  Rooms.set(room.id, newRoom);
  return newRoom;
}

export async function handleTrickOver(roomId: string, io: Server) {
  // Wait for 7 seconds before starting the next round
  await new Promise((resolve) => setTimeout(resolve, 7000));

  // Re-fetch the room to ensure we have the most up-to-date state in case someone disconnected during those 7 seconds
  const freshRoom = Rooms.get(roomId);

  if (!freshRoom) return;

  const newRoom = startGame(freshRoom);
  Rooms.set(roomId, newRoom);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);
  return newRoom;
}

export function addRoom(username: string): Room {
  let id = "";
  while (id === "" || Rooms.has(id)) {
    id = Array.from({ length: 6 })
      .map(() => ROOM_ID_CHARS[randomInt(0, ROOM_ID_CHARS.length)])
      .join("");
  }
  const room = createRoom(username, id);

  Rooms.set(room.id, room);
  return room;
}

export function removePlayerFromRoom(roomId: string, playerId: string) {
  const room = Rooms.get(roomId);
  if (!room) return false;

  const playerIndex = room.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) return false;

  if (room.currentPlayerName === room.players[playerIndex]?.username) {
    const nextPlayerIndex = (playerIndex + 1) % room.players.length;
    room.currentPlayerName = room.players[nextPlayerIndex]?.username;
  }

  room.players.splice(playerIndex, 1);

  if (
    room.players.length === 0 ||
    (room.gameState !== GAME_STATE.WaitingForPlayers &&
      room.players.length <= 1)
  ) {
    return Rooms.delete(roomId);
  }

  return true;
}

export function deleteRoom(roomId: string): boolean {
  return Rooms.delete(roomId);
}

export function getAllRooms(): Room[] {
  return Array.from(Rooms.values());
}

export function clearRooms(): void {
  Rooms.clear();
}

export function roomExists(roomId: string): boolean {
  return Rooms.has(roomId);
}
