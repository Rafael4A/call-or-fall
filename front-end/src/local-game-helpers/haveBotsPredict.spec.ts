import {
  createPlayer,
  createRoom,
  GAME_STATE,
  startGame,
  type CardCode,
  type Room,
} from "shared-code";
import { describe, expect, it } from "vitest";
import { calculateBotPrediction } from "./haveBotsPredict";

function createPredictingTestRoom(
  round: number,
  botHand: CardCode[],
  opponentPredictions: (number | undefined)[], // pass undefined if they haven't predicted yet
  tableCards: CardCode[] = [],
): Room {
  const newRoom = createRoom("Opponent1", "test-room");
  newRoom.players.push(createPlayer("BotPlayer", true));
  newRoom.players.push(createPlayer("Opponent2", true));

  newRoom.currentRound = round;
  newRoom.gameState = GAME_STATE.RoundOver;

  const startedRoom = startGame(newRoom);

  // Force Gamestate back to predicting just in case startGame resolves differently
  startedRoom.gameState = GAME_STATE.Predicting;
  startedRoom.currentPlayerName = "BotPlayer";

  // Assign predictions and hands
  startedRoom.players[0]!.prediction = opponentPredictions[0];
  startedRoom.players[2]!.prediction = opponentPredictions[1];

  startedRoom.players[1]!.cards = botHand;
  startedRoom.players[1]!.prediction = undefined; // Bot is deciding right now

  // Add dummy table cards
  if (round === 1) {
    for (const opponent of startedRoom.players) {
      if (opponent.username !== "BotPlayer") {
        opponent.cards = [tableCards.shift()!];
      }
    }
  } else {
    startedRoom.table = tableCards.map((c) => ({
      card: c,
      owner: "Opponent1",
    }));
  }

  return startedRoom;
}

describe("calculateBotPrediction", () => {
  describe("Round 1 Logic (Table Card evaluation)", () => {
    it("Predicts 0 if an opponent has a high card showing", () => {
      const room = createPredictingTestRoom(
        1,
        ["5S"],
        [undefined, undefined],
        ["KS", "JH"],
      );
      expect(calculateBotPrediction(room)).toBe(0);
    });

    it("Predicts 1 if an opponent has a low card showing", () => {
      const room = createPredictingTestRoom(
        1,
        ["8S"],
        [undefined, undefined],
        ["AS", "2H"],
      );
      expect(calculateBotPrediction(room)).toBe(1);
    });
  });

  describe("Round > 1 Logic (Hand evaluation)", () => {
    it("Predicts multiple tricks if holding strong cards", () => {
      const room = createPredictingTestRoom(
        3,
        ["KS", "QC", "JH"],
        [1, undefined],
      );
      const prediction = calculateBotPrediction(room);
      expect(prediction).toBeGreaterThan(0);
      expect(prediction).toBeLessThanOrEqual(3);
    });

    it("Predicts 0 tricks if holding extremely weak cards", () => {
      const room = createPredictingTestRoom(
        3,
        ["AS", "2C", "3H"],
        [1, undefined],
      );
      expect(calculateBotPrediction(room)).toBe(0);
    });
  });

  describe("Final Constraint (Last Player Adjustment)", () => {
    it("Adjusts prediction UP if it would match the round total and bot predicted 0", () => {
      const room = createPredictingTestRoom(2, ["AS", "2C"], [1, 1]);
      expect(calculateBotPrediction(room)).toBe(1);
    });

    it("Adjusts prediction down if it would match the round total and bot predicted 1", () => {
      const room = createPredictingTestRoom(2, ["2S", "JC"], [1, 0]);

      expect(calculateBotPrediction(room)).toBe(0);
    });
  });
});
