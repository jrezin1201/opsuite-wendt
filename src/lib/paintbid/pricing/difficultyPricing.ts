/**
 * Difficulty Level Pricing Configuration
 * Based on the professional pricing sheets showing difficulty levels 1-5
 */

export interface DifficultyPricing {
  basePrice: number; // Price at difficulty level 1
  incrementPerLevel: number; // Amount to add for each difficulty level above 1
  followsUnits?: boolean; // If true, uses the same difficulty as units
  checkboxOnly?: boolean; // If true, no difficulty adjustment, just include/exclude
}

// Pricing configuration for all line items
export const DIFFICULTY_PRICING: Record<string, DifficultyPricing> = {
  // UNIT INTERIOR
  "units": {
    basePrice: 1350.00,
    incrementPerLevel: 50.00
  },
  "units_prime_coat": {
    basePrice: 250.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_eggshell_walls": {
    basePrice: 600.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_two_tone": {
    basePrice: 425.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_base_over_floor": {
    basePrice: 90.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_cased_windows": {
    basePrice: 75.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_smooth_wall": {
    basePrice: 450.00,
    incrementPerLevel: 0,
    followsUnits: true
  },
  "units_mask_hinges": {
    basePrice: 50.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },

  // CORRIDORS
  "corridor_wall_sf": {
    basePrice: 0.60,
    incrementPerLevel: 0.05
  },
  "corridor_ceiling_sf": {
    basePrice: 0.40,
    incrementPerLevel: 0.05
  },
  "corridor_doors": {
    basePrice: 175.00,
    incrementPerLevel: 25.00
  },
  "corridor_frames": {
    basePrice: 175.00,
    incrementPerLevel: 25.00
  },
  "corridor_base": {
    basePrice: 50.00,
    incrementPerLevel: 25.00
  },
  "corridor_entry_doors": {
    basePrice: 250.00,
    incrementPerLevel: 25.00
  },
  "corridor_prime_coat": {
    basePrice: 120.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "corridor_eggshell_walls": {
    basePrice: 200.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "corridor_two_tone": {
    basePrice: 135.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "corridor_smooth_wall": {
    basePrice: 125.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },

  // STAIRWELLS
  "stairwell_rails": {
    basePrice: 600.00,
    incrementPerLevel: 100.00
  },
  "stairwell_walls": {
    basePrice: 600.00,
    incrementPerLevel: 100.00
  },
  "stairwell_prime_coat": {
    basePrice: 120.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "stairwell_eggshell_walls": {
    basePrice: 200.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "stairwell_two_tone": {
    basePrice: 135.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },
  "stairwell_smooth_wall": {
    basePrice: 125.00,
    incrementPerLevel: 0,
    checkboxOnly: true
  },

  // AMENITY AREAS
  "amenity_room_sf": {
    basePrice: 4.00,
    incrementPerLevel: 1.00
  },

  // EXTERIOR
  "exterior_door": {
    basePrice: 175.00,
    incrementPerLevel: 25.00
  },
  "exterior_parapet": {
    basePrice: 3.00,
    incrementPerLevel: 5.00
  },
  "exterior_window_trim": {
    basePrice: 75.00,
    incrementPerLevel: 15.00
  },
  "exterior_window_wood_verticals": {
    basePrice: 35.00,
    incrementPerLevel: 0
  },
  "exterior_balc_rail": {
    basePrice: 250.00,
    incrementPerLevel: 75.00
  },
  "exterior_misc": {
    basePrice: 50.00,
    incrementPerLevel: 10.00
  },
  "exterior_stucco_body": {
    basePrice: 0.95,
    incrementPerLevel: 0,
    checkboxOnly: true // Follow up with Jordan
  },
  "exterior_prime_stucco": {
    basePrice: 0.50,
    incrementPerLevel: 0.10
  },
  "exterior_stucco_accents_balcs": {
    basePrice: 275.00,
    incrementPerLevel: 25.00
  },
  "exterior_prime_stucco_accents": {
    basePrice: 200.00,
    incrementPerLevel: 0
  },
  "exterior_balc_doors": {
    basePrice: 250.00,
    incrementPerLevel: 25.00
  },

  // GARAGE
  "garage_trash_room": {
    basePrice: 500.00,
    incrementPerLevel: 75.00
  },
  "garage_doors": {
    basePrice: 200.00,
    incrementPerLevel: 25.00
  },
  "garage_bike_storage": {
    basePrice: 500.00,
    incrementPerLevel: 75.00
  },
  "garage_walls": {
    basePrice: 0.75,
    incrementPerLevel: 0.10
  },
  "garage_columns": {
    basePrice: 80.00,
    incrementPerLevel: 25.00
  },

  // LANDSCAPE
  "landscape_gates": {
    basePrice: 350.00,
    incrementPerLevel: 50.00
  }
};

/**
 * Calculate price for a line item based on difficulty level
 * @param itemKey - The key identifying the line item type
 * @param quantity - The quantity of the item
 * @param difficultyLevel - The difficulty level (1-5)
 * @param unitsDifficulty - The difficulty level of units (for items that follow units)
 * @returns The total price for the line item
 */
export function calculateDifficultyPrice(
  itemKey: string,
  quantity: number,
  difficultyLevel: number = 1,
  unitsDifficulty?: number
): number {
  const pricing = DIFFICULTY_PRICING[itemKey];
  if (!pricing) {
    console.warn(`No pricing configuration found for item: ${itemKey}`);
    return 0;
  }

  // If checkbox only, difficulty doesn't affect price
  if (pricing.checkboxOnly) {
    return pricing.basePrice * quantity;
  }

  // Use units difficulty if this item follows units
  const effectiveDifficulty = pricing.followsUnits && unitsDifficulty
    ? unitsDifficulty
    : difficultyLevel;

  // Calculate price: base + (increment * levels above 1)
  const pricePerUnit = pricing.basePrice + (pricing.incrementPerLevel * (effectiveDifficulty - 1));
  return pricePerUnit * quantity;
}

/**
 * Get difficulty level multiplier for display
 * @param difficultyLevel - The difficulty level (1-5)
 * @returns A descriptive multiplier string
 */
export function getDifficultyMultiplier(difficultyLevel: number): string {
  switch (difficultyLevel) {
    case 1: return "1.0x (Base)";
    case 2: return "1.1x";
    case 3: return "1.2x";
    case 4: return "1.3x";
    case 5: return "1.5x (Maximum)";
    default: return "1.0x";
  }
}

/**
 * Get difficulty level description
 * @param difficultyLevel - The difficulty level (1-5)
 * @returns A description of what this difficulty level means
 */
export function getDifficultyDescription(difficultyLevel: number): string {
  switch (difficultyLevel) {
    case 1:
      return "Standard - Easy access, minimal prep, vacant units";
    case 2:
      return "Moderate - Some access constraints, standard prep";
    case 3:
      return "Challenging - Tight access, heavy prep, partially occupied";
    case 4:
      return "Difficult - Very tight access, extensive prep, fully occupied";
    case 5:
      return "Extreme - Maximum difficulty, special requirements, high-end finish";
    default:
      return "Unknown difficulty level";
  }
}

/**
 * Helper to format line item with difficulty pricing
 */
export interface LineItemPricing {
  itemKey: string;
  description: string;
  quantity: number;
  uom: string; // Unit of measure
  basePrice: number;
  difficultyLevel: number;
  incrementPerLevel: number;
  subtotal: number;
  notes?: string;
}

/**
 * Create a line item with pricing details
 */
export function createLineItemPricing(
  itemKey: string,
  description: string,
  quantity: number,
  uom: string,
  difficultyLevel: number = 1,
  unitsDifficulty?: number
): LineItemPricing {
  const pricing = DIFFICULTY_PRICING[itemKey] || { basePrice: 0, incrementPerLevel: 0 };
  const subtotal = calculateDifficultyPrice(itemKey, quantity, difficultyLevel, unitsDifficulty);

  return {
    itemKey,
    description,
    quantity,
    uom,
    basePrice: pricing.basePrice,
    difficultyLevel: pricing.followsUnits ? (unitsDifficulty || difficultyLevel) : difficultyLevel,
    incrementPerLevel: pricing.incrementPerLevel,
    subtotal,
    notes: pricing.followsUnits ? "Uses same difficulty as units" :
           pricing.checkboxOnly ? "No difficulty adjustment" : undefined
  };
}