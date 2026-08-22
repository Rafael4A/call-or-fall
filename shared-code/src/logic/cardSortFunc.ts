import type { CardCode } from "../types/CardCode.js";
import { getCardValue } from "./getCardValue.js";

export const cardSortFunc = (a: CardCode, b: CardCode) => {
  const aValue = getCardValue(a);
  const bValue = getCardValue(b);

  return aValue - bValue;
};
