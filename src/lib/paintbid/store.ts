/**
 * PaintBid POC - Zustand Store
 * Central state management with automatic localStorage persistence
 */

import { create } from 'zustand';
import type {
  AppState,
  PricebookItem,
  TakeoffRow,
  LineItem,
  EstimateSettings,
  ProposalSettings,
  Complexity,
  LineItemToggles,
} from './types';
import type { BidForm, BidFormLine, Difficulty, BidFormToggles } from './bidform/types';
import type { ParsedGroupedCounts } from './excel/parseFile2Grouped';
import type { NormalizedCounts } from './excel/normalizeCounts';
import { loadState, saveState, getDefaultState, resetState as resetStorage } from './storage';
import { normalizeName } from './normalize';
import { createDefaultBidForm } from './bidform/defaultTemplate';
import { applyCounts } from './bidform/applyCounts';

interface PaintBidStore extends AppState {
  // Initialization
  initialized: boolean;
  initialize: () => void;

  // BidForm state (new workflow)
  bidForm: BidForm | null;
  parsedFile2: ParsedGroupedCounts | null;
  normalizedCounts: NormalizedCounts | null;

  // Pricebook actions
  addPricebookItem: (item: Omit<PricebookItem, 'id'>) => void;
  updatePricebookItem: (id: string, updates: Partial<PricebookItem>) => void;
  deletePricebookItem: (id: string) => void;
  setPricebook: (items: PricebookItem[]) => void;

  // Takeoff actions
  importTakeoff: (rows: TakeoffRow[]) => void;
  clearTakeoff: () => void;

  // Mapping actions
  setMapping: (normalizedName: string, pricebookItemId: string) => void;
  clearMappings: () => void;

  // Line item actions
  updateLineItem: (id: string, updates: Partial<LineItem>) => void;
  setLineItemComplexity: (id: string, complexity: Complexity) => void;
  setLineItemToggles: (id: string, toggles: Partial<LineItemToggles>) => void;
  setLineItemIncluded: (id: string, included: boolean) => void;
  bulkSetComplexity: (ids: string[], complexity: Complexity) => void;
  deleteLineItem: (id: string) => void;

  // Settings actions
  updateEstimateSettings: (updates: Partial<EstimateSettings>) => void;
  updateProposalSettings: (updates: Partial<ProposalSettings>) => void;

  // Utility actions
  reset: () => void;
  importData: (state: AppState) => void;

  // BidForm actions (new workflow)
  createNewBidForm: () => void;
  importFile2: (parsed: ParsedGroupedCounts, normalized: NormalizedCounts) => void;
  updateBidFormLine: (lineId: string, updates: Partial<BidFormLine>) => void;
  setBidFormLineDifficulty: (lineId: string, difficulty: Difficulty) => void;
  setBidFormLineToggles: (lineId: string, toggles: Partial<BidFormToggles>) => void;
  setBidFormLineIncluded: (lineId: string, included: boolean) => void;
  updateBidFormProject: (updates: Partial<BidForm['project']>) => void;
  updateBidFormSettings: (updates: Partial<BidForm['settings']>) => void;
  updateBidFormExclusions: (exclusions: string[]) => void;
}

// Debounce helper
let saveTimeout: NodeJS.Timeout | null = null;
function debouncedSave(state: AppState) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveState(state);
  }, 300);
}

