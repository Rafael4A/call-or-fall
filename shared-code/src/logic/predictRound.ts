import { GAME_STATE } from "../constants";
import type { Room } from "../types";

export function predictRound(
  room: Room,
  playerId: string,
  prediction: number,
): Room {
  const _room = structuredClone(room);
  if (_room.gameState !== GAME_STATE.Predicting)
    throw new Error("Game not in predicting state");

  const currentPlayerIndex = _room.players.findIndex((p) => p.id === playerId);
  const player = _room.players[currentPlayerIndex];

  if (!player) throw new Error("Player not found");
  if (_room.currentPlayerName !== player.username) {
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

    if (predictionsSum + prediction === _room.currentRound) {
      console.log(predictionsSum, prediction, _room.currentRound);
      throw new Error(
        "Prediction not allowed. The sum of predictions cannot equal the number of cards dealt.",
      );
    }
  }

  player.prediction = prediction;
  player.originalPrediction = prediction;

  if (remainingPredictionsAvailable === 1) {
    _room.gameState = GAME_STATE.Playing;
  }

  const nextPlayerIndex = (currentPlayerIndex + 1) % _room.players.length;
  _room.currentPlayerName = _room.players[nextPlayerIndex]?.username;

  return _room;
}
