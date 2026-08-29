import { describe, expect, it } from "vitest";
import {
  CARDS_CODES,
  GAME_LIMITS,
  GAME_STATE,
  INITIAL_ROOM_OPTIONS,
} from "../constants";
import type { Room, RoomOptions } from "../types";
import { createPlayer } from "./createPlayer";
import { createRoom } from "./createRoom";
import { startGame } from "./startGame";

function createWaitingRoom(
  playerNames: string[],
): ReturnType<typeof createRoom> {
  const room = createRoom(playerNames[0]!, "test-room");
  for (let i = 1; i < playerNames.length; i++) {
    room.players.push(createPlayer(playerNames[i]!));
  }
  return room;
}

describe("startGame - validation", () => {
  it("should throw when game state is not in allowed states", () => {
    const room: Room = {
      id: "test-room",
      players: [createPlayer("A"), createPlayer("B")],
      options: { ...INITIAL_ROOM_OPTIONS },
      deck: [],
      table: [],
      gameState: GAME_STATE.GameOver,
      currentPlayerName: "A",
      roundFirstPlayerName: "A",
      currentRound: 0,
    };

    expect(() => startGame(room)).toThrow(
      "Game cannot be started at this time",
    );
  });

  it("should throw when fewer than 2 players", () => {
    const room = createRoom("Solo", "test-room");
    room.gameState = GAME_STATE.WaitingForPlayers;

    expect(() => startGame(room)).toThrow(
      "Not enough players to start the game",
    );
  });

  it("should not throw for WaitingForPlayers state with 2+ players", () => {
    const room = createWaitingRoom(["A", "B"]);
    expect(() => startGame(room)).not.toThrow();
  });

  it("should not throw for TrickOver state with 2+ players", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.TrickOver;
    expect(() => startGame(room)).not.toThrow();
  });

  it("should not throw for RoundOver state with 2+ players", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    expect(() => startGame(room)).not.toThrow();
  });
});

describe("startGame - initial setup", () => {
  it("should set random first player when starting from WaitingForPlayers", () => {
    const room = createWaitingRoom(["A", "B", "C"]);
    const result = startGame(room);

    expect(result.roundFirstPlayerName).toBeDefined();
    expect(result.players.map((p) => p.username)).toContain(
      result.roundFirstPlayerName,
    );
  });

  it("should set currentPlayerName to roundFirstPlayerName when starting from WaitingForPlayers", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    expect(result.currentPlayerName).toBe(result.roundFirstPlayerName);
  });

  it("should set currentRound to 1 when starting from WaitingForPlayers", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    expect(result.currentRound).toBe(1);
  });

  it("should transition to Predicting state", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    expect(result.gameState).toBe(GAME_STATE.Predicting);
  });

  it("should populate the deck before dealing", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    const expectedRemaining =
      CARDS_CODES.length - result.players.length * result.currentRound;
    expect(result.deck.length).toBe(expectedRemaining);
  });

  it("should deal cards to all players", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    for (const player of result.players) {
      expect(player.cards.length).toBe(1);
    }
  });

  it("should clear the table", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.table = [{ card: "AS", owner: "A" }];

    const result = startGame(room);

    expect(result.table).toEqual([]);
  });

  it("should reset player predictions and scores", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.players[0]!.prediction = 5;
    room.players[0]!.currentRoundScore = 3;
    room.players[0]!.score = 10;

    const result = startGame(room);

    expect(result.players[0]!.prediction).toBeUndefined();
    expect(result.players[0]!.originalPrediction).toBeUndefined();
    expect(result.players[0]!.currentRoundScore).toBe(0);
  });
});

describe("startGame - from RoundOver", () => {
  it("should continue to next round when score limit not reached", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 2; // After completing round 1, currentRound was incremented to 2
    room.players[0]!.score = 0;
    room.players[1]!.score = 0;
    room.options.deckCount = 1;
    room.roundFirstPlayerName = "A";
    room.players.forEach((p) => {
      p.prediction = undefined;
      p.cards = [];
      p.currentRoundScore = 0;
    });

    const result = startGame(room);

    expect(result.gameState).toBe(GAME_STATE.Predicting);
    // currentRound stays at 2 (not reset when starting from RoundOver)
    expect(result.currentRound).toBe(2);
  });

  it("should end game when score limit is reached", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 2;
    room.players[0]!.score = 10;
    room.players[1]!.score = 5;
    room.options.scoreLimit = 10;
    room.options.deckCount = 1;
    room.roundFirstPlayerName = "A";

    const result = startGame(room);

    expect(result.gameState).toBe(GAME_STATE.GameOver);
  });

  it("should end game when not enough cards for next round", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 27; // (27+1) * 2 = 56 > 52
    room.players[0]!.score = 0;
    room.players[1]!.score = 0;
    room.options.deckCount = 1;
    room.roundFirstPlayerName = "A";

    const result = startGame(room);

    expect(result.gameState).toBe(GAME_STATE.GameOver);
  });

  it("should rotate first player for next round", () => {
    const room = createWaitingRoom(["A", "B", "C"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 2;
    room.roundFirstPlayerName = "A";
    room.players.forEach((p) => (p.score = 0));
    room.options.deckCount = 1;

    const result = startGame(room);

    expect(result.roundFirstPlayerName).not.toBe("A");
  });
});

