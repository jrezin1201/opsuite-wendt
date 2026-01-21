/**
 * Tests for the specific unmapped items reported by user
 */

import { resolveIntent } from "../resolve";
import { normalizeKey } from "../normalize";

describe("Unmapped Items Resolution", () => {
  describe("Items with incorrect section hints", () => {
    test("Rec Room should map to Amenity > Rec Room SF", () => {
      const resolution = resolveIntent({
        rawKey: "Rec Room",
        valueNum: 1077.12
      });

      expect(resolution.status).toBe("mapped");
      expect(resolution.target).toBeDefined();
      if (resolution.target && resolution.target.type === "bidLine") {
        expect(resolution.target.section).toBe("Amenity");
        expect(resolution.target.lineLabel).toBe("Rec Room SF");
      }
    });

    test("Cor. Lid should map to Corridors > Ceiling SF", () => {
      const resolution = resolveIntent({
        rawKey: "Cor. Lid",
        valueNum: 1357.61
      });

      console.log("Cor. Lid resolution:", resolution);

      expect(resolution.status).toBe("mapped");
      expect(resolution.target).toBeDefined();
      if (resolution.target && resolution.target.type === "bidLine") {
        expect(resolution.target.section).toBe("Corridors");
        expect(resolution.target.lineLabel).toBe("Ceiling SF");
      }
    });

    test("Unit Count should map to General > Units Count", () => {
      const resolution = resolveIntent({
        rawKey: "Unit Count",
        valueNum: 14
      });

      expect(resolution.status).toBe("mapped");
      expect(resolution.target).toBeDefined();
      if (resolution.target && resolution.target.type === "bidLine") {
        expect(resolution.target.section).toBe("General");
        expect(resolution.target.lineLabel).toBe("Units Count");
      }
    });
  });

  describe("Normalization verification", () => {
    test("Cor. Lid normalizes to corridor ceiling", () => {
      const normalized = normalizeKey("Cor. Lid");
      expect(normalized).toBe("corridor ceiling");
    });

    test("Unit Count normalizes correctly", () => {
      const normalized = normalizeKey("Unit Count");
      expect(normalized).toBe("unit count");
    });

    test("Rec Room normalizes correctly", () => {
      const normalized = normalizeKey("Rec Room");
      expect(normalized).toBe("rec room");
    });
  });
});