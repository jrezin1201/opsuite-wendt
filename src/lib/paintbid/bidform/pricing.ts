/**
 * PaintBid - BidForm Pricing Logic
 * Pricing calculations for the new bid form model
 */

import type { BidForm, BidFormLine, Difficulty } from "./types";

export interface BidFormLinePricing {
  base: number;
  difficultyMult: number;
  toggleAdds: number;
  multiplier: number;
  subtotal: number;
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
 * Difficulty multipliers (1-5 scale)
 */
const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  1: 0.90,
  2: 1.00,
  3: 1.10,
  4: 1.25,
  5: 1.45,
};

/**
 * Toggle multiplier additions
 */
const TOGGLE_MULTIPLIERS = {
  tightAccess: 0.10,
  heavyPrep: 0.15,
  occupied: 0.07,
  extraShelving: 0.05,
  large: 0.08,
};

/**
 * Maximum combined multiplier (cap at 1.80)
 */
const MAX_MULTIPLIER = 1.80;

/**
 * Compute pricing for a single bid form line
 */
export function computeBidFormLine(line: BidFormLine): BidFormLinePricing {
  const base = line.qty * line.baseUnitPrice;
  const difficultyMult = DIFFICULTY_MULTIPLIERS[line.difficulty] || 1.0;

  // Sum all active toggle additions
  let toggleAdds = 0;
  if (line.toggles.tightAccess) toggleAdds += TOGGLE_MULTIPLIERS.tightAccess;
  if (line.toggles.heavyPrep) toggleAdds += TOGGLE_MULTIPLIERS.heavyPrep;
  if (line.toggles.occupied) toggleAdds += TOGGLE_MULTIPLIERS.occupied;
  if (line.toggles.extraShelving) toggleAdds += TOGGLE_MULTIPLIERS.extraShelving;
  if (line.toggles.large) toggleAdds += TOGGLE_MULTIPLIERS.large;

  // Combined multiplier: difficulty * (1 + toggleAdds)
  let multiplier = difficultyMult * (1 + toggleAdds);

  // Cap at MAX_MULTIPLIER
  if (multiplier > MAX_MULTIPLIER) {
    multiplier = MAX_MULTIPLIER;
  }

  const subtotal = base * multiplier;

  return {
    base,
    difficultyMult,
    toggleAdds,
    multiplier,
    subtotal,
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
