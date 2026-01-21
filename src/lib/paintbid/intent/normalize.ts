/**
 * Intent Normalization Utilities
 * Standardize Excel keys and detect unit types
 */

import type { UnitKind } from "./types";

/**
 * Normalize an Excel key for matching
 */
export function normalizeKey(s: string): string {
  if (!s) return "";

  let normalized = s.toLowerCase();

  // Replace punctuation with spaces
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@]/g, " ");

  // Standardize common abbreviations BEFORE collapsing whitespace
  const abbreviations: Record<string, string> = {
    "balc": "balcony",
    "lid": "ceiling",
    "qty": "count",
    "ext": "exterior",
    "cor": "corridor",
    "rm": "room",
    "pkg": "parking",
    "col": "column",
    "lvl": "level",
    "lvls": "levels",
    "bldg": "building",
    "elev": "elevator",
    "mech": "mechanical",
    "elec": "electrical",
    "stor": "storage",
    "vert": "vertical",
    "horiz": "horizontal",
  };

  // Apply abbreviations
  for (const [abbr, full] of Object.entries(abbreviations)) {
    // Match as whole word (surrounded by spaces or at boundaries)
    const regex = new RegExp(`\\b${abbr}\\b`, "g");
    normalized = normalized.replace(regex, full);
  }

  // Collapse multiple spaces to single
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Detect the unit kind from a normalized key and value
 */
export function detectUnitKind(key: string, valueNum: number | null): UnitKind {
  const normalized = key.toLowerCase();

  // Check for explicit unit indicators
  if (normalized.includes("sf") || normalized.includes("sq ft") || normalized.includes("square")) {
    return "SF";
  }

  if (normalized.includes("lf") || normalized.includes("linear")) {
    return "LF";
  }

  if (normalized.includes("lvl") || normalized.includes("level")) {
    return "LVL";
  }

  if (normalized.includes("count") || normalized.includes("ea") || normalized.includes("qty") || normalized.includes("each")) {
    return "EA";
  }

  // Heuristic: if it's a small whole number, likely a count
  if (valueNum !== null && valueNum % 1 === 0 && valueNum <= 500 && valueNum > 0) {
    return "COUNT";
  }

  return "UNKNOWN";
}

/**
 * Extract tokens from normalized key for matching
 */
export function extractTokens(normalizedKey: string): string[] {
  return normalizedKey.split(" ").filter(t => t.length > 0);
}