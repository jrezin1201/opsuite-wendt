/**
 * Rule-based mapping system for classification + UOM to buckets
 * Deterministic mapping with clear precedence
 */

import type { StandardUOM } from "./uom";

export type MapResult =
  | { status: "mapped"; bucket: string; label: string; ruleId: string }
  | {
      status: "unmapped";
      reason: "UnsupportedUOM" | "NoRuleMatch";
      details: {
        classificationRaw?: string;
        classificationKey?: string;
        uom?: StandardUOM;
        suggestedTokens?: string[];
      }
    };

export interface MappingRule {
  id: string;
  match: {
    includes?: string[];     // All tokens must be present
    excludes?: string[];     // None of these can be present
    uom: StandardUOM;        // Exact UOM match required
  };
  output: {
    bucket: string;          // Internal bucket ID
    label: string;           // Display label
  };
}

/**
 * Mapping rules ordered from most specific to most general
 */
export const MAPPING_RULES: MappingRule[] = [
  // ============ FENCE RULES ============
  {
    id: "FENCE_CHAIN_LINK_LF",
    match: {
      includes: ["fence", "chain link"],
      uom: "LF"
    },
    output: {
      bucket: "FENCE_LF",
      label: "Chain Link Fence"
    }
  },

  // ============ STUCCO RULES ============
  {
    id: "STUCCO_BALCONY_ACCENT_EA",
    match: {
      includes: ["stucco", "balcony"],
      uom: "EA"
    },
    output: {
      bucket: "STUCCO_FEATURE_COUNT",
      label: "Stucco Accents (Balcony)"
    }
  },
  {
    id: "STUCCO_ACCENT_EA",
    match: {
      includes: ["stucco", "accent"],
      excludes: ["body"],
      uom: "EA"
    },
    output: {
      bucket: "STUCCO_FEATURE_COUNT",
      label: "Stucco Accents"
    }
  },
  {
    id: "STUCCO_BODY_SF",
    match: {
      includes: ["stucco"],
      excludes: ["accent", "balcony", "feature"],
      uom: "SF"
    },
    output: {
      bucket: "STUCCO_SF",
      label: "Stucco Body"
    }
  },

  // ============ CMU/MASONRY RULES ============
  {
    id: "CMU_WALL_LF",
    match: {
      includes: ["cmu", "wall"],
      uom: "LF"
    },
    output: {
      bucket: "CMU_WALL_LF",
      label: "CMU Wall (Linear)"
    }
  },
  {
    id: "CMU_WALL_SF",
    match: {
      includes: ["cmu", "wall"],
      uom: "SF"
    },
    output: {
      bucket: "CMU_WALL_SF",
      label: "CMU Wall (Area)"
    }
  },

  // ============ CORRIDOR RULES ============
  {
    id: "CORRIDOR_WALL_SF",
    match: {
      includes: ["corridor", "wall"],
      uom: "SF"
    },
    output: {
      bucket: "CORRIDOR_WALL_SF",
      label: "Corridor Walls"
    }
  },
  {
    id: "CORRIDOR_CEILING_SF",
    match: {
      includes: ["corridor", "ceiling"],
      uom: "SF"
    },
    output: {
      bucket: "CORRIDOR_CEILING_SF",
      label: "Corridor Ceilings"
    }
  },
  {
    id: "CORRIDOR_DOOR_EA",
    match: {
      includes: ["corridor", "door"],
      excludes: ["entry"],
      uom: "EA"
    },
    output: {
      bucket: "CORRIDOR_DOOR_COUNT",
      label: "Corridor Doors"
    }
  },
  {
    id: "CORRIDOR_ENTRY_DOOR_EA",
    match: {
      includes: ["corridor", "entry", "door"],
      uom: "EA"
    },
    output: {
      bucket: "CORRIDOR_ENTRY_DOOR_COUNT",
      label: "Corridor Entry Doors"
    }
  },

  // ============ EXTERIOR RULES ============
  {
    id: "EXTERIOR_DOOR_EA",
    match: {
      includes: ["exterior", "door"],
      uom: "EA"
    },
    output: {
      bucket: "EXTERIOR_DOOR_COUNT",
      label: "Exterior Doors"
    }
  },
  {
    id: "PARAPET_LF",
    match: {
      includes: ["parapet"],
      uom: "LF"
    },
    output: {
      bucket: "PARAPET_LF",
      label: "Parapet"
    }
  },
  {
    id: "BALCONY_RAIL_LF",
    match: {
      includes: ["balcony", "rail"],
      uom: "LF"
    },
    output: {
      bucket: "BALCONY_RAIL_LF",
      label: "Balcony Rails"
    }
  },

  // ============ GARAGE RULES ============
  {
    id: "GARAGE_WALL_SF",
    match: {
      includes: ["garage", "wall"],
      uom: "SF"
    },
    output: {
      bucket: "GARAGE_WALL_SF",
      label: "Garage Walls"
    }
  },
  {
    id: "GARAGE_DOOR_EA",
    match: {
      includes: ["garage", "door"],
      uom: "EA"
    },
    output: {
      bucket: "GARAGE_DOOR_COUNT",
      label: "Garage Doors"
    }
  },

  // ============ UNIT RULES ============
  {
    id: "UNIT_COUNT",
    match: {
      includes: ["unit"],
      excludes: ["door", "wall", "ceiling", "base"],
      uom: "EA"
    },
    output: {
      bucket: "UNIT_COUNT",
      label: "Units"
    }
  },

  // ============ STAIRS RULES ============
  {
    id: "STAIRS_LEVEL",
    match: {
      includes: ["stair"],
      excludes: ["rail"],
      uom: "EA"
    },
    output: {
      bucket: "STAIRS_LEVELS",
      label: "Stair Levels"
    }
  },
  {
    id: "STAIR_RAIL_LF",
    match: {
      includes: ["stair", "rail"],
      uom: "LF"
    },
    output: {
      bucket: "STAIR_RAIL_LF",
      label: "Stair Rails"
    }
  },

  // ============ AMENITY RULES ============
  {
    id: "REC_ROOM_SF",
    match: {
      includes: ["rec", "room"],
      uom: "SF"
    },
    output: {
      bucket: "AMENITY_REC_ROOM_SF",
      label: "Recreation Room"
    }
  },
  {
    id: "LOBBY_SF",
    match: {
      includes: ["lobby"],
      uom: "SF"
    },
    output: {
      bucket: "AMENITY_LOBBY_SF",
      label: "Lobby"
    }
  },

  // ============ LANDSCAPE RULES ============
  {
    id: "GATE_EA",
    match: {
      includes: ["gate"],
      uom: "EA"
    },
    output: {
      bucket: "LANDSCAPE_GATE_COUNT",
      label: "Gates"
    }
  }
];

