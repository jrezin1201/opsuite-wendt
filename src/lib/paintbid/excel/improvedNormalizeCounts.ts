/**
 * Improved normalization with better pattern matching
 * Reduces unmapped items significantly
 */

import type { ParsedGroupedCounts } from "./parseFile2Grouped";
import type { ImportReport } from "../types";
import type { NormalizedCounts } from "./normalizeCounts";

/**
 * Improved key mapping with regex patterns for flexible matching
 */
const PATTERN_MAPPINGS: Array<{
  patterns: RegExp[];
  target: keyof NormalizedCounts;
  section: string;
  priority: number; // Higher priority patterns match first
}> = [
  // Units - High priority
  {
    patterns: [
      /^units?\s*(total|count)?$/i,
      /^total\s*units?$/i,
      /^\d+\s*units?$/i,
      /^units?\s*\d+$/i
    ],
    target: "unitsCount",
    section: "General",
    priority: 10
  },

  // Corridors - Wall SF
  {
    patterns: [
      /^(cor|corridor)s?\s*walls?\s*(sf|sqft|sq\s*ft)?$/i,
      /^walls?\s*(sf|sqft|sq\s*ft)$/i,
      /^(cor|corridor)s?\s*\d+\s*walls?$/i,
      /^\d+\s*(cor|corridor)s?\s*walls?$/i
    ],
    target: "corridorsWallSF",
    section: "Corridors",
    priority: 9
  },

  // Corridors - Ceiling SF
  {
    patterns: [
      /^(cor|corridor)s?\s*(lid|ceiling|clg)s?\s*(sf|sqft|sq\s*ft)?$/i,
      /^(lid|ceiling|clg)s?\s*(sf|sqft|sq\s*ft)$/i,
      /^(cor|corridor)s?\s*\d+\s*(lid|ceiling|clg)s?$/i
    ],
    target: "corridorsCeilingSF",
    section: "Corridors",
    priority: 9
  },

  // Corridors - Doors
  {
    patterns: [
      /^(cor|corridor)s?\s*doors?\s*(count)?$/i,
      /^doors?\s*\d+$/i,
      /^\d+\s*doors?$/i,
      /^(cor|corridor)s?\s*\d+\s*doors?$/i
    ],
    target: "corridorsDoorCount",
    section: "Corridors",
    priority: 8
  },

  // Corridors - Storage
  {
    patterns: [
      /^storage\s*(rooms?|count)?$/i,
      /^(cor|corridor)s?\s*storage$/i,
      /^\d+\s*storage$/i
    ],
    target: "corridorsStorageCount",
    section: "Corridors",
    priority: 7
  },

  // Corridors - Base
  {
    patterns: [
      /^base\s*(board|boards)?\s*(lf|linear|ft)?$/i,
      /^(cor|corridor)s?\s*base$/i,
      /^\d+\s*base$/i
    ],
    target: "corridorsBaseCount",
    section: "Corridors",
    priority: 7
  },

  // Corridors - Entry Doors
  {
    patterns: [
      /^entry\s*doors?\s*(count)?$/i,
      /^unit\s*entry\s*doors?$/i,
      /^(cor|corridor)s?\s*entry\s*doors?$/i,
      /^\d+\s*entry\s*doors?$/i
    ],
    target: "corridorsEntryDoorCount",
    section: "Corridors",
    priority: 9
  },

  // Stairs
  {
    patterns: [
      /^stairs?\s*1\s*(levels?|lvls?)?$/i,
      /^stairs?\s*#?1$/i,
      /^1st\s*stairs?$/i,
      /^stairs?\s*one$/i
    ],
    target: "stairs1Levels",
    section: "Stairs",
    priority: 8
  },
  {
    patterns: [
      /^stairs?\s*2\s*(levels?|lvls?)?$/i,
      /^stairs?\s*#?2$/i,
      /^2nd\s*stairs?$/i,
      /^stairs?\s*two$/i
    ],
    target: "stairs2Levels",
    section: "Stairs",
    priority: 8
  },

  // Amenity
  {
    patterns: [
      /^rec\s*(room)?\s*(sf|sqft|sq\s*ft)?$/i,
      /^recreation\s*room$/i,
      /^amenity\s*rec$/i
    ],
    target: "amenityRecRoomSF",
    section: "Amenity",
    priority: 7
  },
  {
    patterns: [
      /^lobby\s*(sf|sqft|sq\s*ft)?$/i,
      /^main\s*lobby$/i,
      /^amenity\s*lobby$/i
    ],
    target: "amenityLobbySF",
    section: "Amenity",
    priority: 7
  },

  // Exterior - Doors
  {
    patterns: [
      /^(ext|exterior)s?\s*doors?\s*(count)?$/i,
      /^exterior\s*\d+\s*doors?$/i,
      /^doors?$/i // Generic door pattern when in exterior section
    ],
    target: "exteriorDoorCount",
    section: "Exterior",
    priority: 8
  },

  // Exterior - Parapet
  {
    patterns: [
      /^parapet\s*(lf|linear|ft)?$/i,
      /^roof\s*parapet$/i,
      /^\d+\s*parapet$/i
    ],
    target: "parapetLF",
    section: "Exterior",
    priority: 8
  },

  // Exterior - Window Trim
  {
    patterns: [
      /^windows?\s*(\/door)?\s*trim\s*(count)?$/i,
      /^trim\s*count$/i,
      /^windows?\s*trim$/i,
      /^\d+\s*windows?\s*trim$/i
    ],
    target: "windowTrimCount",
    section: "Exterior",
    priority: 8
  },

  // Exterior - Wood Verticals
  {
    patterns: [
      /^(windows?\s*)?wood\s*verticals?\s*(count)?$/i,
      /^wood\s*verts?$/i,
      /^verticals?\s*count$/i,
      /^\d+\s*wood\s*verticals?$/i
    ],
    target: "woodVerticalsCount",
    section: "Exterior",
    priority: 7
  },

  // Exterior - Balcony Rail
  {
    patterns: [
      /^balc(ony)?\s*rails?\s*(lf|linear|ft)?$/i,
      /^balc\s*rails?$/i,
      /^\d+\s*balc(ony)?\s*rails?$/i
    ],
    target: "balconyRailLF",
    section: "Exterior",
    priority: 8
  },

  // Exterior - Misc
  {
    patterns: [
      /^misc(ellaneous)?$/i,
      /^(ext|exterior)\s*misc$/i,
      /^other$/i
    ],
    target: "exteriorMiscCount",
    section: "Exterior",
    priority: 5
  },

  // Exterior - Stucco
  {
    patterns: [
      /^stucco\s*(body\s*)?(sf|sqft|sq\s*ft)?$/i,
      /^\d+\s*stucco$/i
    ],
    target: "stuccoSF",
    section: "Exterior",
    priority: 7
  },

  // Garage - Walls
  {
    patterns: [
      /^garage\s*walls?\s*(sf|sqft|sq\s*ft)?$/i,
      /^walls?\s*(sf|sqft|sq\s*ft)$/i, // Generic wall pattern in garage section
      /^\d+\s*garage\s*walls?$/i
    ],
    target: "garageWallSF",
    section: "Garage",
    priority: 8
  },

  // Garage - Trash Room
  {
    patterns: [
      /^(garage\s*)?trash\s*rooms?\s*(count)?$/i,
      /^trash$/i,
      /^\d+\s*trash\s*rooms?$/i
    ],
    target: "garageTrashRoomCount",
    section: "Garage",
    priority: 8
  },

  // Garage - Bike Storage
  {
    patterns: [
      /^(garage\s*)?bike\s*(storage|room|rack)s?\s*(count)?$/i,
      /^bike\s*storage$/i,
      /^\d+\s*bike\s*(room|storage)$/i
    ],
    target: "garageBikeStorageCount",
    section: "Garage",
    priority: 8
  },

  // Garage - Doors
  {
    patterns: [
      /^garage\s*doors?\s*(count)?$/i,
      /^doors?$/i, // Generic door when in garage section
      /^\d+\s*garage\s*doors?$/i
    ],
    target: "garageDoorCount",
    section: "Garage",
    priority: 7
  },

  // Garage - Columns
  {
    patterns: [
      /^(garage\s*)?columns?\s*(count)?$/i,
      /^cols?$/i,
      /^\d+\s*columns?$/i
    ],
    target: "garageColumnCount",
    section: "Garage",
    priority: 7
  },

  // Landscape - Gates
  {
    patterns: [
      /^gates?\s*(count)?$/i,
      /^landscape\s*gates?$/i,
      /^\d+\s*gates?$/i
    ],
    target: "gateCount",
    section: "Landscape",
    priority: 8
  },

  // General - Total SF
  {
    patterns: [
      /^total\s*(sf|sqft|sq\s*ft)$/i,
      /^building\s*total\s*(sf|sqft)?$/i,
      /^gross\s*(sf|sqft)$/i
    ],
    target: "totalSF",
    section: "General",
    priority: 6
  }
];

