import { type Request, type Response } from "express";
import { SOCKET_EVENTS, type PlayerLeftEventParams } from "shared-code";
import { getRoomById, removePlayerFromRoom } from "../../../../state";
import { getSocketio } from "../../../../utils";

export function leaveRoomEndpoint(req: Request, res: Response) {
  const roomId = req.params?.id as string;
  const userId = req.query?.userId as string;

  const room = getRoomById(roomId);

  const playerName = room?.players.find(
    (player) => player.id === userId,
  )?.username!;

  removePlayerFromRoom(roomId, userId);

  const io = getSocketio(req.app);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);
  io.to(roomId).emit(SOCKET_EVENTS.PLAYER_LEFT, {
    username: playerName,
  } as PlayerLeftEventParams);

  res.status(200).send();
}
