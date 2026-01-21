/**
 * Enhanced normalization that handles both key-value and detailed takeoff formats
 * Integrates classification/UOM mapping with existing pattern-based system
 */

import type { ParsedGroupedCounts } from "./parseFile2Grouped";
import { parseDetailedTakeoff, type ParsedDetailedTakeoff } from "./parseDetailedTakeoff";
import type { ImportReport } from "../types";
import type { NormalizedCounts } from "./normalizeCounts";
import { improvedNormalizeCounts } from "./improvedNormalizeCounts";

/**
 * Detect if Excel data is detailed takeoff format
 * (has classification in col A and UOM in col C/E)
 */
function isDetailedTakeoffFormat(rows: unknown[][]): boolean {
  // Look for patterns in first 10 data rows
  let hasClassification = false;
  let hasUOM = false;

  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;

    const col0 = String(row[0] || "").trim();
    const col2 = String(row[2] || "").trim().toUpperCase();

    // Check for classification-like content in col A
    if (col0.length > 5 && /[a-zA-Z]/.test(col0)) {
      hasClassification = true;
    }

    // Check for UOM patterns in col C
    if (col2 && (
      col2 === "FT" || col2 === "LF" || col2 === "SF" ||
      col2 === "EA" || col2 === "EACH" || col2 === "FT/LF" ||
      col2.includes("SQFT") || col2.includes("SQ")
    )) {
      hasUOM = true;
    }

    if (hasClassification && hasUOM) {
      return true;
    }
  }

  return false;
}

/**
 * Map detailed takeoff buckets to normalized counts
 */
function mapBucketsToNormalizedCounts(takeoff: ParsedDetailedTakeoff): NormalizedCounts {
  const counts: NormalizedCounts = {};

  // Map bucket IDs to normalized count keys
  const bucketMapping: Record<string, keyof NormalizedCounts> = {
    // Units
    "UNIT_COUNT": "unitsCount",

    // Corridors
    "CORRIDOR_WALL_SF": "corridorsWallSF",
    "CORRIDOR_CEILING_SF": "corridorsCeilingSF",
    "CORRIDOR_DOOR_COUNT": "corridorsDoorCount",
    "CORRIDOR_ENTRY_DOOR_COUNT": "corridorsEntryDoorCount",
    "CORRIDOR_BASE_LF": "corridorsBaseCount",
    "CORRIDOR_STORAGE_COUNT": "corridorsStorageCount",

    // Stairs
    "STAIRS_LEVELS": "stairs1Levels",
    "STAIR_RAIL_LF": "stairwellRails",

    // Amenity
    "AMENITY_REC_ROOM_SF": "amenityRecRoomSF",
    "AMENITY_LOBBY_SF": "amenityLobbySF",

    // Exterior
    "EXTERIOR_DOOR_COUNT": "exteriorDoorCount",
    "PARAPET_LF": "parapetLF",
    "BALCONY_RAIL_LF": "balconyRailLF",
    "WINDOW_TRIM_COUNT": "windowTrimCount",
    "WOOD_VERTICALS_COUNT": "woodVerticalsCount",
    "STUCCO_SF": "stuccoSF",
    "STUCCO_FEATURE_COUNT": "stuccoAccentCount",

    // Garage
    "GARAGE_WALL_SF": "garageWallSF",
    "GARAGE_DOOR_COUNT": "garageDoorCount",
    "GARAGE_TRASH_ROOM_COUNT": "garageTrashRoomCount",
    "GARAGE_BIKE_STORAGE_COUNT": "garageBikeStorageCount",
    "GARAGE_COLUMN_COUNT": "garageColumnCount",

    // Landscape
    "LANDSCAPE_GATE_COUNT": "gateCount",

    // New buckets from the mapping rules
    "FENCE_LF": "fenceLF",
    "CMU_WALL_LF": "cmuWallLF",
    "CMU_WALL_SF": "cmuWallSF"
  };

  // Aggregate quantities by bucket
  for (const bucket of takeoff.summary.buckets.values()) {
    // Find normalized key for this bucket
    for (const [bucketId, info] of takeoff.summary.buckets) {
      const normalizedKey = bucketMapping[bucketId];
      if (normalizedKey) {
        counts[normalizedKey] = info.totalQuantity;
      }
    }
  }

  return counts;
}

/**
 * Enhanced normalization with classification/UOM support
 */
export function enhancedNormalizeCounts(
  data: ParsedGroupedCounts | unknown[][]
): {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
  confidence: number;
  detailedTakeoff?: ParsedDetailedTakeoff;
} {
  // Check if this is raw Excel data (unknown[][])
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const rows = data as unknown[][];

    // Detect format
    if (isDetailedTakeoffFormat(rows)) {
      console.log("📊 Detected detailed takeoff format with classification/UOM");

      // Parse as detailed takeoff
      const takeoff = parseDetailedTakeoff(rows);

      // Map to normalized counts
      const counts = mapBucketsToNormalizedCounts(takeoff);

      // Build mapped/unmapped arrays for ImportReport
      const mapped: ImportReport["mapped"] = [];
      const unmapped: ImportReport["unmapped"] = [];

      for (const row of takeoff.rows) {
        if (row.type === "mapped" && row.mapResult.status === "mapped") {
          mapped.push({
            section: row.mapResult.bucket.split("_")[0], // Extract section from bucket
            key: row.classification,
            valueNum: row.quantity1 || 0,
            mappedTo: row.mapResult.bucket,
            rowIndex: row.rowIndex
          });
        } else if (row.type === "unmapped") {
          unmapped.push({
            key: row.classification,
            valueRaw: `${row.quantity1 || ""} ${row.uom1Raw || ""}`,
            valueNum: row.quantity1 || null,
            rowIndex: row.rowIndex,
            reason: row.mapResult.status === "unmapped" && row.mapResult.reason === "UnsupportedUOM"
              ? "unrecognized_key"  // Map to existing reason type
              : "unrecognized_key",
            suggestions: row.mapResult.status === "unmapped" && row.mapResult.details.suggestedTokens
              ? row.mapResult.details.suggestedTokens.map(token => ({
                  label: token,
                  target: token,
                  score: 0.5
                }))
              : []
          });
        }
      }

      const confidence = takeoff.summary.totalRows > 0
        ? takeoff.summary.mappedRows / (takeoff.summary.mappedRows + takeoff.summary.unmappedRows)
        : 0;

      return {
        counts,
        mapped,
        unmapped,
        confidence,
        detailedTakeoff: takeoff
      };
    }
  }

  // Fall back to improved pattern matching for key-value format
  if ('source' in data && data.source === 'file2') {
    console.log("📊 Using pattern-based normalization for key-value format");
    return improvedNormalizeCounts(data as ParsedGroupedCounts);
  }

  // Can't process this format
  throw new Error("Unsupported data format for normalization");
}

/**
 * Extended normalized counts to include new buckets
 */
export interface ExtendedNormalizedCounts extends NormalizedCounts {
  // New fields for detailed takeoff items
  fenceLF?: number;
  cmuWallLF?: number;
  cmuWallSF?: number;
  stuccoAccentCount?: number;
}