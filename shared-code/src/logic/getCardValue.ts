import type { CardCode } from "../types";

export function getCardValue(card: CardCode): number {
  if (card === "HIDDEN") return -1;

  const rank = card.slice(0, -1);

  switch (rank) {
    case "A":
      return 1;
    case "0":
      return 10;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    default: {
      const parsed = Number(rank);
      return isNaN(parsed) ? 0 : parsed;
    }
  }
}
