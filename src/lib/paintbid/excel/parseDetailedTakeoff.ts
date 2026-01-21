/**
 * Parser for detailed takeoff format with classification and UOM columns
 * Handles Excel format:
 * - Column A: Classification (item description)
 * - Column B: Quantity1
 * - Column C: UOM1 (Unit of Measure 1)
 * - Column D: Quantity2 (optional)
 * - Column E: UOM2 (optional)
 */

import { cellString, cellNumber, isEmptyRow } from "./xlsx";
import { normalizeUom, type StandardUOM } from "./uom";
import { normalizeClassification } from "./normalizeClassification";
import { mapRowToBucket, type MapResult } from "./mappingRules";

export interface DetailedTakeoffRow {
  rowIndex: number;
  classification: string;
  classificationKey: string;  // Normalized for matching
  quantity1?: number;
  uom1Raw?: string;
  uom1: StandardUOM;
  quantity2?: number;
  uom2Raw?: string;
  uom2?: StandardUOM;
  mapResult: MapResult;
  type: "mapped" | "unmapped" | "header" | "blank";
}

export interface ParsedDetailedTakeoff {
  source: "detailed_takeoff";
  rows: DetailedTakeoffRow[];
  raw: unknown[][];
  summary: {
    totalRows: number;
    mappedRows: number;
    unmappedRows: number;
    blankRows: number;
    buckets: Map<string, {
      label: string;
      count: number;
      totalQuantity: number;
      uom: StandardUOM;
    }>;
  };
}

/**
 * Check if a row looks like a header row
 */
function isHeaderRow(row: unknown[]): boolean {
  const col0 = cellString(row[0]).toLowerCase();
  const col1 = cellString(row[1]).toLowerCase();

  // Common header patterns
  if (col0.includes("classification") || col0.includes("description") || col0.includes("item")) {
    return true;
  }
  if (col1.includes("quantity") || col1.includes("qty")) {
    return true;
  }

  return false;
}

/**
 * Parse detailed takeoff format
 */
export function parseDetailedTakeoff(rows: unknown[][]): ParsedDetailedTakeoff {
  const parsedRows: DetailedTakeoffRow[] = [];
  const buckets = new Map<string, {
    label: string;
    count: number;
    totalQuantity: number;
    uom: StandardUOM;
  }>();

  let mappedCount = 0;
  let unmappedCount = 0;
  let blankCount = 0;

  console.log("🔍 parseDetailedTakeoff: Starting to parse", rows.length, "rows");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Skip empty rows
    if (isEmptyRow(row)) {
      parsedRows.push({
        rowIndex: i,
        classification: "",
        classificationKey: "",
        uom1: "UNKNOWN",
        mapResult: { status: "unmapped", reason: "NoRuleMatch", details: {} },
        type: "blank"
      });
      blankCount++;
      continue;
    }

    // Skip header rows
    if (isHeaderRow(row)) {
      parsedRows.push({
        rowIndex: i,
        classification: cellString(row[0]),
        classificationKey: "",
        uom1: "UNKNOWN",
        mapResult: { status: "unmapped", reason: "NoRuleMatch", details: {} },
        type: "blank"  // Treat headers as blank
      });
      blankCount++;
      continue;
    }

    // Parse data row
    const classification = cellString(row[0]);
    const quantity1 = cellNumber(row[1]);
    const uom1Raw = cellString(row[2]);
    const quantity2 = cellNumber(row[3]);
    const uom2Raw = cellString(row[4]);

    // Skip rows without classification
    if (!classification) {
      parsedRows.push({
        rowIndex: i,
        classification: "",
        classificationKey: "",
        uom1: "UNKNOWN",
        mapResult: { status: "unmapped", reason: "NoRuleMatch", details: {} },
        type: "blank"
      });
      blankCount++;
      continue;
    }

    // Normalize classification and UOM
    const classificationKey = normalizeClassification(classification);
    const uom1 = normalizeUom(uom1Raw);
    const uom2 = uom2Raw ? normalizeUom(uom2Raw) : undefined;

    // Map to bucket
    const mapResult = mapRowToBucket(classificationKey, uom1, classification);

    // Create row object
    const detailedRow: DetailedTakeoffRow = {
      rowIndex: i,
      classification,
      classificationKey,
      quantity1: quantity1 || undefined,
      uom1Raw,
      uom1,
      quantity2: quantity2 || undefined,
      uom2Raw,
      uom2,
      mapResult,
      type: mapResult.status === "mapped" ? "mapped" : "unmapped"
    };

    parsedRows.push(detailedRow);

    // Update statistics
    if (mapResult.status === "mapped") {
      mappedCount++;

      // Update bucket summary
      const bucket = buckets.get(mapResult.bucket) || {
        label: mapResult.label,
        count: 0,
        totalQuantity: 0,
        uom: uom1
      };

      bucket.count++;
      bucket.totalQuantity += quantity1 || 0;
      buckets.set(mapResult.bucket, bucket);
    } else {
      unmappedCount++;
      console.warn(`❌ Unmapped row ${i}: "${classification}" (${uom1Raw}) - Reason: ${mapResult.reason}`);
      if (mapResult.details.suggestedTokens) {
        console.log(`   Suggested tokens: ${mapResult.details.suggestedTokens.join(", ")}`);
      }
    }

    console.log(`Row ${i}: "${classification}" → "${classificationKey}" [${uom1}] → ${
      mapResult.status === "mapped" ? `✓ ${mapResult.bucket}` : `✗ ${mapResult.reason}`
    }`);
  }

  console.log(`📊 Parsing complete: ${mappedCount} mapped, ${unmappedCount} unmapped, ${blankCount} blank`);

  return {
    source: "detailed_takeoff",
    rows: parsedRows,
    raw: rows,
    summary: {
      totalRows: rows.length,
      mappedRows: mappedCount,
      unmappedRows: unmappedCount,
      blankRows: blankCount,
      buckets
    }
  };
}