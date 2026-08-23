import { type Request, type Response } from "express";
import { GAME_STATE, SOCKET_EVENTS } from "shared-code";
import { getRoomByIdWithUser, predictRound } from "../../../../state";
import { getSocketio } from "../../../../utils";

export function predictRoundEndpoint(req: Request, res: Response) {
  const roomId = req.params?.id as string;
  const userId = req.query?.userId as string;

  const room = getRoomByIdWithUser(roomId, userId)!;

  if (room.gameState !== GAME_STATE.Predicting) {
    return res.status(404).send({ error: "Room is not predicting" });
  }

  const user = room.players.find((player) => player.id === userId)!;

  // check if it's the user's turn to predict
  if (room.currentPlayerName !== user.username) {
    return res.status(403).send({ error: "It's not your turn to predict" });
  }

  const { prediction } = req.body;
  if (prediction == null || typeof prediction !== "number" || prediction < 0) {
    return res.status(400).send({ error: "Invalid prediction" });
  }

  predictRound(room, userId, prediction);

  const io = getSocketio(req.app);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);

  res.status(200).send();
}
