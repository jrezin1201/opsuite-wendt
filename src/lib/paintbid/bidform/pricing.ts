/**
 * PaintBid - BidForm Pricing Logic
 * Pricing calculations for the new bid form model
 * Updated to use professional difficulty-based pricing
 */

import type { BidForm, BidFormLine, Difficulty } from "./types";
import { calculateDifficultyPrice, DIFFICULTY_PRICING } from "../pricing/difficultyPricing";

export interface BidFormLinePricing {
  base: number;
  difficultyMult: number;
  toggleAdds: number;
  multiplier: number;
  subtotal: number;
  pricePerUnit?: number;
  incrementPerLevel?: number;
}

export interface BidFormTotals {
  baseSubtotal: number;
  contingency: number;
  overhead: number;
  profit: number;
  total: number;
  itemCount: number;
  sections: Record<string, number>; // section totals
}

/**
 * Toggle multiplier additions (applied after difficulty pricing)
 */
const TOGGLE_MULTIPLIERS = {
  tightAccess: 0.10,
  heavyPrep: 0.15,
  occupied: 0.07,
  extraShelving: 0.05,
  large: 0.08,
};

/**
 * Maximum combined multiplier for toggles (cap at 1.50)
 */
const MAX_TOGGLE_MULTIPLIER = 1.50;

/**
 * Map line item labels to pricing keys
 */
function getItemPricingKey(label: string, section: string): string {
  const lowerLabel = label.toLowerCase();
  const lowerSection = section.toLowerCase();

  // Unit Interior items
  if (lowerSection.includes("unit") || lowerSection.includes("interior")) {
    if (lowerLabel.includes("unit")) return "units";
    if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "units_prime_coat";
    if (lowerLabel.includes("eggshell")) return "units_eggshell_walls";
    if (lowerLabel.includes("two") && lowerLabel.includes("tone")) return "units_two_tone";
    if (lowerLabel.includes("base") && lowerLabel.includes("floor")) return "units_base_over_floor";
    if (lowerLabel.includes("cased") && lowerLabel.includes("window")) return "units_cased_windows";
    if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "units_smooth_wall";
    if (lowerLabel.includes("mask") && lowerLabel.includes("hinge")) return "units_mask_hinges";
  }

  // Corridor items
  if (lowerSection.includes("corridor")) {
    if (lowerLabel.includes("wall") && lowerLabel.includes("sf")) return "corridor_wall_sf";
    if (lowerLabel.includes("ceiling") && lowerLabel.includes("sf")) return "corridor_ceiling_sf";
    if (lowerLabel.includes("entry") && lowerLabel.includes("door")) return "corridor_entry_doors";
    if (lowerLabel.includes("door") && !lowerLabel.includes("entry")) return "corridor_doors";
    if (lowerLabel.includes("frame")) return "corridor_frames";
    if (lowerLabel.includes("base")) return "corridor_base";
    if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "corridor_prime_coat";
    if (lowerLabel.includes("eggshell")) return "corridor_eggshell_walls";
    if (lowerLabel.includes("two") && lowerLabel.includes("tone")) return "corridor_two_tone";
    if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "corridor_smooth_wall";
  }

  // Stairwell items
  if (lowerSection.includes("stair")) {
    if (lowerLabel.includes("rail")) return "stairwell_rails";
    if (lowerLabel.includes("wall")) return "stairwell_walls";
    if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "stairwell_prime_coat";
    if (lowerLabel.includes("eggshell")) return "stairwell_eggshell_walls";
    if (lowerLabel.includes("two") && lowerLabel.includes("tone")) return "stairwell_two_tone";
    if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "stairwell_smooth_wall";
  }

  // Amenity items
  if (lowerSection.includes("amenity")) {
    if (lowerLabel.includes("room") || lowerLabel.includes("sf")) return "amenity_room_sf";
  }

  // Exterior items
  if (lowerSection.includes("exterior")) {
    if (lowerLabel.includes("door") && !lowerLabel.includes("balc")) return "exterior_door";
    if (lowerLabel.includes("parapet")) return "exterior_parapet";
    if (lowerLabel.includes("window") && lowerLabel.includes("trim")) return "exterior_window_trim";
    if (lowerLabel.includes("window") && lowerLabel.includes("vertical")) return "exterior_window_wood_verticals";
    if (lowerLabel.includes("balc") && lowerLabel.includes("rail")) return "exterior_balc_rail";
    if (lowerLabel.includes("misc")) return "exterior_misc";
    if (lowerLabel.includes("stucco") && lowerLabel.includes("body")) return "exterior_stucco_body";
    if (lowerLabel.includes("prime") && lowerLabel.includes("stucco") && !lowerLabel.includes("accent")) return "exterior_prime_stucco";
    if (lowerLabel.includes("stucco") && lowerLabel.includes("accent")) return "exterior_stucco_accents_balcs";
    if (lowerLabel.includes("prime") && lowerLabel.includes("accent")) return "exterior_prime_stucco_accents";
    if (lowerLabel.includes("balc") && lowerLabel.includes("door")) return "exterior_balc_doors";
  }

  // Garage items
  if (lowerSection.includes("garage")) {
    if (lowerLabel.includes("trash")) return "garage_trash_room";
    if (lowerLabel.includes("door")) return "garage_doors";
    if (lowerLabel.includes("bike")) return "garage_bike_storage";
    if (lowerLabel.includes("wall")) return "garage_walls";
    if (lowerLabel.includes("column")) return "garage_columns";
  }

  // Landscape items
  if (lowerSection.includes("landscape")) {
    if (lowerLabel.includes("gate")) return "landscape_gates";
  }

  // Default: return a generic key based on label
  return lowerLabel.replace(/\s+/g, "_");
}

