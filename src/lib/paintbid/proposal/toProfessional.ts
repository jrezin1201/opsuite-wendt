/**
 * Convert BidForm to Professional Proposal Format
 */

import type { BidForm } from "../bidform/types";
import type { ProfessionalProposal, ScopeItem, AlternateItem } from "./professionalTypes";
import { computeBidFormTotals, computeBidFormLine } from "../bidform/pricing";

export function convertToProfessionalProposal(bidForm: BidForm): ProfessionalProposal {
  const totals = computeBidFormTotals(bidForm, true);

  // Initialize the professional proposal structure
  const proposal: ProfessionalProposal = {
    header: {
      developer: bidForm.project?.developer || "Kondor Builders",
      address: bidForm.project?.address || "23412 Moulton Pkwy",
      city: bidForm.project?.city || "Laguna Hills CA 92653",
      contact: bidForm.project?.contact || "Pavan Hemadrao Patil",
      phone: bidForm.project?.phone || "(626) 657-8594",
      email: bidForm.project?.email || "bjds@kondorbuilders.com",
      date: new Date().toLocaleDateString(),
      project: bidForm.project?.projectName || "1249 N. GOWER ST",
      units: 13, // Default units, can be extracted from sections if needed
      architectural: "12/22/23",
      landscape: "Excluded",
      interiorDesign: "NA",
      ownerSpecs: "NA",
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
      units: 0,
      corridors: 0,
      stairs: 0,
      amenity: 0,
      exterior: 0,
      garage: 0,
      landscape: 0,
      total: totals.total,
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
      additionalExclusions: bidForm.exclusions || [],
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

  // Map bid form sections to professional proposal scope sections
  bidForm.sections.forEach(section => {
    const sectionName = section.name.toLowerCase();
    const includedLines = section.lines.filter(line => line.included && !line.isAlternate);
    const alternateLines = section.lines.filter(line => line.included && line.isAlternate);

    // Map section pricing
    const sectionTotal = totals.sections[section.name] || 0;
    if (sectionName.includes("unit") || sectionName.includes("interior")) {
      proposal.pricing.units += sectionTotal;
    } else if (sectionName.includes("corridor")) {
      proposal.pricing.corridors += sectionTotal;
    } else if (sectionName.includes("stair")) {
      proposal.pricing.stairs += sectionTotal;
    } else if (sectionName.includes("amenity")) {
      proposal.pricing.amenity += sectionTotal;
    } else if (sectionName.includes("exterior")) {
      proposal.pricing.exterior += sectionTotal;
    } else if (sectionName.includes("garage")) {
      proposal.pricing.garage += sectionTotal;
    } else if (sectionName.includes("landscape")) {
      proposal.pricing.landscape += sectionTotal;
    }

    // Convert included lines to scope items
    const scopeItems: ScopeItem[] = includedLines.map(line => {
      const item: ScopeItem = {
        description: line.label,
        treatment: detectTreatment(line.label),
        details: line.notes ? [line.notes] : undefined,
      };

      // Check for flat one tone items
      if (line.label.toLowerCase().includes("flat") && line.label.toLowerCase().includes("tone")) {
        item.treatment = 'flat-one-tone';
        item.isHighlighted = true;
      }

      return item;
    });

    // Add to appropriate scope section
    if (sectionName.includes("unit") || sectionName.includes("interior")) {
      proposal.scopeOfWork.unitInterior.push(...scopeItems);
    } else if (sectionName.includes("stairwell")) {
      proposal.scopeOfWork.stairwells.push(...scopeItems);
    } else if (sectionName.includes("corridor")) {
      proposal.scopeOfWork.corridors.push(...scopeItems);
    } else if (sectionName.includes("amenity")) {
      proposal.scopeOfWork.amenityArea.push(...scopeItems);
    } else if (sectionName.includes("exterior")) {
      proposal.scopeOfWork.exterior.push(...scopeItems);
    } else if (sectionName.includes("garage")) {
      proposal.scopeOfWork.garage.push(...scopeItems);
    } else if (sectionName.includes("landscape")) {
      proposal.scopeOfWork.landscape.push(...scopeItems);
    }

    // Convert alternate lines to add alternates
    alternateLines.forEach(line => {
      const pricing = computeBidFormLine(line);
      proposal.addAlternates.push({
        description: `${section.name} - ${line.label}`,
        unitPrice: pricing.subtotal,
        category: section.name,
      });
    });
  });

  // Add standard scope items if sections are missing
  if (proposal.scopeOfWork.unitInterior.length === 0) {
    proposal.scopeOfWork.unitInterior = getDefaultUnitInteriorScope();
  }
  if (proposal.scopeOfWork.stairwells.length === 0) {
    proposal.scopeOfWork.stairwells = getDefaultStairwellScope();
  }
  if (proposal.scopeOfWork.corridors.length === 0) {
    proposal.scopeOfWork.corridors = getDefaultCorridorScope();
  }
  if (proposal.scopeOfWork.amenityArea.length === 0) {
    proposal.scopeOfWork.amenityArea = getDefaultAmenityScope();
  }
  if (proposal.scopeOfWork.exterior.length === 0) {
    proposal.scopeOfWork.exterior = getDefaultExteriorScope();
  }

  // Add standard add alternates if none exist
  if (proposal.addAlternates.length === 0) {
    proposal.addAlternates = getDefaultAddAlternates();
  }

  return proposal;
}

function detectTreatment(label: string): 'flat-one-tone' | 'normal' | 'excluded' | undefined {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('flat') && lowerLabel.includes('tone')) {
    return 'flat-one-tone';
  }
  if (lowerLabel.includes('exclude')) {
    return 'excluded';
  }
  return 'normal';
}

function getDefaultUnitInteriorScope(): ScopeItem[] {
  return [
    {
      description: "Drywall Level 3 Orange Peel",
      treatment: 'flat-one-tone',
      isHighlighted: true,
    },
    {
      description: "Walls & Ceilings: Flat - White",
    },
    {
      description: "Doors, Base & Casings: Semi Gloss Same Color As Walls",
    },
    {
      description: "Wardrobe & WIC: Walls, Ceilings, Shelving: ALL Same Color As Walls Semi Gloss Finish",
    },
    {
      description: "Bathroom Walls and Ceilings: Semi Gloss Same Color As Living",
    },
    {
      description: "Excludes Masking Hinges",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Two Tone Living Area",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Cased Windows",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Base Over Flooring (See Add Alts)",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accent Walls At Living Area",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Stool & Apron",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Prime Coat At Walls (To be painted 2 coats of flat)",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Prep Coat",
      treatment: 'excluded',
      isExcluded: true,
    },
  ];
}

function getDefaultStairwellScope(): ScopeItem[] {
  return [
    {
      description: "Walls: Flat",
      treatment: 'flat-one-tone',
      isHighlighted: true,
    },
    {
      description: "Hand Rail: Semi Gloss",
    },
    {
      description: "Excludes Accent Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Smooth Wall",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Pointing CMU Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Stand Pipes",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accents",
      treatment: 'excluded',
      isExcluded: true,
    },
  ];
}

function getDefaultCorridorScope(): ScopeItem[] {
  return [
    {
      description: "Drywall Finish: Level 3/4 Orange Peel",
      treatment: 'flat-one-tone',
      isHighlighted: true,
    },
    {
      description: "Walls & Ceilings Flat Same Color",
    },
    {
      description: "Entry Doors, Casing & Base Same Color As Walls Semi Gloss",
    },
    {
      description: "Common Area Doors: Semi Gloss: Same Color As Walls",
    },
    {
      description: "Excludes Two Tone",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accent At Unit Entry Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accent Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Prep Coat",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Chair Rail",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Stool & Apron At Windows",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Wall Covering",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Entry Doors Accented",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accent Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Smooth Wall",
      treatment: 'excluded',
      isExcluded: true,
    },
  ];
}

function getDefaultAmenityScope(): ScopeItem[] {
  return [
    {
      description: "Drywall Finish: Level 3/4 Orange Peel",
      treatment: 'flat-one-tone',
      isHighlighted: true,
    },
    {
      description: "Walls & Ceilings Flat Same Color",
    },
    {
      description: "Doors & Baseboards: Semi Gloss; Same Color As Walls & Ceilings",
    },
    {
      description: "Excludes Two Tone",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Prep Coat",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accent Walls",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Crown",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Cased Windows",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Wall Coverings",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "NO ID Plans At Time Of Bidding",
      treatment: 'excluded',
      isExcluded: true,
    },
  ];
}

function getDefaultExteriorScope(): ScopeItem[] {
  return [
    {
      description: "Main Doors",
    },
    {
      description: "Wood Window Trim",
    },
    {
      description: "Balc Rails (To Be Shop Primed)",
    },
    {
      description: "Wood Verticals",
    },
    {
      description: "Parapet Cap Primed & Painted",
    },
    {
      description: "Excludes Balcony Doors (See Add Alt For Swing Doors)",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Accented Recessed Windows",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Art Murals",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Al Body Screen & Body GutsFront; Not Shown On Plans",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Back Of Parapet",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Downspouts Scuppers & Gutters Not Shown on Plans",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Pointing Rtrj Pipes & Penetrations",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Prime Coat At Stucco Body",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Priming Balc Rails",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Stucco Body & Stucco Accents (See Add Alts)",
      treatment: 'excluded',
      isExcluded: true,
    },
    {
      description: "Excludes Vents & Louvers",
      treatment: 'excluded',
      isExcluded: true,
    },
  ];
}

function getDefaultAddAlternates(): AlternateItem[] {
  return [
    { description: "True Prime Coat at Units", unitPrice: 3500.00 },
    { description: "Eggshell Walls at Units", unitPrice: 8400.00 },
    { description: "Two Tone Units", unitPrice: 5950.00 },
    { description: "Base Over Floor at Units", unitPrice: 1260.00 },
    { description: "Mask Hinges At Units", unitPrice: 3000.00 },
    { description: "Smooth Wall at Units", unitPrice: 6300.00 },
    { description: "True Prime Coat at Corridor & Stairwells", unitPrice: 3240.00 },
    { description: "Eggshell Walls at Corridor & Stairwells", unitPrice: 5400.00 },
    { description: "Two Tone Corridor & Stairwells", unitPrice: 3645.00 },
    { description: "Smooth Wall at Corridor & Stairwells", unitPrice: 3375.00 },
    { description: "Stucco Body", unitPrice: 9690.00 },
    { description: "Prime Coat at Stucco Body", unitPrice: 5100.00 },
    { description: "Stucco Accents at Balc", unitPrice: 2750.00 },
    { description: "Prime Stucco Accents at Balc", unitPrice: 2000.00 },
    { description: "Balcony Swing Doors", unitPrice: 1250.00 },
    { description: "Garage Walls Flat", unitPrice: 2850.00 },
    { description: "Garage Columns", unitPrice: 320.00 },
  ];
}