export const usePaintBidStore = create<PaintBidStore>((set, get) => ({
  ...getDefaultState(),
  initialized: false,
  bidForm: null,
  parsedFile2: null,
  normalizedCounts: null,

  // Initialize store from localStorage
  initialize: () => {
    const loaded = loadState();
    if (loaded) {
      set({ ...loaded, initialized: true });
    } else {
      set({ initialized: true });
    }
  },

  // Pricebook actions
  addPricebookItem: (item) => {
    const newItem: PricebookItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    set((state) => {
      const newState = {
        ...state,
        pricebook: [...state.pricebook, newItem],
      };
      debouncedSave(newState);
      return newState;
    });
  },

  updatePricebookItem: (id, updates) => {
    set((state) => {
      const newState = {
        ...state,
        pricebook: state.pricebook.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  deletePricebookItem: (id) => {
    set((state) => {
      const newState = {
        ...state,
        pricebook: state.pricebook.filter((item) => item.id !== id),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  setPricebook: (items) => {
    set((state) => {
      const newState = { ...state, pricebook: items };
      debouncedSave(newState);
      return newState;
    });
  },

  // Takeoff actions
  importTakeoff: (rows) => {
    const state = get();
    const { pricebook, mappings } = state;

    // Convert takeoff rows to line items
    const newLineItems: LineItem[] = rows.map((row) => {
      const normalized = normalizeName(row.rawName);
      const mappedPricebookItemId = mappings[normalized];
      const pricebookItem = pricebook.find((p) => p.id === mappedPricebookItemId);

      return {
        id: crypto.randomUUID(),
        takeoffRowId: row.id,
        pricebookItemId: mappedPricebookItemId,
        nameOverride: row.rawName,
        qty: row.qty,
        unit: row.unit || pricebookItem?.unit || 'each',
        baseUnitPrice: pricebookItem?.baseUnitPrice || 0,
        complexity: pricebookItem?.defaultComplexity || 2,
        toggles: {},
        notes: row.notes,
        includedInProposal: true,
        group: row.area,
      };
    });

    set((state) => {
      const newState = {
        ...state,
        takeoffRows: rows,
        lineItems: newLineItems,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  clearTakeoff: () => {
    set((state) => {
      const newState = {
        ...state,
        takeoffRows: [],
        lineItems: [],
      };
      debouncedSave(newState);
      return newState;
    });
  },

  // Mapping actions
  setMapping: (normalizedName, pricebookItemId) => {
    set((state) => {
      const newState = {
        ...state,
        mappings: {
          ...state.mappings,
          [normalizedName]: pricebookItemId,
        },
      };
      debouncedSave(newState);
      return newState;
    });
  },

  clearMappings: () => {
    set((state) => {
      const newState = { ...state, mappings: {} };
      debouncedSave(newState);
      return newState;
    });
  },

  // Line item actions
  updateLineItem: (id, updates) => {
    set((state) => {
      const newState = {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  setLineItemComplexity: (id, complexity) => {
    get().updateLineItem(id, { complexity });
  },

  setLineItemToggles: (id, toggles) => {
    set((state) => {
      const newState = {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === id
            ? { ...item, toggles: { ...item.toggles, ...toggles } }
            : item
        ),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  setLineItemIncluded: (id, included) => {
    get().updateLineItem(id, { includedInProposal: included });
  },

  bulkSetComplexity: (ids, complexity) => {
    set((state) => {
      const newState = {
        ...state,
        lineItems: state.lineItems.map((item) =>
          ids.includes(item.id) ? { ...item, complexity } : item
        ),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  deleteLineItem: (id) => {
    set((state) => {
      const newState = {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== id),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  // Settings actions
  updateEstimateSettings: (updates) => {
    set((state) => {
      const newState = {
        ...state,
        estimateSettings: { ...state.estimateSettings, ...updates },
      };
      debouncedSave(newState);
      return newState;
    });
  },

  updateProposalSettings: (updates) => {
    set((state) => {
      const newState = {
        ...state,
        proposalSettings: { ...state.proposalSettings, ...updates },
      };
      debouncedSave(newState);
      return newState;
    });
  },

  // Utility actions
  reset: () => {
    resetStorage();
    set(getDefaultState());
  },

  importData: (newState) => {
    set({ ...newState, initialized: true });
    saveState(newState);
  },

  // BidForm actions (new workflow)
  createNewBidForm: () => {
    const bidForm = createDefaultBidForm();
    set((state) => {
      const newState = { ...state, bidForm };
      debouncedSave(newState);
      return newState;
    });
  },

  importFile2: (parsed, normalized) => {
    const currentBidForm = get().bidForm || createDefaultBidForm();
    const updatedBidForm = applyCounts(currentBidForm, normalized);

    set((state) => {
      const newState = {
        ...state,
        parsedFile2: parsed,
        normalizedCounts: normalized,
        bidForm: updatedBidForm,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  updateBidFormLine: (lineId, updates) => {
    set((state) => {
      if (!state.bidForm) return state;

      const updatedBidForm = { ...state.bidForm };
      updatedBidForm.sections = updatedBidForm.sections.map((section) => ({
        ...section,
        lines: section.lines.map((line) =>
          line.id === lineId ? { ...line, ...updates } : line
        ),
      }));

      const newState = { ...state, bidForm: updatedBidForm };
      debouncedSave(newState);
      return newState;
    });
  },

  setBidFormLineDifficulty: (lineId, difficulty) => {
    get().updateBidFormLine(lineId, { difficulty });
  },

  setBidFormLineToggles: (lineId, toggles) => {
    set((state) => {
      if (!state.bidForm) return state;

      const updatedBidForm = { ...state.bidForm };
      updatedBidForm.sections = updatedBidForm.sections.map((section) => ({
        ...section,
        lines: section.lines.map((line) =>
          line.id === lineId
            ? { ...line, toggles: { ...line.toggles, ...toggles } }
            : line
        ),
      }));

      const newState = { ...state, bidForm: updatedBidForm };
      debouncedSave(newState);
      return newState;
    });
  },

  setBidFormLineIncluded: (lineId, included) => {
    get().updateBidFormLine(lineId, { included });
  },

  updateBidFormProject: (updates) => {
    set((state) => {
      if (!state.bidForm) return state;

      const updatedBidForm = {
        ...state.bidForm,
        project: { ...state.bidForm.project, ...updates },
      };

      const newState = { ...state, bidForm: updatedBidForm };
      debouncedSave(newState);
      return newState;
    });
  },

  updateBidFormSettings: (updates) => {
    set((state) => {
      if (!state.bidForm) return state;

      const updatedBidForm = {
        ...state.bidForm,
        settings: { ...state.bidForm.settings, ...updates },
      };

      const newState = { ...state, bidForm: updatedBidForm };
      debouncedSave(newState);
      return newState;
    });
  },

  updateBidFormExclusions: (exclusions) => {
    set((state) => {
      if (!state.bidForm) return state;

      const updatedBidForm = { ...state.bidForm, exclusions };

      const newState = { ...state, bidForm: updatedBidForm };
      debouncedSave(newState);
      return newState;
    });
  },
}));
