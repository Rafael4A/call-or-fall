import type { CardCode } from "../types";
import { getCardValue } from "./getCardValue";

export const cardSortFunc = (a: CardCode, b: CardCode) => {
  const aValue = getCardValue(a);
  const bValue = getCardValue(b);

  return aValue - bValue;
};
