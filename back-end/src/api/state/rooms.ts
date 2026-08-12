import {
  createPlayer,
  createRoom,
  GAME_STATE,
  playCard as logicPlayCard,
  predictTurn as logicPredictTurn,
  startGame as logicStartGame,
  SOCKET_EVENTS,
  type CardCode,
  type Player,
  type Room,
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

export function predictTurn(
  room: Room,
  playerId: string,
  prediction: number,
): Room {
  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  const newRoom = logicPredictTurn(room, playerId, prediction);

  Rooms.set(room.id, newRoom);
  return newRoom;
}

export function playCard(room: Room, playerId: string, card: CardCode): Room {
  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  const newRoom = logicPlayCard(room, playerId, card);

  Rooms.set(room.id, newRoom);
  return newRoom;
}

export async function handleTurnOver(room: Room, io: Server) {
  // Wait for 7 seconds before starting the next round
  await new Promise((resolve) => setTimeout(resolve, 7000));

  // If score limit has been reached, end the game
  if (room.gameState === GAME_STATE.RoundOver) {
    const highstedScore = Math.max(
      ...room.players.map((player) => player.score),
    );
    if (highstedScore >= room.options.scoreLimit) {
      const newRoom = { ...room, gameState: GAME_STATE.GameOver };

      Rooms.set(room.id, newRoom);

      io.to(room.id).emit(SOCKET_EVENTS.ROOM_UPDATE);

      return newRoom;
    }
  }

  // Start the next round
  const newRoom = startGame(room);
  Rooms.set(room.id, newRoom);

  // Emit an event to notify clients that the round has ended and a new round has started
  io.to(room.id).emit(SOCKET_EVENTS.ROOM_UPDATE);

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
  console.log(
    "!!!",
    room.currentPlayerName,
    room.players[playerIndex]?.username,
  );
  if (room.currentPlayerName === room.players[playerIndex]?.username) {
    const nextPlayerIndex = playerIndex % room.players.length;

    console.log("!-!", room.players[nextPlayerIndex]?.username);
    room.currentPlayerName = room.players[nextPlayerIndex]?.username;
  }

  if (playerIndex === -1) return false;
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
