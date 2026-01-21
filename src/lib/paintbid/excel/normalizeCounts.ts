/**
 * PaintBid - Normalize Counts
 * Maps File 2 key names to standardized field names
 */

import type { ParsedGroupedCounts, ParsedRow } from "./parseFile2Grouped";
import { findSimilar } from "./similarity";
import type { ImportReport } from "../types";

export interface NormalizedCounts {
  // General
  unitsCount?: number;
  totalSF?: number;

  // Corridors
  corridorsWallSF?: number;
  corridorsCeilingSF?: number;
  corridorsDoorCount?: number;
  corridorsStorageCount?: number;
  corridorsBaseCount?: number;
  corridorsEntryDoorCount?: number;

  // Stairs
  stairs1Levels?: number;
  stairs2Levels?: number;

  // Amenity
  amenityRecRoomSF?: number;
  amenityLobbySF?: number;

  // Exterior
  exteriorDoorCount?: number;
  parapetLF?: number;
  windowTrimCount?: number;
  woodVerticalsCount?: number;
  balconyRailLF?: number;
  exteriorMiscCount?: number;
  stuccoSF?: number;

  // Garage
  garageWallSF?: number;
  garageTrashRoomCount?: number;
  garageBikeStorageCount?: number;
  garageDoorCount?: number;
  garageColumnCount?: number;

  // Landscape
  gateCount?: number;

  // New fields from detailed takeoff
  fenceLF?: number;
  cmuWallLF?: number;
  cmuWallSF?: number;
  stuccoAccentCount?: number;
  stairwellRails?: number;
}

/**
 * Known key mappings for matching and suggestions
 */
const KNOWN_KEYS: Array<{ label: string; target: keyof NormalizedCounts; section: string }> = [
  // General
  { label: "Units Total", target: "unitsCount", section: "General" },
  { label: "Total SF", target: "totalSF", section: "General" },
  // Corridors
  { label: "Cor. Wall SF", target: "corridorsWallSF", section: "Corridors" },
  { label: "Wall SF", target: "corridorsWallSF", section: "Corridors" },
  { label: "Cor. Lid SF", target: "corridorsCeilingSF", section: "Corridors" },
  { label: "Ceiling SF", target: "corridorsCeilingSF", section: "Corridors" },
  { label: "Cor. Ceiling SF", target: "corridorsCeilingSF", section: "Corridors" },
  { label: "Cor. Doors", target: "corridorsDoorCount", section: "Corridors" },
  { label: "Cor. Door Count", target: "corridorsDoorCount", section: "Corridors" },
  { label: "Doors", target: "corridorsDoorCount", section: "Corridors" },
  { label: "Storage", target: "corridorsStorageCount", section: "Corridors" },
  { label: "Storage Count", target: "corridorsStorageCount", section: "Corridors" },
  { label: "Base", target: "corridorsBaseCount", section: "Corridors" },
  { label: "Entry Doors", target: "corridorsEntryDoorCount", section: "Corridors" },
  { label: "Entry Door", target: "corridorsEntryDoorCount", section: "Corridors" },
  // Stairs
  { label: "Stair 1 lvls", target: "stairs1Levels", section: "Stairs" },
  { label: "Stair 1", target: "stairs1Levels", section: "Stairs" },
  { label: "Stairs 1", target: "stairs1Levels", section: "Stairs" },
  { label: "Stair 2 lvls", target: "stairs2Levels", section: "Stairs" },
  { label: "Stair 2", target: "stairs2Levels", section: "Stairs" },
  { label: "Stairs 2", target: "stairs2Levels", section: "Stairs" },
  // Amenity
  { label: "Rec Room", target: "amenityRecRoomSF", section: "Amenity" },
  { label: "Rec Room SF", target: "amenityRecRoomSF", section: "Amenity" },
  { label: "Lobby", target: "amenityLobbySF", section: "Amenity" },
  { label: "Lobby SF", target: "amenityLobbySF", section: "Amenity" },
  // Exterior
  { label: "Ext. Door Count", target: "exteriorDoorCount", section: "Exterior" },
  { label: "Door", target: "exteriorDoorCount", section: "Exterior" },
  { label: "Doors", target: "exteriorDoorCount", section: "Exterior" },
  { label: "Parapet LF", target: "parapetLF", section: "Exterior" },
  { label: "Parapet", target: "parapetLF", section: "Exterior" },
  { label: "Window Trim", target: "windowTrimCount", section: "Exterior" },
  { label: "Window/Door Trim Count", target: "windowTrimCount", section: "Exterior" },
  { label: "Trim Count", target: "windowTrimCount", section: "Exterior" },
  { label: "Wood Verticals", target: "woodVerticalsCount", section: "Exterior" },
  { label: "Window Wood Verticals Count", target: "woodVerticalsCount", section: "Exterior" },
  { label: "Balc Rail", target: "balconyRailLF", section: "Exterior" },
  { label: "Balc. Rail LF", target: "balconyRailLF", section: "Exterior" },
  { label: "Balcony Rail", target: "balconyRailLF", section: "Exterior" },
  { label: "Misc", target: "exteriorMiscCount", section: "Exterior" },
  { label: "Stucco SF", target: "stuccoSF", section: "Exterior" },
  { label: "Stucco", target: "stuccoSF", section: "Exterior" },
  // Garage
  { label: "Garage Wall SF", target: "garageWallSF", section: "Garage" },
  { label: "Wall SF", target: "garageWallSF", section: "Garage" },
  { label: "Trash Room", target: "garageTrashRoomCount", section: "Garage" },
  { label: "Garage Trash Room Count", target: "garageTrashRoomCount", section: "Garage" },
  { label: "Trash Rooms", target: "garageTrashRoomCount", section: "Garage" },
  { label: "Bike Storage Room", target: "garageBikeStorageCount", section: "Garage" },
  { label: "Garage Bike Rack Count", target: "garageBikeStorageCount", section: "Garage" },
  { label: "Doors", target: "garageDoorCount", section: "Garage" },
  { label: "Garage Door Count", target: "garageDoorCount", section: "Garage" },
  { label: "Columns", target: "garageColumnCount", section: "Garage" },
  { label: "Garage Column Count", target: "garageColumnCount", section: "Garage" },
  // Landscape
  { label: "Gates", target: "gateCount", section: "Landscape" },
  { label: "Gate", target: "gateCount", section: "Landscape" },
];

