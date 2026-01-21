/**
 * UOM (Unit of Measure) standardization utility
 * Normalizes various unit formats to standard values
 */

export type StandardUOM = "LF" | "SF" | "EA" | "UNKNOWN";

/**
 * Normalize raw UOM string to standard format
 * @param rawUom - Raw UOM string from Excel (e.g., "FT", "LF", "ft/lf", "EA")
 * @returns Standardized UOM or "UNKNOWN"
 */
export function normalizeUom(rawUom: string | null | undefined): StandardUOM {
  if (!rawUom) return "UNKNOWN";

  const uom = rawUom.trim().toUpperCase();

  // Linear feet variations
  if (uom === "FT" || uom === "LF" || uom === "FT/LF" || uom === "LINEAR FT" || uom === "LIN FT") {
    return "LF";
  }

  // Square feet variations
  if (uom === "SF" || uom === "SQFT" || uom === "SQ FT" || uom === "SQ.FT." || uom === "SQUARE FEET") {
    return "SF";
  }

  // Each/Count variations
  if (uom === "EA" || uom === "EACH" || uom === "COUNT" || uom === "CNT" || uom === "PC" || uom === "PCS") {
    return "EA";
  }

  return "UNKNOWN";
}

/**
 * Get display label for UOM
 */
export function getUomLabel(uom: StandardUOM): string {
  switch (uom) {
    case "LF":
      return "Linear Feet";
    case "SF":
      return "Square Feet";
    case "EA":
      return "Each";
    case "UNKNOWN":
      return "Unknown Unit";
  }
}