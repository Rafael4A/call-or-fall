import type { TableCard } from "../types";
import { getCardValue } from "./getCardValue";

export function getBestTableCard(cards: TableCard[]): TableCard | undefined {
  const cardArray = cards.map((item) => {
    if (typeof item === "string") {
      return item;
    } else {
      return item.card;
    }
  });

  if (cardArray.length === 0) {
    return undefined;
  }

  // Mapeia cada carta para seu valor numérico
  const cardValues = cardArray.map((card) => ({
    card,
    value: getCardValue(card),
  }));

  // Conta a frequência de cada valor numérico no array
  const valueCounts = new Map<number, number>();
  for (const item of cardValues) {
    valueCounts.set(item.value, (valueCounts.get(item.value) || 0) + 1);
  }

  // Filtra apenas as cartas cujos valores aparecem exatamente 1 vez (sem empate)
  const uniqueValueCards = cardValues.filter(
    (item) => valueCounts.get(item.value) === 1,
  );

  if (uniqueValueCards.length === 0) {
    return undefined;
  }

  // Encontra a carta com o maior valor entre as únicas
  const bestCardItem = uniqueValueCards.reduce((highest, current) => {
    return current.value > highest.value ? current : highest;
  });

  // Encontra o TableCard correspondente à carta vencedora
  const bestTableCard = cards.find((item) => item.card === bestCardItem.card);

  return bestTableCard;
}
