"use client";

import { useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { readWorkbook, sheetToRows, detectSheets } from "@/lib/paintbid/excel/xlsx";
import { parseFile2Grouped } from "@/lib/paintbid/excel/parseFile2Grouped";
import { normalizeCounts } from "@/lib/paintbid/excel/normalizeCounts";

type Step = "upload" | "review" | "complete";

export function NewImportScreen() {
  const importFile2 = usePaintBidStore((state) => state.importFile2);
  const normalizedCounts = usePaintBidStore((state) => state.normalizedCounts);

  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseFile2Grouped> | null>(null);
  const [normalized, setNormalized] = useState<ReturnType<typeof normalizeCounts> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

      const norm = normalizeCounts(parsed);
      console.log("Normalized counts:", norm);
      console.log("Normalized count keys:", Object.keys(norm));
      console.log("Non-zero values:", Object.entries(norm).filter(([k, v]) => v && v > 0));

      setParsedData(parsed);
      setNormalized(norm);
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
    if (!parsedData || !normalized) return;

    importFile2(parsedData, normalized);
    setStep("complete");
  };

  return (
    <div className="space-y-6">
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
                <p className="font-bold text-blue-900 mb-2 text-base">Import File 2 (Grouped Counts)</p>
                <p className="text-sm text-blue-800">
                  Upload the Excel file with sections like <strong>General</strong>, <strong>Corridors</strong>, <strong>Exterior</strong>, <strong>Units</strong>, etc.
                  The sheet should contain key/value counts for each section.
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
                  Click to upload Excel file
                </div>
                <div className="text-base text-gray-600 font-semibold">
                  File 2 format (.xlsx or .xls)
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
      {step === "review" && normalized && (
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
            {Object.keys(normalized).length === 0 ? (
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
                {normalized.unitsCount && (
                  <CountCard label="Units Total" value={normalized.unitsCount} unit="EA" />
                )}
                {normalized.totalSF && (
                  <CountCard label="Total SF" value={normalized.totalSF} unit="SF" />
                )}
                {normalized.corridorsWallSF && (
                  <CountCard label="Corridors Wall" value={normalized.corridorsWallSF} unit="SF" />
                )}
                {normalized.corridorsCeilingSF && (
                  <CountCard label="Corridors Ceiling" value={normalized.corridorsCeilingSF} unit="SF" />
                )}
                {normalized.corridorsDoorCount && (
                  <CountCard label="Corridor Doors" value={normalized.corridorsDoorCount} unit="EA" />
                )}
                {normalized.stairs1Levels && (
                  <CountCard label="Stair 1 Levels" value={normalized.stairs1Levels} unit="EA" />
                )}
                {normalized.stairs2Levels && (
                  <CountCard label="Stair 2 Levels" value={normalized.stairs2Levels} unit="EA" />
                )}
                {normalized.exteriorDoorCount && (
                  <CountCard label="Exterior Doors" value={normalized.exteriorDoorCount} unit="EA" />
                )}
                {normalized.parapetLF && (
                  <CountCard label="Parapet" value={normalized.parapetLF} unit="LF" />
                )}
                {normalized.stuccoSF && (
                  <CountCard label="Stucco" value={normalized.stuccoSF} unit="SF" />
                )}
                {normalized.garageWallSF && (
                  <CountCard label="Garage Walls" value={normalized.garageWallSF} unit="SF" />
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
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 max-w-lg mx-auto">
            <p className="text-brand-navy font-semibold text-base">
              📍 Next Step: Go to the <strong className="text-brand-gold">Bid Form</strong> tab to adjust difficulty levels and pricing.
            </p>
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
