import {
  createPlayer,
  createRoom,
  startGame as logicStartGame,
  type Player,
  type Room,
} from "shared-code";

export const Rooms = new Map<string, Room>();

export function getRoomById(roomId: string): Room | undefined {
  return Rooms.get(roomId);
}
export function getRoomByIdWithUser(
  roomId: string,
  userId: string,
): Room | undefined {
  const found = Rooms.get(roomId);
  console.log(roomId, userId, found);
  return found?.players.find((p) => p.id === userId) ? found : undefined;
}

export function addPlayerToRoom(
  room: Room,
  username: string,
  isBot = false,
): Player {
  const newPlayer = createPlayer(username, isBot);
  room.players.push(newPlayer);
  return newPlayer;
}

export function startGame(room: Room): Room {
  const newRoom = logicStartGame(room);
  Rooms.set(newRoom.id, newRoom);
  return newRoom;
}

export function addRoom(username: string): Room {
  const room = createRoom(username);
  Rooms.set(room.id, room);

  return room;
}

export function removePlayerFromRoom(roomId: string, playerId: string) {
  const room = Rooms.get(roomId);
  if (!room) return false;

  const playerIndex = room.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) return false;
  room.players.splice(playerIndex, 1);
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
