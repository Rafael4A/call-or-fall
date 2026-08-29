import { describe, expect, it } from "vitest";
import { getBestTableCard } from "./getBestTableCard";
import type { TableCard } from "../types";

describe("getBestTableCard", () => {
  it("should return undefined for empty table", () => {
    expect(getBestTableCard([])).toBeUndefined();
  });

  it("should return the highest unique card", () => {
    const table: TableCard[] = [
      { card: "2S", owner: "A" },
      { card: "5D", owner: "B" },
      { card: "KS", owner: "C" },
    ];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("KS");
  });

  it("should return undefined when all cards have same value", () => {
    const table: TableCard[] = [
      { card: "AS", owner: "A" },
      { card: "AD", owner: "B" },
      { card: "AC", owner: "C" },
    ];

    expect(getBestTableCard(table)).toBeUndefined();
  });

  it("should return undefined when all cards tie pairwise", () => {
    const table: TableCard[] = [
      { card: "KS", owner: "A" },
      { card: "KH", owner: "B" },
      { card: "QD", owner: "C" },
      { card: "QC", owner: "D" },
    ];

    expect(getBestTableCard(table)).toBeUndefined();
  });

  it("should return highest unique among mixed values", () => {
    const table: TableCard[] = [
      { card: "KS", owner: "A" },
      { card: "KH", owner: "B" },
      { card: "QD", owner: "C" },
      { card: "5S", owner: "D" },
    ];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("QD");
  });

  it("should handle single card", () => {
    const table: TableCard[] = [{ card: "AS", owner: "A" }];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("AS");
  });

  it("should handle ties that cancel out leaving one unique card", () => {
    const table: TableCard[] = [
      { card: "KS", owner: "A" },
      { card: "KH", owner: "B" },
      { card: "2S", owner: "C" },
    ];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("2S");
  });

  it("should handle 0S (value 10) correctly", () => {
    const table: TableCard[] = [
      { card: "0S", owner: "A" },
      { card: "JS", owner: "B" },
      { card: "2S", owner: "C" },
    ];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("JS");
  });

  it("should return the unique highest when multiple ties exist", () => {
    const table: TableCard[] = [
      { card: "AS", owner: "A" },
      { card: "AD", owner: "B" },
      { card: "AC", owner: "C" },
      { card: "KS", owner: "D" },
      { card: "KH", owner: "E" },
      { card: "QD", owner: "F" },
    ];

    const result = getBestTableCard(table);
    expect(result!.card).toBe("QD");
  });
});
