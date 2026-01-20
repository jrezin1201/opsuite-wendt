/**
 * Validation utilities
 * Input validation and feedback helpers
 */

export type ValidationResult = string | null;

/**
 * Validation functions for common input types
 * Returns error message string if invalid, null if valid
 */
export const validators = {
  price: (v: number): ValidationResult => {
    if (v < 0) return "Price cannot be negative";
    if (v === 0) return "Price must be greater than 0";
    return null;
  },

  licenses: (v: number): ValidationResult => {
    if (v < 1) return "Must have at least 1 license";
    if (!Number.isInteger(v)) return "Licenses must be a whole number";
    return null;
  },

  duration: (v: number): ValidationResult => {
    if (v < 1) return "Duration must be at least 1";
    return null;
  },

  margin: (v: number): ValidationResult => {
    if (v < 0) return "Margin cannot be negative";
    if (v > 1) return "Margin must be between 0 and 1";
    return null;
  },

  discountPercent: (v: number): ValidationResult => {
    if (v < 0) return "Discount cannot be negative";
    if (v > 100) return "Discount cannot exceed 100%";
    return null;
  },

  discountDollars: (v: number): ValidationResult => {
    if (v < 0) return "Discount cannot be negative";
    return null;
  },

  cac: (v: number): ValidationResult => {
    if (v < 0) return "CAC cannot be negative";
    return null;
  },

  rampMonths: (v: number): ValidationResult => {
    if (v < 0) return "Ramp months cannot be negative";
    if (!Number.isInteger(v)) return "Ramp months must be a whole number";
    return null;
  },

  freeMonths: (v: number): ValidationResult => {
    if (v < 0) return "Free months cannot be negative";
    if (!Number.isInteger(v)) return "Free months must be a whole number";
    return null;
  },

  escalatorPercent: (v: number): ValidationResult => {
    if (v < 0) return "Escalator cannot be negative";
    if (v > 100) return "Escalator cannot exceed 100%";
    return null;
  }
};

/**
 * Helper to validate a value and return error message
 */
export function validate(
  type: keyof typeof validators,
  value: number
): ValidationResult {
  return validators[type](value);
}
