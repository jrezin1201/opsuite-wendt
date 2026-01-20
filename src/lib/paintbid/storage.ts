/**
 * PaintBid POC - LocalStorage Persistence
 * Safe read/write to browser localStorage with validation
 */

import type { AppState } from './types';

const STORAGE_KEY = 'paintbid_poc_v1';

/**
 * Get default state
 */
export function getDefaultState(): AppState {
  return {
    pricebook: [],
    mappings: {},
    takeoffRows: [],
    lineItems: [],
    estimateSettings: {
      overheadPct: 0.10,
      profitPct: 0.20,
      contingencyPct: 0.05,
      taxPct: 0,
    },
    proposalSettings: {
      title: 'Painting Proposal',
      customerName: '',
      address: '',
      introText:
        'Thank you for the opportunity to submit this proposal for your painting project.',
      exclusionsText:
        'This proposal does not include repairs to drywall, structural work, or furniture moving.',
      termsText: 'Payment terms: 50% deposit, 50% upon completion.',
    },
    lastSavedAt: Date.now(),
    importReport: undefined,
    qa: {
      resolved: {},
    },
    proposalFinals: [],
    activeFinalId: undefined,
  };
}

/**
 * Load state from localStorage
 */
export function loadState(): AppState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null;
    }

    const parsed = JSON.parse(json);

    // Basic validation
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    // Ensure required arrays exist
    if (!Array.isArray(parsed.pricebook)) parsed.pricebook = [];
    if (!Array.isArray(parsed.takeoffRows)) parsed.takeoffRows = [];
    if (!Array.isArray(parsed.lineItems)) parsed.lineItems = [];
    if (!Array.isArray(parsed.proposalFinals)) parsed.proposalFinals = [];
    if (!parsed.mappings || typeof parsed.mappings !== 'object') {
      parsed.mappings = {};
    }
    if (!parsed.estimateSettings || typeof parsed.estimateSettings !== 'object') {
      parsed.estimateSettings = getDefaultState().estimateSettings;
    }
    if (!parsed.proposalSettings || typeof parsed.proposalSettings !== 'object') {
      parsed.proposalSettings = getDefaultState().proposalSettings;
    }
    if (!parsed.qa || typeof parsed.qa !== 'object') {
      parsed.qa = { resolved: {} };
    }

    return parsed as AppState;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 */
export function saveState(state: AppState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const json = JSON.stringify({
      ...state,
      lastSavedAt: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * Reset state (clear localStorage)
 */
export function resetState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset state:', error);
  }
}

/**
 * Export state as JSON string
 */
export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Import state from JSON string
 * Returns parsed state or throws error
 */
export function importState(json: string): AppState {
  try {
    const parsed = JSON.parse(json);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    // Ensure arrays
    if (!Array.isArray(parsed.pricebook)) {
      throw new Error('Invalid pricebook data');
    }
    if (!Array.isArray(parsed.lineItems)) {
      throw new Error('Invalid lineItems data');
    }

    // Apply defaults for missing fields
    const defaultState = getDefaultState();
    return {
      pricebook: parsed.pricebook || [],
      mappings: parsed.mappings || {},
      takeoffRows: parsed.takeoffRows || [],
      lineItems: parsed.lineItems || [],
      estimateSettings: parsed.estimateSettings || defaultState.estimateSettings,
      proposalSettings: parsed.proposalSettings || defaultState.proposalSettings,
      lastSavedAt: Date.now(),
      importReport: parsed.importReport,
      qa: parsed.qa || { resolved: {} },
      proposalFinals: parsed.proposalFinals || [],
      activeFinalId: parsed.activeFinalId,
    };
  } catch (error) {
    throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
