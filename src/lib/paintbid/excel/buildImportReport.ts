/**
 * PaintBid - Import Report Builder
 * Generates ImportReport with confidence scoring
 */

import type { ImportReport } from "../types";
import type { NormalizedCounts } from "./normalizeCounts";
import { nanoid } from "nanoid";

/**
 * Required keys for confidence scoring
 * Tune this list based on real-world usage
 */
const REQUIRED_KEYS: (keyof NormalizedCounts)[] = [
  "unitsCount",
  "corridorsWallSF",
  "corridorsCeilingSF",
];

/**
 * At least one of these exterior anchors must be present
 */
const REQUIRED_EXTERIOR_ANCHORS: (keyof NormalizedCounts)[] = [
  "exteriorDoorCount",
  "parapetLF",
];

/**
 * At least one of these stair keys should be present
 */
const REQUIRED_STAIR_KEYS: (keyof NormalizedCounts)[] = [
  "stairs1Levels",
  "stairs2Levels",
];

/**
 * Build ImportReport from normalization results
 */
export function buildImportReport(params: {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
  ignored?: ImportReport["ignored"];
  sources: ImportReport["sources"];
}): ImportReport {
  const { counts, mapped, unmapped, ignored = [], sources } = params;

  // Compute summary stats
  const parsedRows = mapped.length + unmapped.length;
  const mappedRows = mapped.length;
  const unmappedRows = unmapped.length;
  const ignoredRows = ignored.length;
  const warnings = unmapped.filter((u) => u.reason === "ambiguous").length;

  // Compute confidence score
  const confidence = computeConfidence(counts, unmappedRows);

  const report: ImportReport = {
    id: nanoid(),
    createdAt: Date.now(),
    sources,
    summary: {
      parsedRows,
      mappedRows,
      unmappedRows,
      ignoredRows,
      warnings,
      confidence,
    },
    unmapped,
    mapped,
    ignored,
  };

  console.log("📊 ImportReport generated:", {
    id: report.id,
    confidence: report.summary.confidence,
    mapped: mappedRows,
    unmapped: unmappedRows,
    ignored: ignoredRows,
  });

  return report;
}

/**
 * Compute confidence level based on unmapped count and required keys
 */
function computeConfidence(
  counts: NormalizedCounts,
  unmappedRows: number
): "high" | "medium" | "low" {
  const missingRequired = countMissingRequiredKeys(counts);

  // HIGH: No unmapped rows AND all required keys present
  if (unmappedRows === 0 && missingRequired === 0) {
    return "high";
  }

  // LOW: Too many unmapped OR missing 2+ required keys
  if (unmappedRows > 5 || missingRequired >= 2) {
    return "low";
  }

  // MEDIUM: Everything else (unmapped <= 5 OR missing 1 required key)
  return "medium";
}

/**
 * Count how many required keys are missing
 */
function countMissingRequiredKeys(counts: NormalizedCounts): number {
  let missing = 0;

  // Check core required keys
  for (const key of REQUIRED_KEYS) {
    if (counts[key] === undefined || counts[key] === null) {
      missing++;
    }
  }

  // Check exterior anchors (at least one must be present)
  const hasExteriorAnchor = REQUIRED_EXTERIOR_ANCHORS.some(
    (key) => counts[key] !== undefined && counts[key] !== null
  );
  if (!hasExteriorAnchor) {
    missing++;
  }

  // Check stair keys (at least one should be present)
  const hasStairKey = REQUIRED_STAIR_KEYS.some(
    (key) => counts[key] !== undefined && counts[key] !== null
  );
  if (!hasStairKey) {
    missing++;
  }

  return missing;
}
