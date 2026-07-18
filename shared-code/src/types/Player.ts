import type { CardCode } from "./CardCode.js";

export interface Player {
  username: string;
  id: string;
  cards: CardCode[];
  score: number;
  isBot: boolean;
  prediction?: number;
}

export interface PlayerOpponentDTO extends Omit<Player, "id" | "cards"> {}
