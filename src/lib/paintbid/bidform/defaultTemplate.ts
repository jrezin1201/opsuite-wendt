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
      createLine("Corridors", "Doors", 0, "EA", 75, false),
      createLine("Corridors", "Storage", 0, "EA", 50, false),
      createLine("Corridors", "Base", 0, "LF", 2.00, false),
      createLine("Corridors", "Entry Doors", 0, "EA", 100, false),
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
    name: "Stairwells",
    lines: [
      createLine("Stairwells", "Stair 1 Levels", 0, "EA", 350, false),
      createLine("Stairwells", "Stair 2 Levels", 0, "EA", 350, false),
      // Add Alternates
      createLine("Stairwells", "True Prime Coat", 0, "EA", 100, true),
      createLine("Stairwells", "Eggshell Walls", 0, "EA", 75, true),
      createLine("Stairwells", "Smooth Wall", 0, "EA", 125, true),
      createLine("Stairwells", "Mask Hinges", 0, "EA", 50, true),
    ],
  };
}

function createAmenitySection(): BidFormSection {
  return {
    name: "Amenity Areas",
    lines: [
      createLine("Amenity Areas", "Rec Room", 0, "SF", 2.00, false),
      createLine("Amenity Areas", "Lobby", 0, "SF", 2.00, false),
      // Add Alternates
      createLine("Amenity Areas", "True Prime Coat", 0, "SF", 0.50, true),
      createLine("Amenity Areas", "Eggshell Walls", 0, "SF", 0.35, true),
      createLine("Amenity Areas", "Smooth Wall", 0, "SF", 0.75, true),
    ],
  };
}

function createExteriorSection(): BidFormSection {
  return {
    name: "Exterior",
    lines: [
      createLine("Exterior", "Doors", 0, "EA", 150, false),
      createLine("Exterior", "Parapet", 0, "LF", 3.50, false),
      createLine("Exterior", "Window Trim", 0, "EA", 50, false),
      createLine("Exterior", "Wood Verticals", 0, "EA", 75, false),
      createLine("Exterior", "Balcony Rail", 0, "LF", 4.00, false),
      createLine("Exterior", "Misc", 0, "EA", 100, false),
      // Add Alternates
      createLine("Exterior", "Stucco Body", 0, "SF", 1.25, true),
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
      createLine("Garage", "Trash Room", 0, "EA", 200, false),
      createLine("Garage", "Bike Storage Room", 0, "EA", 150, false),
      createLine("Garage", "Doors", 0, "EA", 75, false),
      // Add Alternates
      createLine("Garage", "Garage Walls", 0, "SF", 1.00, true),
      createLine("Garage", "Columns", 0, "EA", 50, true),
    ],
  };
}

function createLandscapeSection(): BidFormSection {
  return {
    name: "Landscape",
    lines: [
      createLine("Landscape", "Gates", 0, "EA", 250, false),
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
    included: !isAlternate, // Main lines included by default, alternates not
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
