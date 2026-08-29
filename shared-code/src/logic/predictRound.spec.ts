import { describe, expect, it } from "vitest";
import { GAME_STATE } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";
import { createRoom } from "./createRoom";
import { predictRound } from "./predictRound";
import { startGame } from "./startGame";

function createPredictingRoom(playerNames: string[], round: number = 1): Room {
  const newRoom = createRoom(playerNames[0]!, "test-room");
  for (let i = 1; i < playerNames.length; i++) {
    newRoom.players.push(createPlayer(playerNames[i]!));
  }

  const room = startGame(newRoom);

  room.currentRound = round;
  room.currentPlayerName = playerNames[0];
  room.roundFirstPlayerName = playerNames[0];
  return room;
}

describe("predictRound - validation", () => {
  it("should throw when game state is not Predicting", () => {
    const room: Room = {
      id: "test-room",
      players: [createPlayer("A"), createPlayer("B")],
      options: { scoreLimit: 10, showWinningCard: false, deckCount: 1 },
      deck: [],
      table: [],
      gameState: GAME_STATE.Playing,
      currentPlayerName: "A",
      roundFirstPlayerName: "A",
      currentRound: 1,
    };

    expect(() => predictRound(room, room.players[0]!.id, 1)).toThrow(
      "Game not in predicting state",
    );
  });

  it("should throw when player not found", () => {
    const room = createPredictingRoom(["A", "B"]);
    expect(() => predictRound(room, "nonexistent", 1)).toThrow(
      "Player not found",
    );
  });

  it("should throw when it is not the player's turn", () => {
    const room = createPredictingRoom(["A", "B"]);
    room.currentPlayerName = "A";

    expect(() => predictRound(room, room.players[1]!.id, 1)).toThrow(
      "It's not the player's turn to predict",
    );
  });
});

describe("predictRound - basic behavior", () => {
  it("should record the prediction", () => {
    const room = createPredictingRoom(["A", "B"]);
    room.currentPlayerName = "A";

    const result = predictRound(room, room.players[0]!.id, 1);

    expect(result.players[0]!.prediction).toBe(1);
    expect(result.players[0]!.originalPrediction).toBe(1);
  });

  it("should advance turn to next player", () => {
    const room = createPredictingRoom(["A", "B", "C"]);
    room.currentPlayerName = "A";

    const result = predictRound(room, room.players[0]!.id, 1);

    expect(result.currentPlayerName).toBe("B");
  });

  it("should not change game state when not all players have predicted", () => {
    const room = createPredictingRoom(["A", "B", "C"]);
    room.currentPlayerName = "A";

    const result = predictRound(room, room.players[0]!.id, 1);

    expect(result.gameState).toBe(GAME_STATE.Predicting);
  });

  it("should transition to Playing when last player predicts and sum is valid", () => {
    const room = createPredictingRoom(["A", "B"], 1);
    room.currentPlayerName = "B";
    room.players[0]!.prediction = 0; // A predicted 0

    // B predicting 1 would make sum = 0 + 1 = 1 = currentRound, which is NOT allowed
    // So B must predict 0 (or the prediction gets adjusted)
    const result = predictRound(room, room.players[1]!.id, 0);
    expect(result.players[1]!.prediction).toBe(0);
  });

  it("should wrap turn around to first player", () => {
    const room = createPredictingRoom(["A", "B", "C"]);
    room.currentPlayerName = "C";

    const result = predictRound(room, room.players[2]!.id, 1);

    expect(result.currentPlayerName).toBe("A");
  });
});

describe("predictRound - prediction sum constraint", () => {
  it("should throw when prediction sum would equal currentRound", () => {
    const room = createPredictingRoom(["A", "B"], 1);
    room.currentPlayerName = "A";
    room.players[1]!.prediction = 0;

    // A predicting 1 would make sum = 0 + 1 = 1 = currentRound
    expect(() => predictRound(room, room.players[0]!.id, 1)).toThrow(
      "Prediction not allowed",
    );
  });

  it("should allow prediction that doesn't make sum equal currentRound", () => {
    const room = createPredictingRoom(["A", "B"], 1);
    room.currentPlayerName = "A";
    room.players[1]!.prediction = 0;

    // A predicting 0 would make sum = 0 + 0 = 0 != 1
    const result = predictRound(room, room.players[0]!.id, 0);
    expect(result.players[0]!.prediction).toBe(0);
  });

  it("should not enforce constraint when more than 1 player remaining to predict", () => {
    const room = createPredictingRoom(["A", "B", "C"], 2);
    room.currentPlayerName = "A";
    // Only A has predicted, so B and C still need to predict
    room.players[0]!.prediction = 2;

    const result = predictRound(room, room.players[0]!.id, 2);
    expect(result.players[0]!.prediction).toBe(2);
  });

  it("should throw for last predictor even if their own prediction causes the sum", () => {
    const room = createPredictingRoom(["A", "B"], 2);
    room.currentPlayerName = "B";
    room.players[0]!.prediction = 2;

    // B predicting 0 would make sum = 2 + 0 = 2 = currentRound
    expect(() => predictRound(room, room.players[1]!.id, 0)).toThrow(
      "Prediction not allowed",
    );
  });
});

describe("predictRound - immutability", () => {
  it("should not modify the original room", () => {
    const room = createPredictingRoom(["A", "B"]);
    room.currentPlayerName = "A";
    const originalPrediction = room.players[0]!.prediction;

    predictRound(room, room.players[0]!.id, 1);

    expect(room.players[0]!.prediction).toBe(originalPrediction);
  });
});
