/**
 * PaintBid - Bid Form Types
 * Data model for File 3 style bid form
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface BidFormToggles {
  tightAccess?: boolean;
  heavyPrep?: boolean;
  occupied?: boolean;
  extraShelving?: boolean;
  large?: boolean;
}

export interface BidFormLine {
  id: string;
  section: string;
  label: string; // e.g., "Units", "Wall SF", "Doors"
  qty: number;
  uom: string; // "EA", "SF", "LF"
  baseUnitPrice: number; // the "2" setting price reference
  difficulty: Difficulty;
  toggles: BidFormToggles;
  included: boolean;
  notes?: string;
  isAlternate?: boolean; // true for add alternates
}

export interface BidFormSection {
  name: string;
  lines: BidFormLine[];
}

export interface ProjectInfo {
  developer?: string;
  projectName?: string;
  address?: string;
  city?: string;
  contact?: string;
  phone?: string;
  email?: string;
  date?: string;
}

export interface BidForm {
  id: string;
  project: ProjectInfo;
  sections: BidFormSection[];
  exclusions: string[];
  settings: {
    overheadPct: number;
    profitPct: number;
    contingencyPct: number;
  };
}