/**
 * Find matching known key for a given key string
 */
function findKnownKey(key: string, section?: string): typeof KNOWN_KEYS[0] | null {
  // Try exact match first
  for (const known of KNOWN_KEYS) {
    if (known.label.toLowerCase() === key.toLowerCase()) {
      // If section provided, prefer section match
      if (section && known.section === section) {
        return known;
      }
      // Otherwise return first exact match
      if (!section) {
        return known;
      }
    }
  }

  // Try section-aware exact match
  if (section) {
    for (const known of KNOWN_KEYS) {
      if (
        known.section === section &&
        known.label.toLowerCase() === key.toLowerCase()
      ) {
        return known;
      }
    }
  }

  return null;
}

/**
 * Normalize counts from File 2 parsed sections
 * Returns normalized counts + mapped/unmapped details
 */
export function normalizeCounts(
  parsed: ParsedGroupedCounts
): {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
} {
  const { rows } = parsed;
  const normalized: NormalizedCounts = {};
  const mapped: ImportReport["mapped"] = [];
  const unmapped: ImportReport["unmapped"] = [];

  // Process only KV rows (rows with numeric values)
  const kvRows = rows.filter((row) => row.type === "kv" && row.valueNum !== null && row.valueNum !== undefined);

  for (const row of kvRows) {
    if (!row.key || row.valueNum === null || row.valueNum === undefined) continue;

    const knownKey = findKnownKey(row.key, row.sectionGuess);

    if (knownKey) {
      // MAPPED: We know this key
      normalized[knownKey.target] = row.valueNum;
      mapped.push({
        section: row.sectionGuess || knownKey.section,
        key: row.key,
        valueNum: row.valueNum,
        mappedTo: knownKey.target,
        rowIndex: row.rowIndex,
      });
    } else {
      // UNMAPPED: Unknown key, provide suggestions
      const suggestions = findSimilar(
        row.key,
        KNOWN_KEYS.map((k) => ({ label: k.label, target: k.target })),
        3,
        0.2
      );

      unmapped.push({
        sectionGuess: row.sectionGuess,
        key: row.key,
        valueRaw: row.valueRaw,
        valueNum: row.valueNum,
        rowIndex: row.rowIndex,
        reason: suggestions.length > 0 ? "unrecognized_key" : "ambiguous",
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      });
    }
  }

  console.log("✅ Normalization complete:", {
    normalizedKeys: Object.keys(normalized),
    mappedCount: mapped.length,
    unmappedCount: unmapped.length,
  });

  return {
    counts: normalized,
    mapped,
    unmapped,
  };
}