/**
 * Check if a classification key matches a rule
 */
function matchesRule(classificationKey: string, rule: MappingRule, uom: StandardUOM): boolean {
  // UOM must match exactly
  if (rule.match.uom !== uom) {
    return false;
  }

  // All includes must be present
  if (rule.match.includes) {
    for (const token of rule.match.includes) {
      if (!classificationKey.includes(token)) {
        return false;
      }
    }
  }

  // None of the excludes can be present
  if (rule.match.excludes) {
    for (const token of rule.match.excludes) {
      if (classificationKey.includes(token)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Map a classification and UOM to a bucket using rules
 */
export function mapRowToBucket(
  classificationKey: string,
  uom: StandardUOM,
  classificationRaw?: string
): MapResult {
  // Check for unsupported UOM
  if (uom === "UNKNOWN") {
    return {
      status: "unmapped",
      reason: "UnsupportedUOM",
      details: {
        classificationRaw,
        classificationKey,
        uom
      }
    };
  }

  // Find first matching rule
  for (const rule of MAPPING_RULES) {
    if (matchesRule(classificationKey, rule, uom)) {
      return {
        status: "mapped",
        bucket: rule.output.bucket,
        label: rule.output.label,
        ruleId: rule.id
      };
    }
  }

  // No rule matched
  return {
    status: "unmapped",
    reason: "NoRuleMatch",
    details: {
      classificationRaw,
      classificationKey,
      uom,
      suggestedTokens: classificationKey.split(" ").filter(t => t.length > 2)
    }
  };
}