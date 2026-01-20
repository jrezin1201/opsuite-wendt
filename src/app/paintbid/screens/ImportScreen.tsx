"use client";

import { useState } from "react";
import Papa from "papaparse";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import type { TakeoffRow } from "@/lib/paintbid/types";

export function ImportScreen() {
  const importTakeoff = usePaintBidStore((state) => state.importTakeoff);
  const clearTakeoff = usePaintBidStore((state) => state.clearTakeoff);
  const takeoffRows = usePaintBidStore((state) => state.takeoffRows);

  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mappings, setMappings] = useState({
    name: "",
    qty: "",
    unit: "",
    area: "",
    notes: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          alert("No data found in CSV");
          return;
        }

        setCsvData(results.data as Record<string, string>[]);
        setColumns(Object.keys(results.data[0] as object));

        // Auto-detect column mappings
        const cols = Object.keys(results.data[0] as object).map((c) => c.toLowerCase());
        setMappings({
          name: cols.find((c) => c.includes("name") || c.includes("item") || c.includes("description")) || "",
          qty: cols.find((c) => c.includes("qty") || c.includes("quantity") || c.includes("amount")) || "",
          unit: cols.find((c) => c.includes("unit")) || "",
          area: cols.find((c) => c.includes("area") || c.includes("room") || c.includes("location")) || "",
          notes: cols.find((c) => c.includes("note") || c.includes("comment")) || "",
        });
      },
      error: (error) => {
        alert(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const handleImport = () => {
    if (!mappings.name || !mappings.qty) {
      alert("Please map at least the Name and Quantity columns");
      return;
    }

    const rows: TakeoffRow[] = csvData
      .map((row, index) => {
        const qty = parseFloat(row[mappings.qty]);
        if (isNaN(qty) || qty <= 0) return null;

        return {
          id: crypto.randomUUID(),
          rawName: row[mappings.name] || `Item ${index + 1}`,
          qty,
          unit: mappings.unit ? row[mappings.unit] : undefined,
          area: mappings.area ? row[mappings.area] : undefined,
          notes: mappings.notes ? row[mappings.notes] : undefined,
          sourceRow: index + 1,
        } as TakeoffRow;
      })
      .filter((r): r is TakeoffRow => r !== null);

    if (rows.length === 0) {
      alert("No valid rows found");
      return;
    }

    importTakeoff(rows);
    setCsvData([]);
    setColumns([]);
    alert(`Imported ${rows.length} takeoff items`);
  };

  const handleClear = () => {
    if (confirm("Clear all takeoff data and line items?")) {
      clearTakeoff();
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
        <p className="font-semibold mb-2">How to import:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Upload a CSV file with your takeoff data</li>
          <li>Map the columns to the required fields</li>
          <li>Click Import to create line items</li>
        </ol>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Upload Takeoff CSV
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-white/70
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-500/20 file:text-purple-200
            hover:file:bg-purple-500/30 file:cursor-pointer
            cursor-pointer"
        />
      </div>

      {/* Column Mapping */}
      {columns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Map Columns</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/70 mb-1">
                Name Column <span className="text-red-400">*</span>
              </label>
              <select
                value={mappings.name}
                onChange={(e) => setMappings({ ...mappings, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">
                Quantity Column <span className="text-red-400">*</span>
              </label>
              <select
                value={mappings.qty}
                onChange={(e) => setMappings({ ...mappings, qty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">
                Unit Column (optional)
              </label>
              <select
                value={mappings.unit}
                onChange={(e) => setMappings({ ...mappings, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">
                Area/Room Column (optional)
              </label>
              <select
                value={mappings.area}
                onChange={(e) => setMappings({ ...mappings, area: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50"
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">
              Preview ({csvData.length} rows)
            </h4>
            <div className="overflow-x-auto max-h-64 border border-white/10 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-white/5 sticky top-0">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="py-2 px-3 text-left text-white/70 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {columns.map((col) => (
                        <td key={col} className="py-2 px-3 text-white/80">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {csvData.length > 5 && (
              <p className="text-xs text-white/50 mt-1">
                Showing first 5 of {csvData.length} rows
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleImport}>Import Takeoff</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCsvData([]);
                setColumns([]);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Current Takeoff Summary */}
      {takeoffRows.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Current Takeoff ({takeoffRows.length} items)
            </h3>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white/70">
            Takeoff imported successfully. Go to the &quot;Map&quot; tab to link items to your pricebook.
          </div>
        </div>
      )}
    </div>
  );
}
