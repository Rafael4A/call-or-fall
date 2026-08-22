import type { CardCode } from "./CardCode";

export interface Player {
  username: string;
  id: string;
  cards: CardCode[];
  score: number;
  isBot: boolean;
  prediction?: number;
  currentRoundScore: number;
}

export interface PlayerOpponentDTO extends Omit<Player, "id" | "cards"> {}
