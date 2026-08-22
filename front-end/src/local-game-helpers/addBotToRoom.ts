import { createPlayer, type Room } from "shared-code";

export function addBotToRoom(room: Room): Room {
  const _room = structuredClone(room);

  const botUsername = `BOT_${_room.players.length}`;

  const newPlayer = createPlayer(botUsername, true);
  _room.players.push(newPlayer);

  return _room;
}