/**
 * Compute pricing for a single bid form line using professional pricing
 */
export function computeBidFormLine(line: BidFormLine): BidFormLinePricing {
  // Get the pricing key for this item
  const itemKey = getItemPricingKey(line.label, line.section);
  const pricing = DIFFICULTY_PRICING[itemKey];

  let subtotal: number;
  let pricePerUnit: number;

  if (pricing) {
    // Use professional difficulty-based pricing
    const unitsDifficulty = line.section.toLowerCase().includes("unit") ? line.difficulty : undefined;
    subtotal = calculateDifficultyPrice(itemKey, line.qty, line.difficulty, unitsDifficulty);
    pricePerUnit = pricing.basePrice + (pricing.incrementPerLevel * (line.difficulty - 1));
  } else {
    // Fallback to old calculation if no pricing config found
    pricePerUnit = line.baseUnitPrice;
    const base = line.qty * line.baseUnitPrice;

    // Apply difficulty as a simple multiplier for unknown items
    const difficultyMultipliers: Record<Difficulty, number> = {
      1: 1.00,
      2: 1.10,
      3: 1.20,
      4: 1.30,
      5: 1.50,
    };
    const diffMult = difficultyMultipliers[line.difficulty] || 1.0;
    subtotal = base * diffMult;
  }

  // Apply toggle multipliers on top of difficulty pricing
  let toggleMultiplier = 1.0;
  if (line.toggles.tightAccess) toggleMultiplier += TOGGLE_MULTIPLIERS.tightAccess;
  if (line.toggles.heavyPrep) toggleMultiplier += TOGGLE_MULTIPLIERS.heavyPrep;
  if (line.toggles.occupied) toggleMultiplier += TOGGLE_MULTIPLIERS.occupied;
  if (line.toggles.extraShelving) toggleMultiplier += TOGGLE_MULTIPLIERS.extraShelving;
  if (line.toggles.large) toggleMultiplier += TOGGLE_MULTIPLIERS.large;

  // Cap toggle multiplier
  if (toggleMultiplier > MAX_TOGGLE_MULTIPLIER) {
    toggleMultiplier = MAX_TOGGLE_MULTIPLIER;
  }

  // Apply toggle multiplier to subtotal
  const finalSubtotal = subtotal * toggleMultiplier;

  return {
    base: line.qty * (pricing?.basePrice || line.baseUnitPrice),
    difficultyMult: line.difficulty,
    toggleAdds: toggleMultiplier - 1.0,
    multiplier: toggleMultiplier,
    subtotal: finalSubtotal,
    pricePerUnit,
    incrementPerLevel: pricing?.incrementPerLevel,
  };
}

/**
 * Compute totals for entire bid form
 */
export function computeBidFormTotals(
  bidForm: BidForm,
  includedOnly = false
): BidFormTotals {
  let baseSubtotal = 0;
  let itemCount = 0;
  const sectionTotals: Record<string, number> = {};

  // Sum all lines by section
  for (const section of bidForm.sections) {
    let sectionTotal = 0;

    for (const line of section.lines) {
      if (includedOnly && !line.included) continue;

      const pricing = computeBidFormLine(line);
      sectionTotal += pricing.subtotal;
      itemCount++;
    }

    sectionTotals[section.name] = sectionTotal;
    baseSubtotal += sectionTotal;
  }

  // Apply global settings
  const contingency = baseSubtotal * bidForm.settings.contingencyPct;
  const afterContingency = baseSubtotal + contingency;

  const overhead = afterContingency * bidForm.settings.overheadPct;
  const afterOverhead = afterContingency + overhead;

  const profit = afterOverhead * bidForm.settings.profitPct;
  const total = afterOverhead + profit;

  return {
    baseSubtotal,
    contingency,
    overhead,
    profit,
    total,
    itemCount,
    sections: sectionTotals,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`;
}
