import type { Room } from "../types/Room.js";

export function getNextPlayerName(room: Room) {
  const currentPlayerIndex = room.players.findIndex(
    (player) => player.username === room.currentPlayerName,
  );
  const nextPlayerIndex = (currentPlayerIndex + 1) % room.players.length;

  return room.players[nextPlayerIndex]?.username;
}
