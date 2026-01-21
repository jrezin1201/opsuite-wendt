/**
 * Tests for Intent Resolver
 * Verifies problematic keys auto-map correctly
 */

import { resolveIntent } from "../resolve";
import { normalizeKey } from "../normalize";

describe("Intent Resolver - Problematic Keys", () => {
  // Test cases for each problematic key that MUST auto-map
  const testCases = [
    // GARAGE items
    {
      rawKey: "Garage Lid",
      value: 8500,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Ceiling SF"
    },
    {
      rawKey: "Trash Room SF",
      value: 450,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Trash Room SF"
    },
    {
      rawKey: "Garage Storage SF",
      value: 1200,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Storage SF"
    },
    {
      rawKey: "Garage Column Count",
      value: 48,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Column Count"
    },
    {
      rawKey: "Garage Bike Rack Count",
      value: 6,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Bike Rack Count"
    },
    {
      rawKey: "Bike Parking Count",
      value: 24,
      expectedStatus: "mapped",
      expectedSection: "Garage",
      expectedLabel: "Bike Parking Count"
    },

    // EXTERIOR items
    {
      rawKey: "Balc. Rail Count",
      value: 12,
      expectedStatus: "mapped",
      expectedSection: "Exterior",
      expectedLabel: "Balcony Rail Count"
    },
    {
      rawKey: "Window/Door Trim Count",
      value: 85,
      expectedStatus: "mapped",
      expectedSection: "Exterior",
      expectedLabel: "Window/Door Trim Count"
    },
    {
      rawKey: "Window Wood Verticals Count",
      value: 42,
      expectedStatus: "mapped",
      expectedSection: "Exterior",
      expectedLabel: "Window Wood Verticals Count"
    },
    {
      rawKey: "Ext. Door Count",
      value: 36,
      expectedStatus: "mapped",
      expectedSection: "Exterior",
      expectedLabel: "Exterior Door Count"
    }
  ];

  test.each(testCases)(
    "$rawKey should auto-map to $expectedSection > $expectedLabel",
    ({ rawKey, value, expectedStatus, expectedSection, expectedLabel }) => {
      const resolution = resolveIntent({
        rawKey,
        valueNum: value
      });

      // Must be mapped (not unmapped or ambiguous)
      expect(resolution.status).toBe(expectedStatus);

      // Must have correct target
      expect(resolution.target).toBeDefined();
      if (resolution.target && resolution.target.type === "bidLine") {
        expect(resolution.target.section).toBe(expectedSection);
        expect(resolution.target.lineLabel).toBe(expectedLabel);
      }

      // Should have explanation
      expect(resolution.explanation).toBeDefined();
      expect(resolution.explanation).toContain("Matched rule");
    }
  );

  test("All problematic keys must map with high confidence", () => {
    let allMapped = true;
    const failures: string[] = [];

    for (const testCase of testCases) {
      const resolution = resolveIntent({
        rawKey: testCase.rawKey,
        valueNum: testCase.value
      });

      if (resolution.status !== "mapped") {
        allMapped = false;
        failures.push(`❌ "${testCase.rawKey}" failed to map (status: ${resolution.status})`);
      }
    }

    if (failures.length > 0) {
      console.log("Failed mappings:");
      failures.forEach(f => console.log(f));
    }

    expect(allMapped).toBe(true);
    expect(failures).toHaveLength(0);
  });
});

describe("Intent Normalization", () => {
  test("Debug: Garage Lid resolution", () => {
    const resolution = resolveIntent({
      rawKey: "Garage Lid",
      valueNum: 8500
    });
    console.log("Resolution status:", resolution.status);
    console.log("Normalized key:", resolution.normalizedKey);
    console.log("Unit kind:", resolution.unitKind);
    console.log("Explanation:", resolution.explanation);
    if (resolution.status === "ambiguous") {
      console.log("Candidates:", resolution.candidates);
    }
    expect(resolution.status).toBe("mapped");
  });

  test("Normalizes common abbreviations", () => {
    expect(normalizeKey("Balc. Rail Count")).toBe("balcony rail count");
    expect(normalizeKey("Ext. Door Count")).toBe("exterior door count");
    expect(normalizeKey("Cor. Wall SF")).toBe("corridor wall sf");
    expect(normalizeKey("Garage Lid")).toBe("garage ceiling");
  });

  test("Handles punctuation and spacing", () => {
    expect(normalizeKey("Window/Door Trim Count")).toBe("window door trim count");
    expect(normalizeKey("Trash Room SF")).toBe("trash room sf");
    expect(normalizeKey("Stair 1 lvls")).toBe("stair 1 levels");
  });
});