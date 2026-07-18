import type { Player } from "../types/Player.js";

export function createPlayer(username: string, isBot = false): Player {
  return {
    id: crypto.randomUUID(),
    username,
    cards: [],
    isBot,
    score: 0,
  };
}
