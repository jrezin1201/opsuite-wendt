/**
 * String similarity for mapping suggestions
 * Simple token-based similarity without external dependencies
 */

/**
 * Normalize a string for comparison
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tokenize a normalized string
 */
function tokenize(str: string): Set<string> {
  return new Set(str.split(" ").filter((t) => t.length > 0));
}

/**
 * Compute token overlap similarity (0-1)
 * Formula: (common tokens) / (total unique tokens)
 */
export function tokenSimilarity(a: string, b: string): number {
  const normA = normalizeForComparison(a);
  const normB = normalizeForComparison(b);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  const tokensA = tokenize(normA);
  const tokensB = tokenize(normB);

  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

  // Count common tokens
  let common = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) common++;
  });

  // Total unique tokens
  const totalUnique = new Set([...tokensA, ...tokensB]).size;

  return common / totalUnique;
}

/**
 * Find top N similar strings from a list
 */
export function findSimilar(
  query: string,
  candidates: Array<{ label: string; target: string }>,
  topN: number = 3,
  minScore: number = 0.2
): Array<{ label: string; target: string; score: number }> {
  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: tokenSimilarity(query, candidate.label),
    }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return scored;
}
