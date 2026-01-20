/**
 * PaintBid - Generate Proposal from BidForm
 * Single source of truth: BidForm → Proposal
 */

import type { BidForm, BidFormLine } from "../bidform/types";
import { computeBidFormLine, computeBidFormTotals, formatCurrency } from "../bidform/pricing";

export interface ProposalFromBidForm {
  header: {
    companyName: string;
    license?: string;
    phone?: string;
    email?: string;
  };
  project: BidForm["project"];
  scopeSections: Array<{
    title: string;
    bullets: string[];
  }>;
  pricing: Array<{
    label: string;
    amount: number;
  }>;
  total: number;
  addAlternates: Array<{
    label: string;
    amount: number;
  }>;
  exclusions: string[];
  footerNotes: string[];
}

/**
 * Generate proposal from bid form (single source of truth)
 */
export function generateProposalFromBidForm(
  bidForm: BidForm
): ProposalFromBidForm {
  const totals = computeBidFormTotals(bidForm, true);

  // Build scope sections from included items
  const scopeSections: Array<{ title: string; bullets: string[] }> = [];

  for (const section of bidForm.sections) {
    const includedLines = section.lines.filter(
      (line) => line.included && !line.isAlternate
    );

    if (includedLines.length === 0) continue;

    const bullets = includedLines.map((line) => {
      return `${line.qty} ${line.uom} — ${line.label}`;
    });

    scopeSections.push({
      title: section.name,
      bullets,
    });
  }

  // Build pricing breakdown by section
  const pricing: Array<{ label: string; amount: number }> = [];

  for (const section of bidForm.sections) {
    const sectionTotal = totals.sections[section.name] || 0;
    if (sectionTotal > 0) {
      pricing.push({
        label: section.name,
        amount: sectionTotal,
      });
    }
  }

  // Build add alternates list (included alternates only)
  const addAlternates: Array<{ label: string; amount: number }> = [];

  for (const section of bidForm.sections) {
    for (const line of section.lines) {
      if (line.isAlternate && line.included && line.qty > 0) {
        const pricing = computeBidFormLine(line);
        addAlternates.push({
          label: `${section.name} - ${line.label}`,
          amount: pricing.subtotal,
        });
      }
    }
  }

  return {
    header: {
      companyName: "R.C. Wendt Painting, Inc",
      license: "License #12345",
      phone: "(555) 123-4567",
      email: "info@rcwendtpainting.com",
    },
    project: bidForm.project,
    scopeSections,
    pricing,
    total: totals.total,
    addAlternates,
    exclusions: bidForm.exclusions,
    footerNotes: [
      "All work to be completed in accordance with industry standards.",
      "Payment terms: 50% deposit, 50% upon completion.",
      "Proposal valid for 30 days from date of issue.",
    ],
  };
}
