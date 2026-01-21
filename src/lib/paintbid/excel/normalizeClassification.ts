/**
 * Classification normalization utility
 * Normalizes and standardizes classification strings for matching
 */

/**
 * Normalize text by removing punctuation and standardizing whitespace
 * @param s - Raw classification string
 * @returns Normalized lowercase string
 */
export function normalizeText(s: string): string {
  if (!s) return "";

  return s
    .toLowerCase()
    // Replace punctuation with spaces
    .replace(/[.,@()\/-]/g, " ")
    // Remove other special characters
    .replace(/['"#$%^&*+=\[\]{};:<>?\\|`~]/g, "")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    // Trim
    .trim();
}

/**
 * Apply aliases and canonical tokens to normalized text
 * @param normalized - Already normalized text
 * @returns Canonical key for matching
 */
export function aliasKey(normalized: string): string {
  if (!normalized) return "";

  let result = normalized;

  // Apply synonyms and canonical forms
  const aliases: Record<string, string> = {
    // Building elements
    "balc": "balcony",
    "balcs": "balcony",
    "balcony": "balcony",

    // Materials
    "cmu": "cmu",
    "concrete masonry": "cmu",
    "concrete block": "cmu",

    // Fence
    "chain link": "chain link",
    "chainlink": "chain link",

    // Other
    "cor": "corridor",
    "cors": "corridor",
    "corridors": "corridor",
    "lid": "ceiling",
    "clg": "ceiling",
    "sf": "",  // Remove unit indicators from classification
    "lf": "",  // Remove unit indicators from classification
    "ea": "",  // Remove unit indicators from classification
    "sqft": "", // Remove unit indicators from classification
    "sq ft": "", // Remove unit indicators from classification
  };

  // Apply aliases
  for (const [pattern, replacement] of Object.entries(aliases)) {
    const regex = new RegExp(`\\b${pattern}\\b`, "gi");
    result = result.replace(regex, replacement);
  }

  // Special handling for "chain link fence"
  if (result.includes("chain link") && result.includes("fence")) {
    // Normalize to "fence chain link" for consistent matching
    result = result.replace(/chain\s+link\s+fence/g, "fence chain link");
  }

  // Remove extra spaces again after replacements
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * Full normalization pipeline
 * @param classification - Raw classification string
 * @returns Canonical classification key
 */
export function normalizeClassification(classification: string): string {
  const normalized = normalizeText(classification);
  return aliasKey(normalized);
}