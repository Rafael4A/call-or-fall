import { describe, expect, it } from "vitest";
import type { CardCode } from "../types";
import { shuffleDeck } from "./shuffleDeck";

const exampleDeck: CardCode[] = [
  "2H",
  "3H",
  "4H",
  "5H",
  "JH",
  "QH",
  "KH",
  "AH",
  "2D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "0D",
  "AD",
  "5C",
  "6C",
  "7C",
  "KC",
  "AC",
  "9S",
  "0S",
  "JS",
  "QS",
];

describe("shuffleDeck", () => {
  it("should return same array for single element", () => {
    const input = ["5H"];
    const result = shuffleDeck(input);

    expect(result).toEqual(["5H"]);
  });

  it("should return empty array for empty input", () => {
    expect(shuffleDeck([])).toEqual([]);
  });

  it("should return array with same elements", () => {
    const result = shuffleDeck(exampleDeck);

    expect(result).toHaveLength(exampleDeck.length);

    for (const card of exampleDeck) {
      expect(result).toContain(card);
    }
  });

  it("should not modify the original array", () => {
    const original = [...exampleDeck];

    shuffleDeck(exampleDeck);

    expect(exampleDeck).toEqual(original);
  });

  it("should return a new array (not the same reference)", () => {
    const result = shuffleDeck(exampleDeck);

    expect(result).not.toBe(exampleDeck);
  });

  it("should produce different orderings when run multiple times", () => {
    const orderings = new Set<string>();

    for (let i = 0; i < 50; i++) {
      const result = shuffleDeck(exampleDeck);
      orderings.add(result.join(","));
    }

    expect(orderings.size).toBeGreaterThan(1);
  });
});
