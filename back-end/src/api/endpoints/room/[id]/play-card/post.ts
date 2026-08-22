import { type Request, type Response } from "express";
import {
  CARDS_CODES,
  GAME_STATE,
  SOCKET_EVENTS,
  type CardCode,
  type GameState,
} from "shared-code";
import {
  getRoomByIdWithUser,
  handleTurnOver,
  playCard,
} from "../../../../state";
import { getSocketio } from "../../../../utils";

export function playCardEndpoint(req: Request, res: Response) {
  const roomId = req.params?.id as string;
  const userId = req.query?.userId as string;

  const room = getRoomByIdWithUser(roomId, userId)!;

  if (room.gameState !== GAME_STATE.Playing) {
    return res.status(404).send({ error: "Room is not playing cards" });
  }

  const user = room.players.find((player) => player.id === userId)!;

  // check if it's the user's turn to play a card
  if (room.currentPlayerName !== user.username) {
    return res.status(403).send({ error: "It's not your turn to play a card" });
  }

  const { card } = req.body as { card: CardCode };

  if (
    card == null ||
    typeof card !== "string" ||
    [...CARDS_CODES, "HIDDEN"].includes(card) === false
  ) {
    return res.status(400).send({ error: "Invalid card" });
  }

  const newRoom = playCard(room, userId, card);

  const io = getSocketio(req.app);

  io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);

  const gameStatesForNextTurn: GameState[] = [
    GAME_STATE.TurnOver,
    GAME_STATE.RoundOver,
  ];

  if (gameStatesForNextTurn.includes(newRoom.gameState)) {
    handleTurnOver(newRoom, io);
  }

  res.status(200).send();
}
