/**
 * Custom Mappings Storage
 * Store user-confirmed mappings for learning
 */

import type { IntentTarget } from "./types";

export type CustomMapping = {
  target: IntentTarget;
  createdAt: number;
};

export type CustomMappingsData = Record<string, CustomMapping>;

const STORAGE_KEY = "paintbid_custom_intent_mappings";

/**
 * Load custom mappings from localStorage
 */
export function loadCustomMappings(): CustomMappingsData {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as CustomMappingsData;
  } catch (error) {
    console.error("Failed to load custom mappings:", error);
    return {};
  }
}

/**
 * Save custom mappings to localStorage
 */
export function saveCustomMappings(mappings: CustomMappingsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  } catch (error) {
    console.error("Failed to save custom mappings:", error);
  }
}

/**
 * Set a custom mapping for a normalized key
 */
export function setCustomMapping(normalizedKey: string, target: IntentTarget): void {
  const mappings = loadCustomMappings();
  mappings[normalizedKey] = {
    target,
    createdAt: Date.now()
  };
  saveCustomMappings(mappings);

  const targetDesc = target.type === "bidLine" || target.type === "alternateLine"
    ? `${target.section} > ${target.lineLabel}`
    : `Create: ${target.suggestedSection} > ${target.suggestedLabel}`;
  console.log(`✅ Saved custom mapping: "${normalizedKey}" → ${targetDesc}`);
}

/**
 * Remove a custom mapping
 */
export function removeCustomMapping(normalizedKey: string): void {
  const mappings = loadCustomMappings();
  delete mappings[normalizedKey];
  saveCustomMappings(mappings);
}

/**
 * Clear all custom mappings
 */
export function clearCustomMappings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}