/**
 * PaintBid - Apply Counts to Bid Form
 * Maps File 2 normalized counts to bid form quantities
 */

import type { BidForm } from "./types";
import type { NormalizedCounts } from "../excel/normalizeCounts";

/**
 * Apply normalized counts from File 2 to a bid form
 */
export function applyCounts(
  bidForm: BidForm,
  counts: NormalizedCounts
): BidForm {
  // Clone the bid form to avoid mutations
  const updated: BidForm = JSON.parse(JSON.stringify(bidForm));

  for (const section of updated.sections) {
    for (const line of section.lines) {
      const qty = mapCountToLine(section.name, line.label, counts);
      if (qty !== null) {
        line.qty = qty;
      }
    }
  }

  return updated;
}

/**
 * Map a normalized count to a specific line item
 */
function mapCountToLine(
  section: string,
  label: string,
  counts: NormalizedCounts
): number | null {
  // Units section
  if (section === "Units" && label === "Units") {
    return counts.unitsCount ?? null;
  }

  // Corridors section
  if (section === "Corridors") {
    if (label === "Wall SF") return counts.corridorsWallSF ?? null;
    if (label === "Ceiling SF") return counts.corridorsCeilingSF ?? null;
    if (label === "Doors") return counts.corridorsDoorCount ?? null;
    if (label === "Storage") return counts.corridorsStorageCount ?? null;
    if (label === "Base") return counts.corridorsBaseCount ?? null;
    if (label === "Entry Doors") return counts.corridorsEntryDoorCount ?? null;
  }

  // Stairwells section
  if (section === "Stairwells") {
    if (label === "Stair 1 Levels") return counts.stairs1Levels ?? null;
    if (label === "Stair 2 Levels") return counts.stairs2Levels ?? null;
  }

  // Amenity section
  if (section === "Amenity Areas") {
    if (label === "Rec Room") return counts.amenityRecRoomSF ?? null;
    if (label === "Lobby") return counts.amenityLobbySF ?? null;
  }

  // Exterior section
  if (section === "Exterior") {
    if (label === "Doors") return counts.exteriorDoorCount ?? null;
    if (label === "Parapet") return counts.parapetLF ?? null;
    if (label === "Window Trim") return counts.windowTrimCount ?? null;
    if (label === "Wood Verticals") return counts.woodVerticalsCount ?? null;
    if (label === "Balcony Rail") return counts.balconyRailLF ?? null;
    if (label === "Misc") return counts.exteriorMiscCount ?? null;
    if (label === "Stucco Body") return counts.stuccoSF ?? null;
    if (label === "Prime Stucco") return counts.stuccoSF ?? null;
    if (label === "Stucco Accents") return counts.stuccoSF ?? null;
  }

  // Garage section
  if (section === "Garage") {
    if (label === "Trash Room") return counts.garageTrashRoomCount ?? null;
    if (label === "Bike Storage Room") return counts.garageBikeStorageCount ?? null;
    if (label === "Doors") return counts.garageDoorCount ?? null;
    if (label === "Garage Walls") return counts.garageWallSF ?? null;
    if (label === "Columns") return counts.garageColumnCount ?? null;
  }

  // Landscape section
  if (section === "Landscape") {
    if (label === "Gates") return counts.gateCount ?? null;
  }

  return null;
}
