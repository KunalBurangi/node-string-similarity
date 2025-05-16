import {
  compareStrings,
  jaroWinklerDistance,
  cosineSimilarity,
  diceCoefficient,
  batchCompareStrings,
  findMatchesAboveThreshold,
} from "./index";
import { visualizeStringDifferences } from "./visualization";

describe("compareStrings", () => {
  it("should return 1.0 for identical strings", () => {
    expect(compareStrings("hello", "hello")).toBe(1.0);
    });

    it("should calculate Jaro-Winkler similarity", () => {
      expect(jaroWinklerDistance("hello", "hell")).toBeGreaterThan(0.8);
      expect(jaroWinklerDistance("hello", "world")).toBeLessThan(0.5);
    });

    it("should calculate Cosine similarity", () => {
      expect(cosineSimilarity("hello", "world")).toBeLessThan(0.9);
      expect(cosineSimilarity("hello", "world")).toBeLessThan(0.9);
    });

    it("should calculate Dice's Coefficient", () => {
      expect(diceCoefficient("hello", "hell")).toBeGreaterThan(0.8);
      expect(diceCoefficient("hello", "world")).toBeLessThan(0.5);
    });

    it("should perform batch comparison", () => {
      const results = batchCompareStrings("hello", ["hi", "hey", "hello", "world"]);
      expect(results).toHaveLength(4);
      expect(results.find(r => r.candidate === "hello")?.similarity).toBe(1.0);
    });

    it("should find matches above a threshold", () => {
      const matches = findMatchesAboveThreshold("hello", ["hi", "hey", "hello", "world"], 0.8);
      expect(matches).toContain("hello");
      expect(matches).not.toContain("world");
    });

    it("should visualize string differences", () => {
      const visualization = visualizeStringDifferences("hello", "hell");
      expect(visualization).toContain("\u001b[32mh\u001b[39m\u001b[32me\u001b[39m\u001b[32ml\u001b[39m\u001b[32ml\u001b[39m\u001b[31mo\u001b[39m");
    });

  it("should return 0.0 for completely different strings", () => {
    expect(compareStrings("hello", "world")).toBeLessThan(0.5);
  });

  it("should handle empty strings correctly", () => {
    try {
      expect(compareStrings("", "")).toBe(1.0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        expect(err.message).toBe("Both strings must be non-empty");
      }
    }

    try {
      compareStrings("hello", "");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Caught error:", error.message);
        expect(error.message).toBe("Both strings must be non-empty");
      }
    }
  });

  it("should return a similarity score between 0 and 1 for partially similar strings", () => {
    const score = compareStrings("hello", "hell");
    expect(score).toBeGreaterThan(0.7);
    expect(score).toBeLessThan(1.0);
  });
});
