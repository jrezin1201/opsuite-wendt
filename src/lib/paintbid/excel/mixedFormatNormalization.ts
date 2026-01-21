/**
 * Mixed Format Normalization
 * Handles files with both key-value and classification/UOM formats
 */

import type { ParsedGroupedCounts } from "./parseFile2Grouped";
import type { ImportReport } from "../types";
import type { NormalizedCounts } from "./normalizeCounts";
import { parseDetailedTakeoff } from "./parseDetailedTakeoff";
import { normalizeWithIntent } from "../intent/normalizeWithIntent";

export interface MixedFormatResult {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
  confidence: number;
}

/**
 * Process mixed format data - handles both key-value and classification/UOM
 */
export function processMixedFormat(
  rows: unknown[][],
  parsed: ParsedGroupedCounts
): MixedFormatResult {
  const allMapped: ImportReport["mapped"] = [];
  const allUnmapped: ImportReport["unmapped"] = [];
  const aggregatedCounts: NormalizedCounts = {};

  console.log("Processing mixed format data...");

  // First, process key-value rows using intent resolver
  try {
    const intentResult = normalizeWithIntent(parsed);
    console.log(`Intent resolver processed ${intentResult.mapped.length} key-value items`);

    // Merge results
    Object.assign(aggregatedCounts, intentResult.counts);
    allMapped.push(...intentResult.mapped);
    allUnmapped.push(...intentResult.unmapped);
  } catch (e) {
    console.log("Intent resolver error:", e);
  }

  // Second, look for classification/UOM rows and process them
  const classificationRows: unknown[][] = [];
  let hasClassificationFormat = false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length < 3) continue;

    const col0 = String(row[0] || "").trim();
    const col1 = row[1];
    const col2 = String(row[2] || "").trim().toUpperCase();

    // Check if this looks like a classification/UOM row
    if (col0.length > 3 &&
        (typeof col1 === "number" || !isNaN(Number(col1))) &&
        col2 && (col2.includes("FT") || col2.includes("LF") ||
                 col2.includes("SF") || col2 === "EA" ||
                 col2.includes("SQFT"))) {
      hasClassificationFormat = true;
      classificationRows.push(row);
    }
  }

  if (hasClassificationFormat && classificationRows.length > 0) {
    console.log(`Found ${classificationRows.length} classification/UOM rows`);

    // Add a header if needed
    if (!classificationRows[0] ||
        !String(classificationRows[0][0]).toLowerCase().includes("classification")) {
      classificationRows.unshift(["Classification", "Quantity1", "UOM1", "Quantity2", "UOM2"]);
    }

    try {
      const takeoffResult = parseDetailedTakeoff(classificationRows);
      console.log(`Detailed takeoff processed ${takeoffResult.summary.mappedRows} items`);

      // Convert takeoff results to mapped/unmapped format
      for (const row of takeoffResult.rows) {
        if (row.type === "mapped" && row.mapResult.status === "mapped") {
          allMapped.push({
            section: row.mapResult.bucket.split("_")[0],
            key: row.classification,
            valueNum: row.quantity1 || 0,
            mappedTo: row.mapResult.bucket,
            rowIndex: row.rowIndex
          });

          // Add to normalized counts
          if (row.mapResult.bucket === "FENCE_LF" && row.quantity1) {
            aggregatedCounts.fenceLF = (aggregatedCounts.fenceLF || 0) + row.quantity1;
          } else if (row.mapResult.bucket === "CMU_WALL_LF" && row.quantity1) {
            aggregatedCounts.cmuWallLF = (aggregatedCounts.cmuWallLF || 0) + row.quantity1;
          } else if (row.mapResult.bucket === "STUCCO_FEATURE_COUNT" && row.quantity1) {
            aggregatedCounts.stuccoAccentCount = (aggregatedCounts.stuccoAccentCount || 0) + row.quantity1;
          }
        } else if (row.type === "unmapped") {
          allUnmapped.push({
            key: row.classification,
            valueRaw: `${row.quantity1 || ""} ${row.uom1Raw || ""}`,
            valueNum: row.quantity1 || null,
            rowIndex: row.rowIndex,
            reason: "unrecognized_key"
          });
        }
      }
    } catch (e) {
      console.log("Detailed takeoff processing error:", e);
    }
  }

  const totalProcessed = allMapped.length + allUnmapped.length;
  const confidence = totalProcessed > 0 ? allMapped.length / totalProcessed : 0;

  console.log(`Mixed format processing complete: ${allMapped.length} mapped, ${allUnmapped.length} unmapped`);

  return {
    counts: aggregatedCounts,
    mapped: allMapped,
    unmapped: allUnmapped,
    confidence
  };
}