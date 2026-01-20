/**
 * QA Gating - Check if user can proceed to Proposal/Export
 */

import type { AppState } from "./types";

export interface QAGateStatus {
  canProceed: boolean;
  reason?: string;
  hasUnmappedItems: boolean;
  isAcknowledged: boolean;
  unresolvedCount: number;
}

/**
 * Check if QA gate is passed
 * User can proceed if:
 * 1. No import report exists (legacy workflow)
 * 2. No unmapped items
 * 3. QA has been acknowledged (even if items not fully resolved)
 */
export function checkQAGate(
  importReport?: AppState["importReport"],
  qa?: AppState["qa"]
): QAGateStatus {
  // No import report = legacy workflow, allow proceed
  if (!importReport) {
    return {
      canProceed: true,
      hasUnmappedItems: false,
      isAcknowledged: false,
      unresolvedCount: 0,
    };
  }

  const unmappedItems = importReport.unmapped || [];
  const hasUnmappedItems = unmappedItems.length > 0;
  const isAcknowledged = qa?.acknowledgedAt !== undefined;
  const resolvedCount = Object.keys(qa?.resolved || {}).length;
  const unresolvedCount = unmappedItems.length - resolvedCount;

  // No unmapped items = perfect import, allow proceed
  if (!hasUnmappedItems) {
    return {
      canProceed: true,
      hasUnmappedItems: false,
      isAcknowledged,
      unresolvedCount: 0,
    };
  }

  // Has unmapped items but QA acknowledged = allow proceed
  if (isAcknowledged) {
    return {
      canProceed: true,
      hasUnmappedItems: true,
      isAcknowledged: true,
      unresolvedCount,
      reason:
        unresolvedCount > 0
          ? `QA acknowledged with ${unresolvedCount} unresolved item(s)`
          : undefined,
    };
  }

  // Has unmapped items and NOT acknowledged = BLOCK
  return {
    canProceed: false,
    reason: `${unmappedItems.length} unmapped item(s) require QA review`,
    hasUnmappedItems: true,
    isAcknowledged: false,
    unresolvedCount: unmappedItems.length,
  };
}
