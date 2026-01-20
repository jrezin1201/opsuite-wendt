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
}

/**
 * Known key mappings for suggestions
 */
const KNOWN_KEYS: Array<{ label: string; target: string; section: string }> = [
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
  { label: "Trim Count", target: "windowTrimCount", section: "Exterior" },
  { label: "Wood Verticals", target: "woodVerticalsCount", section: "Exterior" },
  { label: "Balc Rail", target: "balconyRailLF", section: "Exterior" },
  { label: "Balcony Rail", target: "balconyRailLF", section: "Exterior" },
  { label: "Misc", target: "exteriorMiscCount", section: "Exterior" },
  { label: "Stucco SF", target: "stuccoSF", section: "Exterior" },
  { label: "Stucco", target: "stuccoSF", section: "Exterior" },
  // Garage
  { label: "Garage Wall SF", target: "garageWallSF", section: "Garage" },
  { label: "Wall SF", target: "garageWallSF", section: "Garage" },
  { label: "Trash Room", target: "garageTrashRoomCount", section: "Garage" },
  { label: "Trash Rooms", target: "garageTrashRoomCount", section: "Garage" },
  { label: "Bike Storage Room", target: "garageBikeStorageCount", section: "Garage" },
  { label: "Doors", target: "garageDoorCount", section: "Garage" },
  { label: "Columns", target: "garageColumnCount", section: "Garage" },
  // Landscape
  { label: "Gates", target: "gateCount", section: "Landscape" },
  { label: "Gate", target: "gateCount", section: "Landscape" },
];

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
  const { sections, rows } = parsed;
  const normalized: NormalizedCounts = {};
  const mapped: ImportReport["mapped"] = [];
  const unmapped: ImportReport["unmapped"] = [];

  // General section
  if (sections.General) {
    normalized.unitsCount = getNumber(sections.General, "Units Total");
    normalized.totalSF = getNumber(sections.General, "Total SF");
  }

  // Corridors section
  if (sections.Corridors) {
    normalized.corridorsWallSF = getNumber(
      sections.Corridors,
      "Cor. Wall SF",
      "Wall SF"
    );
    normalized.corridorsCeilingSF = getNumber(
      sections.Corridors,
      "Cor. Lid SF",
      "Ceiling SF",
      "Cor. Ceiling SF"
    );
    normalized.corridorsDoorCount = getNumber(
      sections.Corridors,
      "Cor. Doors",
      "Doors"
    );
    normalized.corridorsStorageCount = getNumber(
      sections.Corridors,
      "Storage",
      "Storage Count"
    );
    normalized.corridorsBaseCount = getNumber(sections.Corridors, "Base");
    normalized.corridorsEntryDoorCount = getNumber(
      sections.Corridors,
      "Entry Doors",
      "Entry Door"
    );
  }

  // Stairs section
  if (sections.Stairs) {
    normalized.stairs1Levels = getNumber(
      sections.Stairs,
      "Stair 1 lvls",
      "Stair 1",
      "Stairs 1"
    );
    normalized.stairs2Levels = getNumber(
      sections.Stairs,
      "Stair 2 lvls",
      "Stair 2",
      "Stairs 2"
    );
  }

  // Amenity section
  if (sections.Amenity) {
    normalized.amenityRecRoomSF = getNumber(
      sections.Amenity,
      "Rec Room",
      "Rec Room SF"
    );
    normalized.amenityLobbySF = getNumber(
      sections.Amenity,
      "Lobby",
      "Lobby SF"
    );
  }

  // Exterior section
  if (sections.Exterior) {
    normalized.exteriorDoorCount = getNumber(
      sections.Exterior,
      "Ext. Door Count",
      "Door",
      "Doors"
    );
    normalized.parapetLF = getNumber(
      sections.Exterior,
      "Parapet LF",
      "Parapet"
    );
    normalized.windowTrimCount = getNumber(
      sections.Exterior,
      "Window Trim",
      "Trim Count"
    );
    normalized.woodVerticalsCount = getNumber(
      sections.Exterior,
      "Wood Verticals"
    );
    normalized.balconyRailLF = getNumber(
      sections.Exterior,
      "Balc Rail",
      "Balcony Rail"
    );
    normalized.exteriorMiscCount = getNumber(sections.Exterior, "Misc");
    normalized.stuccoSF = getNumber(sections.Exterior, "Stucco SF", "Stucco");
  }

  // Garage section
  if (sections.Garage) {
    normalized.garageWallSF = getNumber(
      sections.Garage,
      "Garage Wall SF",
      "Wall SF"
    );
    normalized.garageTrashRoomCount = getNumber(
      sections.Garage,
      "Trash Room",
      "Trash Rooms"
    );
    normalized.garageBikeStorageCount = getNumber(
      sections.Garage,
      "Bike Storage Room"
    );
    normalized.garageDoorCount = getNumber(sections.Garage, "Doors");
    normalized.garageColumnCount = getNumber(sections.Garage, "Columns");
  }

  // Landscape section
  if (sections.Landscape) {
    normalized.gateCount = getNumber(sections.Landscape, "Gates", "Gate");
  }

  return normalized;
}

/**
 * Helper to get a numeric value from a section, trying multiple key names
 */
function getNumber(
  section: Record<string, number | string>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = section[key];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return num;
      }
    }
  }
  return undefined;
}
