/**
 * PaintBid - XLSX Parsing Utilities
 * Low-level helpers for reading Excel files with SheetJS
 */

import * as XLSX from "xlsx";

/**
 * Read a workbook from a File object
 */
export async function readWorkbook(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}

/**
 * Convert a sheet to array-of-arrays (AOA) format
 */
export function sheetToRows(
  wb: XLSX.WorkBook,
  sheetName: string
): unknown[][] {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  // Convert to AOA, preserving empty cells
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as unknown[][];
}

/**
 * Detect all sheet names in a workbook
 */
export function detectSheets(wb: XLSX.WorkBook): string[] {
  return wb.SheetNames;
}

/**
 * Safely extract a string value from a cell
 */
export function cellString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Safely extract a number value from a cell
 */
export function cellNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const num = typeof value === "number" ? value : parseFloat(String(value));
  return isNaN(num) ? null : num;
}

/**
 * Check if a row is empty (all cells are null/empty)
 */
export function isEmptyRow(row: unknown[]): boolean {
  return row.every((cell) => {
    const val = cellString(cell);
    return val === "" || val === null;
  });
}
