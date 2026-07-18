import { GAME_STATE } from "../constants/GAME_STATE.js";
import type { Room } from "../types/Room.js";

export function predictTurn(
  room: Room,
  playerId: string,
  prediction: number,
): Room {
  const _room = structuredClone(room);
  if (_room.gameState !== GAME_STATE.Predicting)
    throw new Error("Game not in predicting state");

  const player = _room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  if (room.currentPlayerName !== player.username) {
    throw new Error("It's not the player's turn to predict");
  }

  const playersWithPredictions = _room.players.filter(
    (p) => p.prediction !== undefined,
  );

  const remainingPredictionsAvailable =
    _room.players.length - playersWithPredictions.length;

  if (remainingPredictionsAvailable <= 1) {
    const predictionsSum = _room.players.reduce(
      (acc, player) => acc + (player.prediction ?? 0),
      0,
    );
    if (predictionsSum + prediction === _room.deck.length) {
      throw new Error(
        "Prediction not allowed. The sum of predictions cannot equal the number of cards in the deck.",
      );
    }
  }

  const newPlayer = { ...player, prediction };

  const roomWithNewPlayer = {
    ..._room,
    players: _room.players.map((p) => (p.id === playerId ? newPlayer : p)),
  };

  // check if all players have predicted
  if (
    roomWithNewPlayer.players.every((player) => player.prediction != undefined)
  ) {
    roomWithNewPlayer.gameState = GAME_STATE.Playing;
  }

  // move to next player's turn regardless of whether all players have predicted or not
  const currentPlayerIndex = roomWithNewPlayer.players.findIndex(
    (player) => player.id === playerId,
  );
  const nextPlayerIndex =
    (currentPlayerIndex + 1) % roomWithNewPlayer.players.length;

  roomWithNewPlayer.currentPlayerName =
    roomWithNewPlayer.players[nextPlayerIndex]?.username;

  return roomWithNewPlayer;
}
