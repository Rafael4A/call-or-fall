import { describe, expect, it } from "vitest";
import { GAME_STATE } from "../constants";
import { createRoom } from "./createRoom";

describe("createRoom", () => {
  it("should create a room with one player", () => {
    const room = createRoom("Host", "room1");

    expect(room.id).toBe("room1");
    expect(room.players).toHaveLength(1);
    expect(room.players[0]!.username).toBe("Host");
    expect(room.players[0]!.isBot).toBe(false);
  });

  it("should start in WaitingForPlayers state", () => {
    const room = createRoom("Host", "room1");

    expect(room.gameState).toBe(GAME_STATE.WaitingForPlayers);
  });

  it("should have default room options", () => {
    const room = createRoom("Host", "room1");

    expect(room.options.scoreLimit).toBe(10);
    expect(room.options.showWinningCard).toBe(false);
    expect(room.options.deckCount).toBe(1);
  });

  it("should have empty deck and table", () => {
    const room = createRoom("Host", "room1");

    expect(room.deck).toEqual([]);
    expect(room.table).toEqual([]);
  });

  it("should have empty currentPlayerName and roundFirstPlayerName", () => {
    const room = createRoom("Host", "room1");

    expect(room.currentPlayerName).toBe("");
    expect(room.roundFirstPlayerName).toBe("");
    expect(room.currentRound).toBe(0);
  });
});
