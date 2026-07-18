import type { CardCode } from "./CardCode.js";

export interface Player {
  username: string;
  id: string;
  cards: CardCode[];
  score: number;
  isBot: boolean;
}

export interface PlayerOpponentDTO extends Omit<Player, "id" | "cards"> {}
