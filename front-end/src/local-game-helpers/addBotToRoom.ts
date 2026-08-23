import { createPlayer, SOCKET_EVENTS, type Room } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export function addBotToRoom(room: Room, silent?: boolean): Room {
  const _room = structuredClone(room);

  const botUsername = `BOT_${_room.players.length}`;

  const newPlayer = createPlayer(botUsername, true);
  _room.players.push(newPlayer);

  updateLocalRoom(_room);

  if (!silent) OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);

  return _room;
}
