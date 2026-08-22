import type { TFunction } from "i18next";
import { getCardValue, type CardCode } from "shared-code";

function getSuitTranslationKey(suitAbbreviation: string): string {
  switch (suitAbbreviation) {
    case "C":
      return "card-names.suits.clubs";
    case "D":
      return "card-names.suits.diamonds";
    case "H":
      return "card-names.suits.hearts";
    case "S":
      return "card-names.suits.spades";
    default:
      return "";
  }
}

export function getCardName(cardCode: CardCode, t: TFunction): string {
  const cardValue = getCardValue(cardCode);

  if (cardValue === -1) return t("card-names.hidden");

  const cardSuitAbbreviation = cardCode.slice(-1);

  const cardValueTranslationKey = `card-names.values.${cardValue}`;
  const cardSuitTranslationKey = getSuitTranslationKey(cardSuitAbbreviation);

  return t("card-names.alt", {
    value: t(cardValueTranslationKey),
    suit: t(cardSuitTranslationKey),
  });
}
