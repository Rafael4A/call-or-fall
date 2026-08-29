import { describe, expect, it } from "vitest";
import { createPlayer } from "./createPlayer";

describe("createPlayer", () => {
  it("should create a player with default values", () => {
    const player = createPlayer("TestUser");

    expect(player.username).toBe("TestUser");
    expect(player.cards).toEqual([]);
    expect(player.score).toBe(0);
    expect(player.isBot).toBe(false);
    expect(player.prediction).toBeUndefined();
    expect(player.originalPrediction).toBeUndefined();
    expect(player.currentRoundScore).toBe(0);
    expect(player.id).toBeDefined();
  });

  it("should generate a unique id for each player", () => {
    const player1 = createPlayer("User1");
    const player2 = createPlayer("User2");

    expect(player1.id).not.toBe(player2.id);
  });

  it("should mark player as bot when isBot is true", () => {
    const bot = createPlayer("BotUser", true);

    expect(bot.isBot).toBe(true);
  });
});
