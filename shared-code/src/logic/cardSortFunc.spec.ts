import { describe, expect, it } from "vitest";
import type { CardCode } from "../types";
import { cardSortFunc } from "./cardSortFunc";

describe("cardSortFunc", () => {
  it("should sort cards by ascending value", () => {
    const cards: CardCode[] = ["KS", "2H", "AD", "5C", "QD", "0S", "3H"];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual(["AD", "2H", "3H", "5C", "0S", "QD", "KS"]);
  });

  it("should not change order based on suit", () => {
    const cards: CardCode[] = ["KH", "KC", "KD", "KS", "AS", "AD", "AC", "AH"];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual(["AS", "AD", "AC", "AH", "KH", "KC", "KD", "KS"]);
  });

  it("should handle already sorted cards", () => {
    const cards: CardCode[] = ["AS", "2S", "3S", "4S"];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual(cards);
  });

  it("should handle reverse sorted cards", () => {
    const cards: CardCode[] = ["4S", "3S", "2S", "AS"];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual(["AS", "2S", "3S", "4S"]);
  });

  it("should handle single card", () => {
    const cards: CardCode[] = ["KS"];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual(["KS"]);
  });

  it("should handle empty array", () => {
    const cards: CardCode[] = [];
    const sorted = cards.toSorted(cardSortFunc);

    expect(sorted).toEqual([]);
  });
});
