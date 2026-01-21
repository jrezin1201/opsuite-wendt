/**
 * PaintBid - Default Bid Form Template
 * Pre-populated template matching File 3 structure
 */

import type { BidForm, BidFormLine, BidFormSection } from "./types";

/**
 * Create a new bid form with all standard lines pre-populated
 */
export function createDefaultBidForm(): BidForm {
  return {
    id: crypto.randomUUID(),
    project: {
      developer: "",
      projectName: "",
      address: "",
      city: "",
      contact: "",
      phone: "",
      email: "",
      date: new Date().toISOString().split("T")[0],
    },
    sections: [
      createGeneralSection(),
      createUnitsSection(),
      createCorridorsSection(),
      createStairwellsSection(),
      createAmenitySection(),
      createExteriorSection(),
      createGarageSection(),
      createLandscapeSection(),
    ],
    exclusions: getDefaultExclusions(),
    settings: {
      overheadPct: 0.10,
      profitPct: 0.20,
      contingencyPct: 0.05,
    },
  };
}

function createGeneralSection(): BidFormSection {
  return {
    name: "General",
    lines: [
      createLine("General", "Units Count", 0, "EA", 1400, false),
      createLine("General", "Total SF", 0, "SF", 0, false),
      // Add Alternates for Units
      createLine("General", "True Prime Coat", 0, "EA", 300, true),
      createLine("General", "Eggshell Walls", 0, "EA", 200, true),
      createLine("General", "Two Tone", 0, "EA", 150, true),
      createLine("General", "Base over Floor", 0, "EA", 50, true),
      createLine("General", "Cased Windows", 0, "EA", 75, true),
      createLine("General", "Smooth Wall", 0, "EA", 250, true),
      createLine("General", "Mask Hinges", 0, "EA", 25, true),
    ],
  };
}

function createUnitsSection(): BidFormSection {
  return {
    name: "Units",
    lines: [
      createLine("Units", "Units", 0, "EA", 1400, false),
      // Add Alternates for Units
      createLine("Units", "True Prime Coat", 0, "EA", 300, true),
      createLine("Units", "Eggshell Walls", 0, "EA", 200, true),
      createLine("Units", "Two Tone", 0, "EA", 150, true),
      createLine("Units", "Base over Floor", 0, "EA", 50, true),
      createLine("Units", "Cased Windows", 0, "EA", 75, true),
      createLine("Units", "Smooth Wall", 0, "EA", 250, true),
      createLine("Units", "Mask Hinges", 0, "EA", 25, true),
    ],
  };
}

function createCorridorsSection(): BidFormSection {
  return {
    name: "Corridors",
    lines: [
      createLine("Corridors", "Wall SF", 0, "SF", 1.50, false),
      createLine("Corridors", "Ceiling SF", 0, "SF", 1.75, false),
      createLine("Corridors", "Door Count", 0, "EA", 75, false),
      createLine("Corridors", "Storage Count", 0, "EA", 50, false),
      createLine("Corridors", "Base Count", 0, "LF", 2.00, false),
      createLine("Corridors", "Entry Door Count", 0, "EA", 100, false),
      // Add Alternates
      createLine("Corridors", "True Prime Coat", 0, "SF", 0.50, true),
      createLine("Corridors", "Eggshell Walls", 0, "SF", 0.35, true),
      createLine("Corridors", "Smooth Wall", 0, "SF", 0.75, true),
      createLine("Corridors", "Mask Hinges", 0, "EA", 25, true),
    ],
  };
}

function createStairwellsSection(): BidFormSection {
  return {
    name: "Stairs",
    lines: [
      createLine("Stairs", "Stair 1 Levels", 0, "LVL", 350, false),
      createLine("Stairs", "Stair 2 Levels", 0, "LVL", 350, false),
      // Add Alternates
      createLine("Stairs", "True Prime Coat", 0, "EA", 100, true),
      createLine("Stairs", "Eggshell Walls", 0, "EA", 75, true),
      createLine("Stairs", "Smooth Wall", 0, "EA", 125, true),
      createLine("Stairs", "Mask Hinges", 0, "EA", 50, true),
    ],
  };
}

