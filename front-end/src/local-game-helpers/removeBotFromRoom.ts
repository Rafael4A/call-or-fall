import { SOCKET_EVENTS, type Room } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export function removeBotFromRoom(room: Room, silent?: boolean): Room {
  const _room = structuredClone(room);

  const lastBotId = _room.players.filter((p) => p.isBot).pop();

  if (!lastBotId) {
    throw new Error("No bot found in the room");
  }

  _room.players = _room.players.filter((p) => p.id !== lastBotId.id);

  updateLocalRoom(_room);

  if (!silent) OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);

  return _room;
}