describe("startGame - from TrickOver", () => {
  it("should start from TrickOver state (continue game)", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.TrickOver;
    room.currentRound = 1;
    room.players.forEach((p) => {
      p.prediction = 1;
      p.cards = ["AS"];
    });
    room.options.deckCount = 1;

    const result = startGame(room);

    expect(result.gameState).toBe(GAME_STATE.Playing);
  });

  it("should clear the table when continuing from TrickOver", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.TrickOver;
    room.table = [{ card: "KS", owner: "A" }];
    room.currentRound = 1;
    room.players.forEach((p) => {
      p.prediction = 1;
      p.cards = ["AS"];
    });
    room.options.deckCount = 1;

    const result = startGame(room);

    expect(result.table).toEqual([]);
  });
});

describe("startGame - room options", () => {
  it("should use default options when none provided", () => {
    const room = createWaitingRoom(["A", "B"]);
    const result = startGame(room);

    expect(result.options.scoreLimit).toBe(10);
    expect(result.options.deckCount).toBe(1);
  });

  it("should apply custom deck count", () => {
    const room = createWaitingRoom(["A", "B"]);
    const options: RoomOptions = {
      scoreLimit: 10,
      showWinningCard: false,
      deckCount: 2,
    };

    const result = startGame(room, options);

    expect(result.options.deckCount).toBe(2);
    const expectedRemaining =
      CARDS_CODES.length * 2 - result.players.length * result.currentRound;
    expect(result.deck.length).toBe(expectedRemaining);
  });

  it("should clamp deck count to min", () => {
    const room = createWaitingRoom(["A", "B"]);
    const options: RoomOptions = {
      scoreLimit: 10,
      showWinningCard: false,
      deckCount: 0,
    };

    const result = startGame(room, options);

    expect(result.options.deckCount).toBe(GAME_LIMITS.MIN_DECK_COUNT);
  });

  it("should clamp deck count to max", () => {
    const room = createWaitingRoom(["A", "B"]);
    const options: RoomOptions = {
      scoreLimit: 10,
      showWinningCard: false,
      deckCount: 10,
    };

    const result = startGame(room, options);

    expect(result.options.deckCount).toBe(GAME_LIMITS.MAX_DECK_COUNT);
  });

  it("should clamp score limit when in RoundOver state with options provided", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 2;
    room.players[0]!.score = 0;
    room.players[1]!.score = 0;
    room.roundFirstPlayerName = "A";
    // Using -5 to test clamping (note: scoreLimit: 0 would be treated as falsy and use default)
    const options: RoomOptions = {
      scoreLimit: -5,
      showWinningCard: false,
      deckCount: 1,
    };

    const result = startGame(room, options);

    expect(result.options.scoreLimit).toBe(GAME_LIMITS.MIN_SCORE_LIMIT);
  });

  it("should clamp score limit to max", () => {
    const room = createWaitingRoom(["A", "B"]);
    room.gameState = GAME_STATE.RoundOver;
    room.currentRound = 2;
    room.players[0]!.score = 0;
    room.players[1]!.score = 0;
    room.roundFirstPlayerName = "A";
    const options: RoomOptions = {
      scoreLimit: 100,
      showWinningCard: false,
      deckCount: 1,
    };

    const result = startGame(room, options);

    expect(result.options.scoreLimit).toBe(GAME_LIMITS.MAX_SCORE_LIMIT);
  });

  it("should apply showWinningCard option", () => {
    const room = createWaitingRoom(["A", "B"]);
    const options: RoomOptions = {
      scoreLimit: 10,
      showWinningCard: true,
      deckCount: 1,
    };

    const result = startGame(room, options);

    expect(result.options.showWinningCard).toBe(true);
  });

  it("should treat undefined deckCount as default", () => {
    const room = createWaitingRoom(["A", "B"]);
    const options: RoomOptions = {
      scoreLimit: 10,
      showWinningCard: false,
      deckCount: undefined as any,
    };

    const result = startGame(room, options);

    expect(result.options.deckCount).toBe(INITIAL_ROOM_OPTIONS.deckCount);
  });
});

describe("startGame - immutability", () => {
  it("should not modify the original room", () => {
    const room = createWaitingRoom(["A", "B"]);
    const originalGameState = room.gameState;

    startGame(room);

    expect(room.gameState).toBe(originalGameState);
  });
});