/**
 * Clean and normalize key string for better matching
 */
function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Find best matching pattern for a key
 */
function findBestMatch(
  key: string,
  section?: string
): { target: keyof NormalizedCounts; confidence: number } | null {
  const normalizedKey = normalizeKey(key);

  // Sort patterns by priority (highest first)
  const sortedPatterns = [...PATTERN_MAPPINGS].sort((a, b) => b.priority - a.priority);

  // First pass: Try to match with section context
  if (section) {
    for (const mapping of sortedPatterns) {
      // Prefer section match
      if (mapping.section.toLowerCase() === section.toLowerCase()) {
        for (const pattern of mapping.patterns) {
          if (pattern.test(normalizedKey)) {
            return { target: mapping.target, confidence: 0.95 };
          }
        }
      }
    }
  }

  // Second pass: Try without section context
  for (const mapping of sortedPatterns) {
    for (const pattern of mapping.patterns) {
      if (pattern.test(normalizedKey)) {
        // Lower confidence without section match
        const confidence = section && mapping.section !== section ? 0.7 : 0.85;
        return { target: mapping.target, confidence };
      }
    }
  }

  // Third pass: Fuzzy matching for close matches
  const keyWords = normalizedKey.split(' ');
  for (const mapping of sortedPatterns) {
    for (const pattern of mapping.patterns) {
      const patternStr = pattern.source.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const patternWords = patternStr.split(/\s+/);

      // Check if key contains important pattern words
      const matchCount = keyWords.filter(kw =>
        patternWords.some(pw => pw.includes(kw) || kw.includes(pw))
      ).length;

      if (matchCount > 0 && matchCount >= Math.min(2, keyWords.length / 2)) {
        return { target: mapping.target, confidence: 0.6 };
      }
    }
  }

  return null;
}

