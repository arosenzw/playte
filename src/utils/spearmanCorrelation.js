/**
 * Calculates Spearman rank correlation coefficient between two rank arrays.
 * 
 * Spearman correlation measures the monotonic relationship between two rankings.
 * Formula: rho = 1 - (6 * Σ (a[i] - b[i])²) / (n * (n² - 1))
 * 
 * @param {number[]} rankArrayA - First array of rank positions (1 = best, higher = worse)
 * @param {number[]} rankArrayB - Second array of rank positions (1 = best, higher = worse)
 * @returns {number} Correlation coefficient between -1 and 1, where:
 *   - 1.0 = perfect positive correlation (identical rankings)
 *   - 0.0 = no correlation
 *   - -1.0 = perfect negative correlation (opposite rankings)
 */
export const calculateSpearmanCorrelation = (rankArrayA, rankArrayB) => {
  if (!rankArrayA || !rankArrayB || rankArrayA.length !== rankArrayB.length) {
    return 0;
  }
  
  const n = rankArrayA.length;
  if (n === 0) return 0;
  if (n === 1) return 1; // Perfect correlation for single item
  
  // Calculate sum of squared differences
  let sumSquaredDiffs = 0;
  for (let i = 0; i < n; i++) {
    const diff = rankArrayA[i] - rankArrayB[i];
    sumSquaredDiffs += diff * diff;
  }
  
  // Spearman correlation formula
  const rho = 1 - (6 * sumSquaredDiffs) / (n * (n * n - 1));
  return rho;
};

