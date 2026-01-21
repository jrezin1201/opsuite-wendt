/**
 * Enhanced Normalization with Intent Resolution
 * Routes Excel keys to BidForm lines using intent matching
 */

import type { ParsedGroupedCounts } from "../excel/parseFile2Grouped";
import type { ImportReport } from "../types";
import type { NormalizedCounts } from "../excel/normalizeCounts";
import { resolveIntent } from "./resolve";
import { normalizeKey } from "./normalize";

export interface IntentNormalizationResult {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
  confidence: number;
  intentMappings: Map<string, {
    target: { section: string; lineLabel: string };
    value: number;
  }>;
}

/**
 * Normalize counts using intent resolution
 */
export function normalizeWithIntent(
  parsed: ParsedGroupedCounts
): IntentNormalizationResult {
  const { rows } = parsed;
  const normalized: NormalizedCounts = {};
  const mapped: ImportReport["mapped"] = [];
  const unmapped: ImportReport["unmapped"] = [];
  const intentMappings = new Map<string, {
    target: { section: string; lineLabel: string };
    value: number;
  }>();

  // Process only KV rows (rows with numeric values)
  const kvRows = rows.filter((row) => row.type === "kv" && row.valueNum !== null && row.valueNum !== undefined);

  for (const row of kvRows) {
    if (!row.key || row.valueNum === null || row.valueNum === undefined) continue;

    // Run intent resolution
    const resolution = resolveIntent({
      rawKey: row.key,
      valueNum: row.valueNum
    });

    if (resolution.status === "mapped" && resolution.target) {
      // Successfully mapped via intent
      const target = resolution.target;

      // Only process bidLine targets (not createLine suggestions)
      if (target.type !== "bidLine" && target.type !== "alternateLine") {
        continue;
      }

      // Store in normalized counts (basic compatibility)
      const normalizedKey = normalizeKey(row.key);

      // Map some common patterns to the existing NormalizedCounts interface
      if (target.section === "General" && target.lineLabel === "Units Count") {
        normalized.unitsCount = row.valueNum;
      } else if (target.section === "General" && target.lineLabel === "Total SF") {
        normalized.totalSF = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Wall SF") {
        normalized.corridorsWallSF = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Ceiling SF") {
        normalized.corridorsCeilingSF = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Door Count") {
        normalized.corridorsDoorCount = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Storage Count") {
        normalized.corridorsStorageCount = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Base Count") {
        normalized.corridorsBaseCount = row.valueNum;
      } else if (target.section === "Corridors" && target.lineLabel === "Entry Door Count") {
        normalized.corridorsEntryDoorCount = row.valueNum;
      } else if (target.section === "Stairs" && target.lineLabel === "Stair 1 Levels") {
        normalized.stairs1Levels = row.valueNum;
      } else if (target.section === "Stairs" && target.lineLabel === "Stair 2 Levels") {
        normalized.stairs2Levels = row.valueNum;
      } else if (target.section === "Amenity" && target.lineLabel === "Rec Room SF") {
        normalized.amenityRecRoomSF = row.valueNum;
      } else if (target.section === "Amenity" && target.lineLabel === "Lobby SF") {
        normalized.amenityLobbySF = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Exterior Door Count") {
        normalized.exteriorDoorCount = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Parapet LF") {
        normalized.parapetLF = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Window/Door Trim Count") {
        normalized.windowTrimCount = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Window Wood Verticals Count") {
        normalized.woodVerticalsCount = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Balcony Rail LF") {
        normalized.balconyRailLF = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Misc Count") {
        normalized.exteriorMiscCount = row.valueNum;
      } else if (target.section === "Exterior" && target.lineLabel === "Stucco Body SF") {
        normalized.stuccoSF = row.valueNum;
      } else if (target.section === "Garage" && target.lineLabel === "Wall SF") {
        normalized.garageWallSF = row.valueNum;
      } else if (target.section === "Garage" && target.lineLabel === "Trash Room Count") {
        normalized.garageTrashRoomCount = row.valueNum;
      } else if (target.section === "Garage" && target.lineLabel === "Bike Storage Count") {
        normalized.garageBikeStorageCount = row.valueNum;
      } else if (target.section === "Garage" && target.lineLabel === "Door Count") {
        normalized.garageDoorCount = row.valueNum;
      } else if (target.section === "Garage" && target.lineLabel === "Column Count") {
        normalized.garageColumnCount = row.valueNum;
      } else if (target.section === "Landscape" && target.lineLabel === "Gate Count") {
        normalized.gateCount = row.valueNum;
      }

      // Store intent mapping for later application to bid form
      if (target.type === "bidLine") {
        intentMappings.set(row.key, {
          target: { section: target.section, lineLabel: target.lineLabel },
          value: row.valueNum
        });
      }

      mapped.push({
        section: row.sectionGuess || target.section,
        key: row.key,
        valueNum: row.valueNum,
        mappedTo: `${target.section}::${target.lineLabel}`,
        rowIndex: row.rowIndex
      });

    } else if (resolution.status === "ambiguous" && resolution.candidates) {
      // Ambiguous - provide candidates for QA
      unmapped.push({
        sectionGuess: row.sectionGuess,
        key: row.key,
        valueRaw: row.valueRaw,
        valueNum: row.valueNum,
        rowIndex: row.rowIndex,
        reason: "ambiguous",
        suggestions: resolution.candidates.map(c => {
          const label = c.target.type === "bidLine" || c.target.type === "alternateLine"
            ? `${c.target.section} → ${c.target.lineLabel}`
            : `Create: ${c.target.suggestedSection} → ${c.target.suggestedLabel}`;
          const target = c.target.type === "bidLine" || c.target.type === "alternateLine"
            ? `${c.target.section}::${c.target.lineLabel}`
            : `create::${c.target.suggestedSection}::${c.target.suggestedLabel}`;
          return {
            label,
            target,
            score: c.score / 100 // Normalize score to 0-1
          };
        })
      });

    } else {
      // Unmapped - no matching rules
      unmapped.push({
        sectionGuess: row.sectionGuess,
        key: row.key,
        valueRaw: row.valueRaw,
        valueNum: row.valueNum,
        rowIndex: row.rowIndex,
        reason: "unrecognized_key",
        suggestions: []
      });
    }
  }

  const confidence = kvRows.length > 0
    ? mapped.length / kvRows.length
    : 0;

  console.log(`✅ Intent normalization complete: ${mapped.length} mapped, ${unmapped.length} unmapped (${(confidence * 100).toFixed(1)}% success)`);

  return {
    counts: normalized,
    mapped,
    unmapped,
    confidence,
    intentMappings
  };
}