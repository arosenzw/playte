import { calculateSpearmanCorrelation } from '../src/utils/spearmanCorrelation';

describe('calculateSpearmanCorrelation', () => {
  describe('Edge cases', () => {
    test('returns 0 for null arrays', () => {
      expect(calculateSpearmanCorrelation(null, [1, 2, 3])).toBe(0);
      expect(calculateSpearmanCorrelation([1, 2, 3], null)).toBe(0);
      expect(calculateSpearmanCorrelation(null, null)).toBe(0);
    });

    test('returns 0 for undefined arrays', () => {
      expect(calculateSpearmanCorrelation(undefined, [1, 2, 3])).toBe(0);
      expect(calculateSpearmanCorrelation([1, 2, 3], undefined)).toBe(0);
    });

    test('returns 0 for empty arrays', () => {
      expect(calculateSpearmanCorrelation([], [])).toBe(0);
      expect(calculateSpearmanCorrelation([1, 2], [])).toBe(0);
      expect(calculateSpearmanCorrelation([], [1, 2])).toBe(0);
    });

    test('returns 0 for arrays of different lengths', () => {
      expect(calculateSpearmanCorrelation([1, 2], [1, 2, 3])).toBe(0);
      expect(calculateSpearmanCorrelation([1, 2, 3], [1, 2])).toBe(0);
    });

    test('returns 1 for single item arrays', () => {
      expect(calculateSpearmanCorrelation([1], [1])).toBe(1);
      expect(calculateSpearmanCorrelation([5], [5])).toBe(1);
    });
  });

  describe('Perfect correlations', () => {
    test('returns 1.0 for identical rankings', () => {
      expect(calculateSpearmanCorrelation([1, 2, 3], [1, 2, 3])).toBe(1);
      expect(calculateSpearmanCorrelation([3, 2, 1], [3, 2, 1])).toBe(1);
      expect(calculateSpearmanCorrelation([1, 3, 2, 4], [1, 3, 2, 4])).toBe(1);
    });

    test('returns -1.0 for perfectly opposite rankings', () => {
      // For 3 items: [1,2,3] vs [3,2,1] should be -1
      expect(calculateSpearmanCorrelation([1, 2, 3], [3, 2, 1])).toBe(-1);
      
      // For 4 items: [1,2,3,4] vs [4,3,2,1] should be -1
      expect(calculateSpearmanCorrelation([1, 2, 3, 4], [4, 3, 2, 1])).toBe(-1);
    });
  });

  describe('Real-world scenarios', () => {
    test('handles similar but not identical rankings', () => {
      // [1,2,3,4] vs [1,2,4,3] - only last two swapped
      const result = calculateSpearmanCorrelation([1, 2, 3, 4], [1, 2, 4, 3]);
      // Should be positive but less than 1
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
      // Expected: 1 - (6 * (0² + 0² + 1² + 1²)) / (4 * (16 - 1))
      // = 1 - (6 * 2) / (4 * 15) = 1 - 12/60 = 1 - 0.2 = 0.8
      expect(result).toBeCloseTo(0.8, 5);
    });

    test('handles moderate correlation', () => {
      // [1,2,3,4,5] vs [2,1,3,5,4]
      const result = calculateSpearmanCorrelation([1, 2, 3, 4, 5], [2, 1, 3, 5, 4]);
      // Differences: [1,1,0,1,1] -> squared: [1,1,0,1,1] -> sum = 4
      // rho = 1 - (6 * 4) / (5 * 24) = 1 - 24/120 = 1 - 0.2 = 0.8
      expect(result).toBeCloseTo(0.8, 5);
    });

    test('handles low correlation', () => {
      // [1,2,3,4] vs [3,4,1,2] - somewhat opposite
      const result = calculateSpearmanCorrelation([1, 2, 3, 4], [3, 4, 1, 2]);
      // Differences: [2,2,2,2] -> squared: [4,4,4,4] -> sum = 16
      // rho = 1 - (6 * 16) / (4 * 15) = 1 - 96/60 = 1 - 1.6 = -0.6
      expect(result).toBeCloseTo(-0.6, 5);
    });
  });

  describe('Mathematical correctness', () => {
    test('calculates correct correlation for 2 items', () => {
      // [1,2] vs [1,2] -> perfect: 1
      expect(calculateSpearmanCorrelation([1, 2], [1, 2])).toBe(1);
      
      // [1,2] vs [2,1] -> opposite: -1
      expect(calculateSpearmanCorrelation([1, 2], [2, 1])).toBe(-1);
    });

    test('calculates correct correlation for 3 items', () => {
      // [1,2,3] vs [1,2,3] -> perfect: 1
      expect(calculateSpearmanCorrelation([1, 2, 3], [1, 2, 3])).toBe(1);
      
      // [1,2,3] vs [1,3,2] -> differences: [0,1,1] -> squared: [0,1,1] -> sum = 2
      // rho = 1 - (6 * 2) / (3 * 8) = 1 - 12/24 = 1 - 0.5 = 0.5
      expect(calculateSpearmanCorrelation([1, 2, 3], [1, 3, 2])).toBeCloseTo(0.5, 5);
    });

    test('calculates correct correlation for 4 items', () => {
      // [1,2,3,4] vs [1,2,3,4] -> perfect: 1
      expect(calculateSpearmanCorrelation([1, 2, 3, 4], [1, 2, 3, 4])).toBe(1);
      
      // [1,2,3,4] vs [4,3,2,1] -> opposite: -1
      expect(calculateSpearmanCorrelation([1, 2, 3, 4], [4, 3, 2, 1])).toBe(-1);
    });

    test('handles larger arrays correctly', () => {
      const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(calculateSpearmanCorrelation(arr1, arr2)).toBe(1);
    });
  });

  describe('Game-specific scenarios', () => {
    test('handles typical dish ranking scenario', () => {
      // Player A: [Pizza=1, Burger=2, Salad=3, Pasta=4]
      // Player B: [Pizza=1, Pasta=2, Burger=3, Salad=4]
      const playerA = [1, 2, 3, 4]; // Pizza, Burger, Salad, Pasta
      const playerB = [1, 3, 4, 2]; // Pizza, Pasta, Salad, Burger (mapped to same order)
      // Differences: [0, 1, 1, 2] -> squared: [0, 1, 1, 4] -> sum = 6
      // rho = 1 - (6 * 6) / (4 * 15) = 1 - 36/60 = 1 - 0.6 = 0.4
      const result = calculateSpearmanCorrelation(playerA, playerB);
      expect(result).toBeCloseTo(0.4, 5);
      expect(result).toBeGreaterThan(0); // Positive correlation
    });

    test('handles players with very different tastes', () => {
      // Player A: [Dish1=1, Dish2=2, Dish3=3, Dish4=4]
      // Player B: [Dish1=4, Dish2=3, Dish3=2, Dish4=1] (completely opposite)
      const playerA = [1, 2, 3, 4];
      const playerB = [4, 3, 2, 1];
      expect(calculateSpearmanCorrelation(playerA, playerB)).toBe(-1);
    });

    test('handles players with similar but not identical preferences', () => {
      // Player A: [1,2,3,4,5]
      // Player B: [1,2,4,3,5] (only swapped positions 3 and 4)
      const playerA = [1, 2, 3, 4, 5];
      const playerB = [1, 2, 4, 3, 5];
      // Differences: [0,0,1,1,0] -> squared: [0,0,1,1,0] -> sum = 2
      // rho = 1 - (6 * 2) / (5 * 24) = 1 - 12/120 = 1 - 0.1 = 0.9
      const result = calculateSpearmanCorrelation(playerA, playerB);
      expect(result).toBeCloseTo(0.9, 5);
      expect(result).toBeGreaterThan(0.8); // High positive correlation
    });
  });

  describe('Boundary values', () => {
    test('returns values between -1 and 1', () => {
      const testCases = [
        [[1, 2, 3], [1, 2, 3]], // Should be 1
        [[1, 2, 3], [3, 2, 1]], // Should be -1
        [[1, 2, 3, 4], [2, 1, 4, 3]], // Should be between -1 and 1
      ];

      testCases.forEach(([arr1, arr2]) => {
        const result = calculateSpearmanCorrelation(arr1, arr2);
        expect(result).toBeGreaterThanOrEqual(-1);
        expect(result).toBeLessThanOrEqual(1);
      });
    });
  });
});

