import { describe, expect, it } from "vitest";
import { getCardValue } from "./getCardValue";
import { HIDDEN_CARD } from "../constants";

describe("getCardValue", () => {
  it("should return 1 for Ace", () => {
    expect(getCardValue("AS")).toBe(1);
    expect(getCardValue("AD")).toBe(1);
    expect(getCardValue("AC")).toBe(1);
    expect(getCardValue("AH")).toBe(1);
  });

  it("should return correct numeric value for number cards", () => {
    expect(getCardValue("2S")).toBe(2);
    expect(getCardValue("3D")).toBe(3);
    expect(getCardValue("5H")).toBe(5);
    expect(getCardValue("9C")).toBe(9);
  });

  it("should return 10 for card code '0'", () => {
    expect(getCardValue("0S")).toBe(10);
    expect(getCardValue("0D")).toBe(10);
    expect(getCardValue("0C")).toBe(10);
    expect(getCardValue("0H")).toBe(10);
  });

  it("should return correct values for face cards", () => {
    expect(getCardValue("JS")).toBe(11);
    expect(getCardValue("QD")).toBe(12);
    expect(getCardValue("KS")).toBe(13);
  });

  it("should return -1 for hidden card", () => {
    expect(getCardValue(HIDDEN_CARD)).toBe(-1);
  });
});
