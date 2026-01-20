/**
 * PaintBid - OCR Validator
 * Uses Tesseract.js to extract text from screenshots and cross-check with Excel data
 */

import Tesseract from "tesseract.js";
import type { ImportReport } from "../types";
import type { NormalizedCounts } from "./normalizeCounts";

export interface OCRExtractedPair {
  key: string;
  valueNum?: number | null;
}

export interface OCRValidatorResult {
  enabled: boolean;
  ocrTextChars: number;
  extractedPairs: OCRExtractedPair[];
  diffs: Array<{
    key: string;
    type: "screenshot_only" | "excel_only" | "mismatch";
    excelValue?: number;
    screenshotValue?: number;
    deltaPct?: number;
  }>;
}

/**
 * Run OCR on screenshot and extract key/value pairs
 */
export async function runOCRValidation(
  screenshotFile: File,
  excelCounts: NormalizedCounts,
  mapped: ImportReport["mapped"]
): Promise<OCRValidatorResult> {
  console.log("🔍 Starting OCR validation on screenshot:", screenshotFile.name);

  // Run Tesseract OCR
  const { data: { text } } = await Tesseract.recognize(
    screenshotFile,
    "eng",
    {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    }
  );

  console.log("✅ OCR complete. Extracted text length:", text.length);

  // Extract key/value pairs from OCR text
  const extractedPairs = extractKeyValuePairs(text);
  console.log("📊 Extracted pairs:", extractedPairs.length);

  // Compare with Excel data
  const diffs = compareWithExcel(extractedPairs, excelCounts, mapped);
  console.log("⚠️ Found diffs:", diffs.length);

  return {
    enabled: true,
    ocrTextChars: text.length,
    extractedPairs,
    diffs,
  };
}

/**
 * Extract key/value pairs from OCR text
 * Looks for patterns like "Units Total: 120" or "Wall SF: 5000"
 */
function extractKeyValuePairs(text: string): OCRExtractedPair[] {
  const pairs: OCRExtractedPair[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    // Match patterns like "Key: 123" or "Key 123" or "Key = 123"
    const match = line.match(/^(.+?)[\s:=]+(\d+(?:,\d{3})*(?:\.\d+)?)$/);
    if (match) {
      const key = match[1].trim();
      const valueStr = match[2].replace(/,/g, ""); // Remove commas
      const valueNum = parseFloat(valueStr);

      if (!isNaN(valueNum)) {
        pairs.push({ key, valueNum });
      }
    }
  }

  return pairs;
}

/**
 * Compare OCR extracted pairs with Excel data
 */
function compareWithExcel(
  ocrPairs: OCRExtractedPair[],
  excelCounts: NormalizedCounts,
  mapped: ImportReport["mapped"]
): OCRValidatorResult["diffs"] {
  const diffs: OCRValidatorResult["diffs"] = [];

  // Create map of Excel keys to values
  const excelMap = new Map<string, number>();
  for (const item of mapped) {
    excelMap.set(item.key.toLowerCase(), item.valueNum);
  }

  // Create map of OCR keys to values
  const ocrMap = new Map<string, number>();
  for (const pair of ocrPairs) {
    ocrMap.set(pair.key.toLowerCase(), pair.valueNum || 0);
  }

  // Find screenshot-only items (in OCR but not in Excel)
  for (const [ocrKey, ocrValue] of ocrMap.entries()) {
    if (!excelMap.has(ocrKey)) {
      // Try fuzzy match
      const fuzzyMatch = findFuzzyMatch(ocrKey, Array.from(excelMap.keys()));
      if (!fuzzyMatch) {
        diffs.push({
          key: ocrKey,
          type: "screenshot_only",
          screenshotValue: ocrValue,
        });
      }
    }
  }

  // Find excel-only items (in Excel but not in OCR)
  for (const [excelKey, excelValue] of excelMap.entries()) {
    if (!ocrMap.has(excelKey)) {
      // Try fuzzy match
      const fuzzyMatch = findFuzzyMatch(excelKey, Array.from(ocrMap.keys()));
      if (!fuzzyMatch) {
        diffs.push({
          key: excelKey,
          type: "excel_only",
          excelValue,
        });
      }
    }
  }

  // Find mismatches (in both but different values)
  for (const [ocrKey, ocrValue] of ocrMap.entries()) {
    const excelValue = excelMap.get(ocrKey);
    if (excelValue !== undefined && excelValue !== ocrValue) {
      const deltaPct = Math.abs((excelValue - ocrValue) / excelValue) * 100;
      diffs.push({
        key: ocrKey,
        type: "mismatch",
        excelValue,
        screenshotValue: ocrValue,
        deltaPct: Math.round(deltaPct * 10) / 10,
      });
    }
  }

  return diffs;
}

/**
 * Simple fuzzy match (token overlap)
 */
function findFuzzyMatch(query: string, candidates: string[]): string | null {
  const queryTokens = new Set(query.toLowerCase().split(/\s+/));

  for (const candidate of candidates) {
    const candidateTokens = new Set(candidate.toLowerCase().split(/\s+/));
    const overlap = Array.from(queryTokens).filter((t) => candidateTokens.has(t)).length;
    const similarity = overlap / Math.max(queryTokens.size, candidateTokens.size);

    if (similarity > 0.8) {
      return candidate;
    }
  }

  return null;
}
