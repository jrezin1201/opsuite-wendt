/**
 * PaintBid POC - Normalization Utilities
 * Used for matching takeoff items to pricebook items
 */

/**
 * Normalize a string for comparison and mapping
 * - Lowercase
 * - Trim whitespace
 * - Remove punctuation
 * - Collapse multiple spaces to single space
 */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Collapse whitespace
}

/**
 * Check if a normalized string contains a substring
 */
export function containsNormalized(haystack: string, needle: string): boolean {
  return normalizeName(haystack).includes(normalizeName(needle));
}

/**
 * Find best match from a list of options based on normalized string matching
 */
export function findBestMatch(
  query: string,
  options: Array<{ id: string; name: string }>
): string | null {
  const normalizedQuery = normalizeName(query);

  // Exact match first
  for (const option of options) {
    if (normalizeName(option.name) === normalizedQuery) {
      return option.id;
    }
  }

  // Substring match
  for (const option of options) {
    if (containsNormalized(option.name, query)) {
      return option.id;
    }
  }

  // No match found
  return null;
}
