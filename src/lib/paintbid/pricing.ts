/**
 * PaintBid POC - Pricing Logic
 * Deterministic pricing calculations for line items and totals
 */

import type {
  LineItem,
  EstimateSettings,
  LinePriceBreakdown,
  TotalsBreakdown,
  Complexity,
} from './types';

/**
 * Complexity multiplier table
 */
const COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
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
  highAccess: 0.10,
  occupied: 0.07,
  heavyMasking: 0.12,
  badSubstrate: 0.15,
  rush: 0.12,
};

/**
 * Maximum combined multiplier (capped at 1.80 unless override)
 */
const MAX_MULTIPLIER = 1.80;

/**
 * Compute pricing breakdown for a single line item
 */
export function computeLine(lineItem: LineItem): LinePriceBreakdown {
  const base = lineItem.qty * lineItem.baseUnitPrice;
  const complexityMult = COMPLEXITY_MULTIPLIERS[lineItem.complexity] || 1.0;

  // Sum all active toggle additions
  let toggleAdds = 0;
  if (lineItem.toggles.highAccess) toggleAdds += TOGGLE_MULTIPLIERS.highAccess;
  if (lineItem.toggles.occupied) toggleAdds += TOGGLE_MULTIPLIERS.occupied;
  if (lineItem.toggles.heavyMasking) toggleAdds += TOGGLE_MULTIPLIERS.heavyMasking;
  if (lineItem.toggles.badSubstrate) toggleAdds += TOGGLE_MULTIPLIERS.badSubstrate;
  if (lineItem.toggles.rush) toggleAdds += TOGGLE_MULTIPLIERS.rush;

  // Combined multiplier: complexity * (1 + toggleAdds)
  let multiplier = complexityMult * (1 + toggleAdds);

  // Cap at MAX_MULTIPLIER
  if (multiplier > MAX_MULTIPLIER) {
    multiplier = MAX_MULTIPLIER;
  }

  const subtotal = base * multiplier;

  return {
    base,
    complexityMult,
    toggleAdds,
    multiplier,
    subtotal,
  };
}

/**
 * Compute total breakdown for all line items
 * @param lineItems - All line items (filters to includedInProposal internally for proposal total)
 * @param estimateSettings - Overhead, profit, contingency, tax percentages
 * @param includedOnly - If true, only sum items where includedInProposal is true
 */
export function computeTotals(
  lineItems: LineItem[],
  estimateSettings: EstimateSettings,
  includedOnly = false
): TotalsBreakdown {
  const itemsToSum = includedOnly
    ? lineItems.filter((item) => item.includedInProposal)
    : lineItems;

  // Sum all line subtotals
  const baseSubtotal = itemsToSum.reduce((sum, item) => {
    return sum + computeLine(item).subtotal;
  }, 0);

  // Apply percentages
  const contingency = baseSubtotal * estimateSettings.contingencyPct;
  const afterContingency = baseSubtotal + contingency;

  const overhead = afterContingency * estimateSettings.overheadPct;
  const afterOverhead = afterContingency + overhead;

  const profit = afterOverhead * estimateSettings.profitPct;
  const afterProfit = afterOverhead + profit;

  const tax = estimateSettings.taxPct
    ? afterProfit * estimateSettings.taxPct
    : 0;

  const total = afterProfit + tax;

  return {
    baseSubtotal,
    contingency,
    overhead,
    profit,
    tax,
    total,
    itemCount: itemsToSum.length,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`;
}
