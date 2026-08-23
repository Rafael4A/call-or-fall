import {
  GAME_STATE,
  getBestTableCard,
  getCardValue,
  HIDDEN_CARD,
  mapRoomToRoomDTO,
  predictTurn,
  SOCKET_EVENTS,
  type Room,
} from "shared-code";
import { BOT_DELAY } from "../constants";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function haveBotsPredict(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  );

  if (currentPlayer?.isBot) {
    await new Promise((resolve) => setTimeout(resolve, BOT_DELAY));

    if (room.gameState !== GAME_STATE.Predicting) return;

    let prediction: number;
    if (room.currentRound === 1) {
      const roomDTO = mapRoomToRoomDTO(room, currentPlayer.id);
      const bestOpponentsCard = getBestTableCard(roomDTO.table);
      const bestOpponentsCardValue = getCardValue(
        bestOpponentsCard?.card ?? HIDDEN_CARD,
      );

      const chanceOfLosing =
        bestOpponentsCardValue / 13 + 0.03 * (room.players.length - 1);
      prediction = Math.max(0, Math.round(1 - chanceOfLosing));
    } else {
      const possibleOpponentCards =
        (room.players.length - 1) * room.currentRound;

      const knownPredictionsSum = room.players
        .map((p) => p.prediction ?? 0)
        .reduce((sum, prediction) => sum + prediction, 0);

      const pressureRatio = knownPredictionsSum / room.currentRound;

      const pressureModifier = (0.5 - pressureRatio) * 0.05;

      const expectedWins = currentPlayer.cards.reduce((acc, card) => {
        const value = getCardValue(card);
        const winProbability =
          value / 13 - 0.02 * possibleOpponentCards + pressureModifier;
        return acc + Math.max(0, Math.min(1, winProbability));
      }, 0);

      prediction = Math.min(room.currentRound, Math.round(expectedWins));
    }

    const playersWithPredictions = room.players.filter(
      (p) => p.prediction !== undefined,
    );

    const remainingPredictionsAvailable =
      room.players.length - playersWithPredictions.length;

    if (remainingPredictionsAvailable <= 1) {
      const predictionsSum = room.players.reduce(
        (acc, player) => acc + (player.prediction ?? 0),
        0,
      );
      if (predictionsSum + prediction === room.deck.length) {
        prediction = prediction > 0 ? prediction - 1 : prediction + 1;
      }
    }

    const newRoom = predictTurn(room, currentPlayer.id, prediction);

    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
    return true;
  }
  return false;
}
