import { type Request, type Response } from "express";
import { GAME_STATE, SOCKET_EVENTS } from "shared-code";
import {
  getRoomByIdWithUser,
  startGame as stateStartGame,
} from "../../../../state/index.js";
import { getSocketio } from "../../../../utils/index.js";

export function startGame(req: Request, res: Response) {
  console.log(req.params, req.path, req.body);

  const roomId = req.params?.id;
  const userId = req.query?.userId;

  if (
    roomId === undefined ||
    typeof roomId !== "string" ||
    roomId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing roomId" });
  }

  if (
    userId === undefined ||
    typeof userId !== "string" ||
    userId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing userId" });
  }

  const room = getRoomByIdWithUser(roomId, userId);

  if (!room) {
    return res.status(404).send({ error: "Room with player not found" });
  }

  if (room.gameState !== GAME_STATE.WaitingForPlayers) {
    return res.status(404).send({ error: "Room is not waiting for players" });
  }

  console.log(room);

  if (!room) {
    return res.status(404).send({ error: "Room not found" });
  }

  const hostPlayerId = room.players[0]?.id;

  if (hostPlayerId !== userId) {
    return res.status(403).send({ error: "Only the host can start the game" });
  }

  stateStartGame(room);

  const io = getSocketio(req.app);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);

  res.status(200).send();
}