function createAmenitySection(): BidFormSection {
  return {
    name: "Amenity",
    lines: [
      createLine("Amenity", "Rec Room SF", 0, "SF", 2.00, false),
      createLine("Amenity", "Lobby SF", 0, "SF", 2.00, false),
      // Add Alternates
      createLine("Amenity", "True Prime Coat", 0, "SF", 0.50, true),
      createLine("Amenity", "Eggshell Walls", 0, "SF", 0.35, true),
      createLine("Amenity", "Smooth Wall", 0, "SF", 0.75, true),
    ],
  };
}

function createExteriorSection(): BidFormSection {
  return {
    name: "Exterior",
    lines: [
      createLine("Exterior", "Exterior Door Count", 0, "EA", 150, false),
      createLine("Exterior", "Parapet LF", 0, "LF", 3.50, false),
      createLine("Exterior", "Window/Door Trim Count", 0, "EA", 50, false),
      createLine("Exterior", "Window Wood Verticals Count", 0, "EA", 75, false),
      createLine("Exterior", "Balcony Rail LF", 0, "LF", 4.00, false),
      createLine("Exterior", "Balcony Rail Count", 0, "EA", 100, false),
      createLine("Exterior", "Misc Count", 0, "EA", 100, false),
      // Add Alternates
      createLine("Exterior", "Stucco Body SF", 0, "SF", 1.25, true),
      createLine("Exterior", "Prime Stucco", 0, "SF", 0.75, true),
      createLine("Exterior", "Stucco Accents", 0, "SF", 1.50, true),
      createLine("Exterior", "Prime Accents", 0, "SF", 0.85, true),
      createLine("Exterior", "Balcony Doors", 0, "EA", 100, true),
    ],
  };
}

function createGarageSection(): BidFormSection {
  return {
    name: "Garage",
    lines: [
      createLine("Garage", "Wall SF", 0, "SF", 1.00, false),
      createLine("Garage", "Ceiling SF", 0, "SF", 1.25, false),
      createLine("Garage", "Storage SF", 0, "SF", 1.00, false),
      createLine("Garage", "Trash Room SF", 0, "SF", 1.50, false),
      createLine("Garage", "Trash Room Count", 0, "EA", 200, false),
      createLine("Garage", "Bike Storage Count", 0, "EA", 150, false),
      createLine("Garage", "Bike Rack Count", 0, "EA", 100, false),
      createLine("Garage", "Bike Parking Count", 0, "EA", 75, false),
      createLine("Garage", "Door Count", 0, "EA", 75, false),
      createLine("Garage", "Column Count", 0, "EA", 50, false),
      // Add Alternates
      createLine("Garage", "Prime Walls", 0, "SF", 0.50, true),
    ],
  };
}

function createLandscapeSection(): BidFormSection {
  return {
    name: "Landscape",
    lines: [
      createLine("Landscape", "Gate Count", 0, "EA", 250, false),
    ],
  };
}

/**
 * Helper to create a bid form line
 */
function createLine(
  section: string,
  label: string,
  qty: number,
  uom: string,
  baseUnitPrice: number,
  isAlternate: boolean
): BidFormLine {
  return {
    id: crypto.randomUUID(),
    section,
    label,
    qty,
    uom,
    baseUnitPrice,
    difficulty: 2, // Default to standard difficulty
    toggles: {},
    included: true, // ALL items included by default (both main lines and alternates)
    isAlternate,
  };
}

/**
 * Default exclusions matching File 3/4
 */
function getDefaultExclusions(): string[] {
  return [
    "Scaffolding or lifts",
    "Performance and payment bonds",
    "Weekend or night work",
    "Structural repairs",
    "Drywall repairs beyond minor patches",
    "Furniture moving or protection",
    "Permits and fees",
    "Change orders",
  ];
}
