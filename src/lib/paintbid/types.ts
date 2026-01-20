/**
 * PaintBid POC - Type Definitions
 * All types for the painting bid standardizer
 */

export type Complexity = 1 | 2 | 3 | 4 | 5;

export interface PricebookItem {
  id: string;
  code?: string;
  name: string;
  unit: string; // e.g., "sqft", "door", "lf", "each"
  baseUnitCost?: number;
  baseUnitPrice: number;
  defaultComplexity?: Complexity;
  defaultScopeText?: string;
  tags?: string[];
}

export interface TakeoffRow {
  id: string;
  rawName: string;
  qty: number;
  unit?: string;
  notes?: string;
  area?: string;
  sourceRow?: number;
}

export interface LineItemToggles {
  highAccess?: boolean;
  occupied?: boolean;
  heavyMasking?: boolean;
  badSubstrate?: boolean;
  rush?: boolean;
}

export interface LineItem {
  id: string;
  takeoffRowId: string;
  pricebookItemId?: string;
  nameOverride?: string;
  qty: number;
  unit: string;
  baseUnitPrice: number;
  complexity: Complexity;
  toggles: LineItemToggles;
  notes?: string;
  includedInProposal: boolean;
  group?: string; // e.g., area/room
}

export interface EstimateSettings {
  overheadPct: number; // e.g., 0.10 for 10%
  profitPct: number; // e.g., 0.20 for 20%
  contingencyPct: number; // e.g., 0.05 for 5%
  taxPct?: number;
}

export interface ProposalSettings {
  title: string;
  customerName?: string;
  address?: string;
  introText?: string;
  exclusionsText?: string;
  termsText?: string;
}

export interface AppState {
  pricebook: PricebookItem[];
  mappings: Record<string, string>; // key=normalized takeoff rawName -> pricebookItemId
  takeoffRows: TakeoffRow[];
  lineItems: LineItem[];
  estimateSettings: EstimateSettings;
  proposalSettings: ProposalSettings;
  lastSavedAt: number;
  // New QA & Import Report fields
  importReport?: ImportReport;
  qa: QAResolution;
  proposalFinals: ProposalFinalSnapshot[];
  activeFinalId?: string;
}

export interface LinePriceBreakdown {
  base: number;
  complexityMult: number;
  toggleAdds: number;
  multiplier: number;
  subtotal: number;
}

export interface TotalsBreakdown {
  baseSubtotal: number;
  contingency: number;
  overhead: number;
  profit: number;
  tax: number;
  total: number;
  itemCount: number;
}

/**
 * Import Report - tracks what was parsed vs mapped vs missed
 */
export interface ImportReport {
  id: string;
  createdAt: number;
  sources: {
    file1?: { filename: string; sheet: string };
    file2?: { filename: string; sheet: string };
    screenshot?: { filename: string };
  };
  summary: {
    parsedRows: number;        // total meaningful rows detected
    mappedRows: number;        // rows mapped into normalized counts or bid lines
    unmappedRows: number;
    ignoredRows: number;
    warnings: number;
    confidence: "high" | "medium" | "low";
  };
  unmapped: Array<{
    sectionGuess?: string;
    key: string;
    valueRaw?: string;
    valueNum?: number | null;
    rowIndex?: number;
    reason: "unrecognized_key" | "unrecognized_section" | "no_value" | "ambiguous";
    suggestions?: Array<{ label: string; target: string; score: number }>;
  }>;
  mapped: Array<{
    section: string;
    key: string;
    valueNum: number;
    mappedTo: string;   // normalized key or bid line id/label
    rowIndex?: number;
  }>;
  ignored: Array<{
    key: string;
    valueRaw?: string;
    rowIndex?: number;
    note?: string;
  }>;
  validator?: {
    enabled: boolean;
    ocrTextChars?: number;
    extractedPairs: Array<{ key: string; valueNum?: number | null }>;
    diffs: Array<{
      key: string;
      type: "screenshot_only" | "excel_only" | "mismatch";
      excelValue?: number;
      screenshotValue?: number;
      deltaPct?: number;
    }>;
  };
}

/**
 * QA Resolution - tracks how unmapped issues were resolved
 */
export interface QAResolution {
  acknowledgedAt?: number;
  resolved: Record<string, {
    action: "map" | "ignore" | "create_line";
    mappedTo?: string;     // target normalized key or bid line id
    note?: string;
  }>;
}

/**
 * Proposal Final Snapshot - frozen copy before printing
 */
export interface ProposalFinalSnapshot {
  id: string;
  createdAt: number;
  name: string;          // e.g. "Final v1"
  proposal: unknown;      // frozen copy (will type properly when we have Proposal type)
  bidTotals: {
    subtotal: number;
    overhead: number;
    profit: number;
    contingency: number;
    total: number;
  };
}
