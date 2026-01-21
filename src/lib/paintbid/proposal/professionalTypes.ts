/**
 * Professional Proposal Types
 * Matches the exact format from the professional bid documents
 */

export interface ProfessionalProposal {
  // Header Section
  header: {
    developer: string;
    address: string;
    city: string;
    contact: string;
    phone: string;
    email: string;
    date: string;

    // Plans Section
    project: string;
    units: number;
    architectural: string;
    landscape: string;
    interiorDesign: string;
    ownerSpecs: string;
    isExcluded?: boolean; // For marking as excluded
  };

  // Scope of Work Sections
  scopeOfWork: {
    unitInterior: ScopeItem[];
    stairwells: ScopeItem[];
    corridors: ScopeItem[];
    corridorsContinued?: ScopeItem[];
    amenityArea: ScopeItem[];
    exterior: ScopeItem[];
    garage: ScopeItem[];
    landscape: ScopeItem[];
  };

  // Pricing Section
  pricing: {
    units: number;
    corridors: number;
    stairs: number;
    amenity: number;
    exterior: number;
    garage: number;
    landscape: number;
    total: number;
    wrapLiability?: string; // Note about insurance
  };

  // Exclusions
  exclusions: {
    specifications9900: boolean;
    zeroVocPaints: boolean;
    scaffoldingLifts: boolean;
    saturdayWeekendWork: boolean;
    waterProofing: boolean;
    allExteriorCaulking: boolean;
    powerPressureWashing: boolean;
    signingUnmodifiedScaffold: boolean;

    additionalExclusions: string[];

    rightColumn: {
      maskedHinges: boolean;
      allStandPipes: boolean;
      wallCoverings: boolean;
      paidParking: boolean;
      caulkingWindows: boolean;
      notResponsibleForRusting: boolean;
      paymentPerformanceBonds: boolean;
      excessUmbrellaCoverages: boolean;
    };
  };

  // Add Alternates
  addAlternates: AlternateItem[];

  // Additional Work Rates
  additionalWork: {
    halfTimeOT: number; // $/hr
    oneHalfTimeOT: number; // $/hr
  };

  // Materials Table
  materialsIncluded: {
    units: MaterialSpec;
    commonArea: MaterialSpec;
    exterior: MaterialSpec;
  };
}

export interface ScopeItem {
  description: string;
  treatment?: 'flat-one-tone' | 'normal' | 'excluded';
  details?: string[];
  isExcluded?: boolean;
  isHighlighted?: boolean; // For yellow highlighting
  notes?: string;
}

export interface AlternateItem {
  description: string;
  unitPrice: number;
  isPerUnit?: boolean;
  category?: string;
}

export interface MaterialSpec {
  flat?: 'Breezewall' | 'V-Pro' | 'NA' | string;
  enamel?: 'V-Pro' | 'NA' | string;
  exterior?: {
    stuccoBody?: 'NA' | string;
    canopies?: 'NA' | string;
    balconyRails?: 'Protec' | string;
    doors?: 'Protec' | string;
    wood?: 'Coverall' | string;
  };
  concreteWalls?: 'NONE' | string;
}

// Helper function to create default professional proposal
export function createDefaultProfessionalProposal(): ProfessionalProposal {
  return {
    header: {
      developer: "Kondor Builders",
      address: "23412 Moulton Pkwy",
      city: "Laguna Hills CA 92653",
      contact: "Pavan Hemadrao Patil",
      phone: "(626) 657-8594",
      email: "bjds@kondorbuilders.com",
      date: new Date().toLocaleDateString(),
      project: "1249 N. GOWER ST",
      units: 13,
      architectural: "12/22/23",
      landscape: "Excluded",
      interiorDesign: "NA",
      ownerSpecs: "NA",
      isExcluded: false,
    },
    scopeOfWork: {
      unitInterior: [],
      stairwells: [],
      corridors: [],
      amenityArea: [],
      exterior: [],
      garage: [],
      landscape: [],
    },
    pricing: {
      units: 18900.00,
      corridors: 10600.00,
      stairs: 15600.00,
      amenity: 5700.00,
      exterior: 12200.00,
      garage: 1800.00,
      landscape: 350.00,
      total: 65150.00,
      wrapLiability: "Pricing Net Wrap Liability Insurance",
    },
    exclusions: {
      specifications9900: true,
      zeroVocPaints: true,
      scaffoldingLifts: true,
      saturdayWeekendWork: true,
      waterProofing: true,
      allExteriorCaulking: true,
      powerPressureWashing: true,
      signingUnmodifiedScaffold: true,
      additionalExclusions: [],
      rightColumn: {
        maskedHinges: true,
        allStandPipes: true,
        wallCoverings: true,
        paidParking: true,
        caulkingWindows: true,
        notResponsibleForRusting: true,
        paymentPerformanceBonds: true,
        excessUmbrellaCoverages: true,
      },
    },
    addAlternates: [],
    additionalWork: {
      halfTimeOT: 73.00,
      oneHalfTimeOT: 37.00,
    },
    materialsIncluded: {
      units: {
        flat: "Breezewall",
        enamel: "V-Pro",
      },
      commonArea: {
        flat: "Breezewall",
        enamel: "V-Pro",
      },
      exterior: {
        exterior: {
          stuccoBody: "NA",
          canopies: "NA",
          balconyRails: "Protec",
          doors: "Protec",
          wood: "Coverall",
        },
        concreteWalls: "NONE",
      },
    },
  };
}

// Helper to format scope items for display
export function formatScopeItem(item: ScopeItem): string {
  let result = item.description;
  if (item.details && item.details.length > 0) {
    result += ": " + item.details.join(", ");
  }
  return result;
}

// Helper to check if item should be highlighted
export function shouldHighlight(item: ScopeItem): boolean {
  return item.treatment === 'flat-one-tone' || item.isHighlighted === true;
}

// Helper to check if item is excluded
export function isExcluded(item: ScopeItem): boolean {
  return item.treatment === 'excluded' || item.isExcluded === true;
}