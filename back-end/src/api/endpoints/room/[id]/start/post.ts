import { type Request, type Response } from "express";
import { GAME_STATE, SOCKET_EVENTS, type RoomOptions } from "shared-code";
import { getRoomByIdWithUser, startGame } from "../../../../state";
import { getSocketio } from "../../../../utils";

export function startGameEndpoint(req: Request, res: Response) {
  const roomId = req.params?.id as string;
  const userId = req.query?.userId as string;

  const room = getRoomByIdWithUser(roomId, userId)!;

  if (room.gameState !== GAME_STATE.WaitingForPlayers) {
    return res.status(404).send({ error: "Room is not waiting for players" });
  }

  const hostPlayerId = room.players[0]?.id;

  if (hostPlayerId !== userId) {
    return res.status(403).send({ error: "Only the host can start the game" });
  }

  const roomOptions = req.body as RoomOptions;

  startGame(room, roomOptions);

  const io = getSocketio(req.app);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);

  res.status(200).send();
}
