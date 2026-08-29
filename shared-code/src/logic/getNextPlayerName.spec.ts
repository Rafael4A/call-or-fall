import { describe, expect, it } from "vitest";
import { GAME_STATE } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";
import { getNextPlayerName } from "./getNextPlayerName";

function createTestRoom(
  playerNames: string[],
  currentPlayerName: string,
): Room {
  return {
    id: "test-room",
    players: playerNames.map((name) => createPlayer(name)),
    options: { scoreLimit: 10, showWinningCard: false, deckCount: 1 },
    deck: [],
    table: [],
    gameState: GAME_STATE.Predicting,
    currentPlayerName,
    roundFirstPlayerName: playerNames[0],
    currentRound: 1,
  };
}

describe("getNextPlayerName", () => {
  it("should return the next player in the list", () => {
    const room = createTestRoom(["A", "B", "C"], "A");
    expect(getNextPlayerName(room)).toBe("B");
  });

  it("should wrap around to the first player", () => {
    const room = createTestRoom(["A", "B", "C"], "C");
    expect(getNextPlayerName(room)).toBe("A");
  });

  it("should return the second player when there are only 2 players", () => {
    const room = createTestRoom(["A", "B"], "A");
    expect(getNextPlayerName(room)).toBe("B");
  });

  it("should wrap around with 2 players", () => {
    const room = createTestRoom(["A", "B"], "B");
    expect(getNextPlayerName(room)).toBe("A");
  });
});