/**
 * Improved normalization with better pattern matching
 */
export function improvedNormalizeCounts(
  parsed: ParsedGroupedCounts
): {
  counts: NormalizedCounts;
  mapped: ImportReport["mapped"];
  unmapped: ImportReport["unmapped"];
  confidence: number;
} {
  const { rows } = parsed;
  const normalized: NormalizedCounts = {};
  const mapped: ImportReport["mapped"] = [];
  const unmapped: ImportReport["unmapped"] = [];

  // Process KV rows
  const kvRows = rows.filter(row => row.type === "kv" && row.valueNum !== null && row.valueNum !== undefined);

  let totalConfidence = 0;
  let mappedWithHighConfidence = 0;

  for (const row of kvRows) {
    if (!row.key || row.valueNum === null || row.valueNum === undefined) continue;

    const match = findBestMatch(row.key, row.sectionGuess);

    if (match && match.confidence >= 0.6) {
      // Map the value
      normalized[match.target] = row.valueNum;
      mapped.push({
        section: row.sectionGuess || "Unknown",
        key: row.key,
        valueNum: row.valueNum,
        mappedTo: match.target,
        rowIndex: row.rowIndex,
      });

      totalConfidence += match.confidence;
      if (match.confidence >= 0.85) {
        mappedWithHighConfidence++;
      }
    } else {
      // Still unmapped, but provide better suggestions
      unmapped.push({
        sectionGuess: row.sectionGuess,
        key: row.key,
        valueRaw: row.valueRaw,
        valueNum: row.valueNum,
        rowIndex: row.rowIndex,
        reason: "unrecognized_key",
        suggestions: []
      });
    }
  }

  const overallConfidence = mapped.length > 0
    ? totalConfidence / mapped.length
    : 0;

  console.log("✅ Improved normalization complete:", {
    totalRows: kvRows.length,
    mapped: mapped.length,
    unmapped: unmapped.length,
    mappingRate: `${((mapped.length / kvRows.length) * 100).toFixed(1)}%`,
    avgConfidence: `${(overallConfidence * 100).toFixed(1)}%`,
    highConfidenceCount: mappedWithHighConfidence
  });

  return {
    counts: normalized,
    mapped,
    unmapped,
    confidence: overallConfidence
  };
}