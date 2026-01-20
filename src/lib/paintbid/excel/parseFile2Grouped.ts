/**
 * PaintBid - File 2 Parser (Grouped Counts)
 * Parses the "1 Bldg" sheet with sections and key/value counts
 */

import { cellString, cellNumber, isEmptyRow } from "./xlsx";

export interface ParsedRow {
  rowIndex: number;
  sectionGuess?: string;
  key?: string;
  valueRaw?: string;
  valueNum?: number | null;
  type: "section_header" | "kv" | "blank" | "note" | "unknown";
}

export interface ParsedGroupedCounts {
  source: "file2";
  sections: Record<string, Record<string, number | string>>;
  raw: unknown[][];
  rows: ParsedRow[];  // NEW: detailed row tracking
}

// Known section headers from File 2
const KNOWN_SECTIONS = [
  "General",
  "Corridors",
  "Exterior",
  "Units",
  "Stairs",
  "Amenity",
  "Garage",
  "Landscape",
];

/**
 * Parse File 2 format (grouped counts sheet)
 */
export function parseFile2Grouped(rows: unknown[][]): ParsedGroupedCounts {
  const sections: Record<string, Record<string, number | string>> = {};
  const parsedRows: ParsedRow[] = [];
  let currentSection: string | null = null;

  console.log("🔍 parseFile2Grouped: Starting to parse", rows.length, "rows");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Skip empty rows
    if (isEmptyRow(row)) {
      parsedRows.push({
        rowIndex: i,
        type: "blank",
      });
      continue;
    }

    const col0 = cellString(row[0]);
    const col1 = cellString(row[1]);
    const col2 = cellString(row[2]);

    console.log(`Row ${i}: [${col0}] [${col1}] [${col2}]`);

    // Check if this is a section header
    if (isSectionHeader(col0, col1)) {
      currentSection = col0;
      sections[currentSection] = {};
      parsedRows.push({
        rowIndex: i,
        sectionGuess: currentSection,
        key: col0,
        type: "section_header",
      });
      console.log(`  ✓ Found section header: "${currentSection}"`);
      continue;
    }

    // If we have a current section, parse as key/value row
    if (currentSection) {
      // Try two formats:
      // Format 1: Key in col0, value in col1 or col2
      // Format 2: Empty col0, key in col1, value in col2

      let key: string | null = null;
      let value: number | string | null = null;
      let valueNum: number | null = null;

      if (col0) {
        // Format 1: Key in column A
        key = col0;
        const num1 = cellNumber(row[1]);
        const num2 = cellNumber(row[2]);

        if (num1 !== null) {
          value = num1;
          valueNum = num1;
        } else if (num2 !== null) {
          value = num2;
          valueNum = num2;
        } else {
          value = col1 || col2;
        }
      } else if (col1) {
        // Format 2: Key in column B (col0 is empty)
        key = col1;
        const num2 = cellNumber(row[2]);

        if (num2 !== null) {
          value = num2;
          valueNum = num2;
        } else {
          value = col2;
        }
      }

      if (key && value !== null) {
        console.log(`  → Adding to ${currentSection}: "${key}" = ${value}`);
        sections[currentSection][key] = value;
        parsedRows.push({
          rowIndex: i,
          sectionGuess: currentSection,
          key,
          valueRaw: String(value),
          valueNum,
          type: "kv",
        });
      } else {
        console.log(`  ⊗ Skipped (key="${key}", value="${value}")`);
        parsedRows.push({
          rowIndex: i,
          sectionGuess: currentSection,
          key: key || undefined,
          valueRaw: col1 || col2 || undefined,
          type: key ? "note" : "unknown",
        });
      }
    } else {
      console.log(`  ⊗ Skipped (no current section)`);
      parsedRows.push({
        rowIndex: i,
        key: col0 || col1 || undefined,
        valueRaw: col2 || col1 || undefined,
        type: "unknown",
      });
    }
  }

  return {
    source: "file2",
    sections,
    raw: rows,
    rows: parsedRows,
  };
}

/**
 * Check if a row looks like a section header
 */
function isSectionHeader(col0: string, col1: string): boolean {
  if (!col0) return false;

  // Check if it's a known section name
  if (KNOWN_SECTIONS.includes(col0)) {
    return true;
  }

  // Or if col1 is empty/contains "Notes" and col0 looks like a title
  if (!col1 || col1.toLowerCase().includes("note")) {
    // Check if col0 is TitleCase (starts with uppercase)
    return /^[A-Z]/.test(col0);
  }

  return false;
}
