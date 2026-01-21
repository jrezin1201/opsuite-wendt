"use client";

import { useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { readWorkbook, sheetToRows, detectSheets } from "@/lib/paintbid/excel/xlsx";
import { parseFile2Grouped } from "@/lib/paintbid/excel/parseFile2Grouped";
import { normalizeCounts } from "@/lib/paintbid/excel/normalizeCounts";
import { improvedNormalizeCounts } from "@/lib/paintbid/excel/improvedNormalizeCounts";
import { enhancedNormalizeCounts } from "@/lib/paintbid/excel/enhancedNormalizeCounts";
import { normalizeWithIntent } from "@/lib/paintbid/intent/normalizeWithIntent";
import { processMixedFormat } from "@/lib/paintbid/excel/mixedFormatNormalization";
import { buildImportReport } from "@/lib/paintbid/excel/buildImportReport";
import type { ImportReport } from "@/lib/paintbid/types";

type Step = "upload" | "review" | "complete";

interface NewImportScreenProps {
  onNavigateToBidForm?: () => void;
}

export function NewImportScreen({ onNavigateToBidForm }: NewImportScreenProps) {
  const importFile2 = usePaintBidStore((state) => state.importFile2);
  const setImportReport = usePaintBidStore((state) => state.setImportReport);
  const storedImportReport = usePaintBidStore((state) => state.importReport);
  const normalizedCounts = usePaintBidStore((state) => state.normalizedCounts);

  // Use persisted data if available
  const [step, setStep] = useState<Step>(storedImportReport ? "complete" : "upload");
  const [fileName, setFileName] = useState<string>("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseFile2Grouped> | null>(null);
  const [normalized, setNormalized] = useState<ReturnType<typeof normalizeCounts> | null>(null);
  const [importReport, setLocalImportReport] = useState<ImportReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [useImproved, setUseImproved] = useState(true); // Toggle for improved vs original normalization

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);
    setIsLoading(true);
    setError("");

    try {
      setFileName(file.name);

      console.log("Reading workbook...");
      const wb = await readWorkbook(file);
      console.log("Workbook read successfully", wb);

      const detectedSheets = detectSheets(wb);
      console.log("Detected sheets:", detectedSheets);
      setSheets(detectedSheets);

      if (detectedSheets.length === 0) {
        throw new Error("No sheets found in the Excel file");
      }

      // Auto-select first sheet or "1 Bldg" if exists
      const defaultSheet =
        detectedSheets.find((s) => s.includes("Bldg")) || detectedSheets[0];
      setSelectedSheet(defaultSheet);
      console.log("Selected sheet:", defaultSheet);

      // Parse the sheet
      console.log("Parsing sheet data...");
      const rows = sheetToRows(wb, defaultSheet);
      console.log("Rows extracted:", rows.length);

      const parsed = parseFile2Grouped(rows);
      console.log("Parsed data:", parsed);
      console.log("Parsed sections:", Object.keys(parsed.sections));
      Object.entries(parsed.sections).forEach(([sectionName, sectionData]) => {
        console.log(`  ${sectionName}:`, sectionData);
      });

      // Use mixed format processor that handles both key-value and classification/UOM
      let normResult;

      try {
        // Process mixed format (handles both types in single file)
        console.log("Processing with mixed format handler...");
        normResult = processMixedFormat(rows, parsed);
        console.log(`Mixed format processing complete: ${normResult.mapped.length} mapped, ${normResult.unmapped.length} unmapped`);
      } catch (e) {
        console.log("Mixed format processing failed, falling back:", e);

        // Fall back to intent-based normalization
        try {
          console.log("Using intent-based normalization as fallback");
          normResult = normalizeWithIntent(parsed);

          // Store intent mappings if available
          if ('intentMappings' in normResult && normResult.intentMappings.size > 0) {
            console.log(`Intent resolver mapped ${normResult.intentMappings.size} items to bid form lines`);
          }
        } catch (e2) {
          console.log("Intent resolver also failed, using basic normalization:", e2);
          // Final fallback
          normResult = useImproved
            ? improvedNormalizeCounts(parsed)
            : normalizeCounts(parsed);
        }
      }

      if (normResult) {
        console.log("Normalized result (improved=" + useImproved + "):", normResult);
        console.log("Normalized count keys:", Object.keys(normResult.counts));
        console.log("Mapped:", normResult.mapped.length, "Unmapped:", normResult.unmapped.length);
        if ('confidence' in normResult && typeof normResult.confidence === 'number') {
          console.log("Mapping confidence:", (normResult.confidence * 100).toFixed(1) + "%");
        }
      } else {
        throw new Error("Failed to normalize data");
      }

      // Build ImportReport
      const report = buildImportReport({
        counts: normResult!.counts,
        mapped: normResult!.mapped,
        unmapped: normResult!.unmapped,
        sources: {
          file2: { filename: file.name, sheet: defaultSheet },
        },
      });
      console.log("ImportReport generated:", report);

      setParsedData(parsed);
      setNormalized(normResult!);
      setLocalImportReport(report);
      setStep("review");
    } catch (error) {
      console.error("Error reading file:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      alert(`❌ Error reading file: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!parsedData || !normalized || !importReport) return;

    // Save counts to store
    importFile2(parsedData, normalized.counts);

    // Save import report to store
    setImportReport(importReport);

    setStep("complete");
  };

  return (
    <div className="space-y-6">
      {/* Smart Mapping Toggle */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-yellow-900">Smart Mapping</h3>
              <p className="text-sm text-yellow-800">
                Use improved pattern matching to reduce unmapped items by up to 80%
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useImproved}
              onChange={(e) => setUseImproved(e.target.checked)}
              className="w-5 h-5 rounded border-yellow-400 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="font-bold text-yellow-900">Enabled</span>
          </label>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        <StepIndicator active={step === "upload"} completed={step !== "upload"} number={1} label="Upload File" />
        <div className="flex-1 h-0.5 bg-brand-line" />
        <StepIndicator active={step === "review"} completed={step === "complete"} number={2} label="Review Counts" />
        <div className="flex-1 h-0.5 bg-brand-line" />
        <StepIndicator active={step === "complete"} completed={false} number={3} label="Generate Bid" />
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <p className="font-bold text-blue-900 mb-2 text-base">Expected Excel Format</p>
                <p className="text-sm text-blue-800">
                  Upload your takeoff Excel file with sections like <strong>General</strong>, <strong>Corridors</strong>, <strong>Exterior</strong>, <strong>Units</strong>, etc.
                  The sheet should contain key/value counts for each section (e.g., &ldquo;Wall SF: 1500&rdquo;, &ldquo;Doors: 12&rdquo;).
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 shadow-sm animate-pulse">
              <div className="flex items-start gap-3">
                <div className="text-3xl">❌</div>
                <div>
                  <p className="font-bold text-red-900 mb-2 text-base">Error Reading File</p>
                  <p className="text-sm text-red-800">{error}</p>
                  <p className="text-xs text-red-700 mt-2">Check the browser console (F12) for more details.</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="border-4 border-dashed border-brand-navy bg-gradient-to-br from-blue-50 to-white rounded-xl p-16 text-center">
              <div className="text-7xl mb-6 animate-bounce">⏳</div>
              <div className="text-brand-navy font-bold text-xl mb-2">
                Processing Excel file...
              </div>
              <div className="text-base text-gray-600 font-semibold">
                Reading and parsing your data
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-dashed border-brand-gold bg-gradient-to-br from-gray-50 to-white rounded-xl p-16 text-center hover:border-brand-navy transition-all duration-300 hover:shadow-lg">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex flex-col items-center ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <div className="text-7xl mb-6">📥</div>
                <div className="text-brand-navy font-bold text-xl mb-2">
                  Upload Your Takeoff Excel File
                </div>
                <div className="text-base text-gray-600 font-semibold">
                  Excel file with project counts (.xlsx or .xls)
                </div>
                <div className="mt-4 px-6 py-3 bg-brand-gold text-brand-navy rounded-lg font-bold hover:bg-brand-gold2 transition-colors">
                  Choose File
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Review */}
      {step === "review" && normalized && importReport && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brand-navy">
                Review Imported Counts
              </h3>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                File: <span className="text-brand-navy">{fileName}</span> • Sheet: <span className="text-brand-navy">{selectedSheet}</span>
              </p>
            </div>
            <Button variant="secondary" onClick={() => setStep("upload")}>
              Upload Different File
            </Button>
          </div>

          {/* Import Report Summary */}
          <div className={`border-2 rounded-lg p-6 ${
            importReport.summary.confidence === "high"
              ? "bg-green-50 border-green-300"
              : importReport.summary.confidence === "medium"
              ? "bg-yellow-50 border-yellow-300"
              : "bg-red-50 border-red-300"
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-4xl">
                {importReport.summary.confidence === "high" ? "✅" : importReport.summary.confidence === "medium" ? "⚠️" : "❌"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-bold text-lg">
                    Import Confidence: <span className="uppercase">{importReport.summary.confidence}</span>
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-600">Parsed</div>
                    <div className="text-2xl font-bold">{importReport.summary.parsedRows}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">Mapped</div>
                    <div className="text-2xl font-bold text-green-600">{importReport.summary.mappedRows}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">Unmapped</div>
                    <div className="text-2xl font-bold text-red-600">{importReport.summary.unmappedRows}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">Ignored</div>
                    <div className="text-2xl font-bold text-gray-400">{importReport.summary.ignoredRows}</div>
                  </div>
                </div>
                {importReport.summary.unmappedRows > 0 && (
                  <div className="mt-4 p-3 bg-white rounded border border-current">
                    <p className="text-sm font-semibold">
                      ⚠️ {importReport.summary.unmappedRows} row(s) could not be automatically mapped.
                      Review the unmapped items below or proceed to the QA tab after generating the bid.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Unmapped Items (if any) */}
          {importReport.unmapped.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Unmapped Items ({importReport.unmapped.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {importReport.unmapped.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border border-yellow-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {item.sectionGuess && (
                            <span className="text-blue-600">[{item.sectionGuess}]</span>
                          )}{" "}
                          {item.key}
                          {item.valueNum !== null && item.valueNum !== undefined && (
                            <span className="text-gray-600 ml-2">= {item.valueNum}</span>
                          )}
                        </div>
                        {item.suggestions && item.suggestions.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Suggestions: {item.suggestions.map(s => s.label).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Row {item.rowIndex !== undefined ? item.rowIndex + 1 : "?"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug: Raw Parsed Sections */}
          {parsedData && (
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-xs">
              <h4 className="font-bold text-gray-900 mb-2">🔍 Debug: Raw Excel Data</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(parsedData.sections).map(([sectionName, sectionData]) => (
                  <div key={sectionName}>
                    <strong className="text-blue-700">{sectionName}:</strong>
                    <pre className="text-gray-700 ml-4">{JSON.stringify(sectionData, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(normalized.counts).length === 0 ? (
              <div className="col-span-full bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h4 className="font-bold text-yellow-900 mb-2">No Counts Found</h4>
                <p className="text-sm text-yellow-800">
                  The Excel file was read, but no recognized data was found.
                  Check the debug section above to see what was extracted.
                </p>
              </div>
            ) : (
              <>
                {normalized.counts.unitsCount && (
                  <CountCard label="Units Total" value={normalized.counts.unitsCount} unit="EA" />
                )}
                {normalized.counts.totalSF && (
                  <CountCard label="Total SF" value={normalized.counts.totalSF} unit="SF" />
                )}
                {normalized.counts.corridorsWallSF && (
                  <CountCard label="Corridors Wall" value={normalized.counts.corridorsWallSF} unit="SF" />
                )}
                {normalized.counts.corridorsCeilingSF && (
                  <CountCard label="Corridors Ceiling" value={normalized.counts.corridorsCeilingSF} unit="SF" />
                )}
                {normalized.counts.corridorsDoorCount && (
                  <CountCard label="Corridor Doors" value={normalized.counts.corridorsDoorCount} unit="EA" />
                )}
                {normalized.counts.stairs1Levels && (
                  <CountCard label="Stair 1 Levels" value={normalized.counts.stairs1Levels} unit="EA" />
                )}
                {normalized.counts.stairs2Levels && (
                  <CountCard label="Stair 2 Levels" value={normalized.counts.stairs2Levels} unit="EA" />
                )}
                {normalized.counts.exteriorDoorCount && (
                  <CountCard label="Exterior Doors" value={normalized.counts.exteriorDoorCount} unit="EA" />
                )}
                {normalized.counts.parapetLF && (
                  <CountCard label="Parapet" value={normalized.counts.parapetLF} unit="LF" />
                )}
                {normalized.counts.stuccoSF && (
                  <CountCard label="Stucco" value={normalized.counts.stuccoSF} unit="SF" />
                )}
                {normalized.counts.garageWallSF && (
                  <CountCard label="Garage Walls" value={normalized.counts.garageWallSF} unit="SF" />
                )}
              </>
            )}
          </div>

          <div className="flex gap-3 pt-6">
            <Button onClick={handleGenerate} className="flex-1 text-lg py-4">
              ✨ Generate Bid Form from These Counts
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === "complete" && (
        <div className="text-center py-16">
          <div className="bg-green-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <div className="text-7xl">✅</div>
          </div>
          <h3 className="text-3xl font-bold text-brand-navy mb-3">
            Bid Form Generated!
          </h3>
          <p className="text-gray-700 text-lg mb-8 max-w-md mx-auto">
            All quantities have been imported and applied to the bid form.
          </p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 max-w-lg mx-auto mb-6">
            <p className="text-brand-navy font-semibold text-base mb-4">
              📍 Next Step: Go to the <strong className="text-brand-gold">Bid Form</strong> tab to adjust difficulty levels and pricing.
            </p>
            {onNavigateToBidForm && (
              <Button
                onClick={onNavigateToBidForm}
                className="w-full text-lg py-3"
              >
                💰 Go to Bid Form →
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({
  active,
  completed,
  number,
  label,
}: {
  active: boolean;
  completed: boolean;
  number: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all ${
          completed
            ? "bg-brand-gold text-white shadow-lg scale-110"
            : active
            ? "bg-brand-navy text-white shadow-md scale-105"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? "✓" : number}
      </div>
      <div
        className={`text-sm mt-2 font-semibold ${
          active ? "text-brand-navy" : "text-gray-500"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function CountCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-white border-2 border-brand-line rounded-lg p-5 shadow-sm hover:border-brand-gold hover:shadow-md transition-all">
      <div className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-brand-navy">
          {value.toLocaleString()}
        </div>
        <div className="text-base text-gray-700 font-semibold">{unit}</div>
      </div>
    </div>
  );
}
