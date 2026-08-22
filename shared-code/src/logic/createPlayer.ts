import type { Player } from "../types";

export function createPlayer(username: string, isBot = false): Player {
  return {
    id: crypto.randomUUID(),
    username,
    cards: [],
    isBot,
    score: 0,
    prediction: undefined,
    currentRoundScore: 0,
  };
}
