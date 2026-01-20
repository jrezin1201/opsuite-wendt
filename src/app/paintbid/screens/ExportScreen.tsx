"use client";

import { useMemo, useRef } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { exportState, importState } from "@/lib/paintbid/storage";
import { computeTotals, formatCurrency } from "@/lib/paintbid/pricing";

export function ExportScreen() {
  const store = usePaintBidStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const includedItems = useMemo(() => {
    return store.lineItems.filter((item) => item.includedInProposal);
  }, [store.lineItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof includedItems> = {};
    includedItems.forEach((item) => {
      const group = item.group || "General";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });
    return groups;
  }, [includedItems]);

  const total = useMemo(() => {
    return computeTotals(store.lineItems, store.estimateSettings, true);
  }, [store.lineItems, store.estimateSettings]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const json = exportState({
      pricebook: store.pricebook,
      mappings: store.mappings,
      takeoffRows: store.takeoffRows,
      lineItems: store.lineItems,
      estimateSettings: store.estimateSettings,
      proposalSettings: store.proposalSettings,
      lastSavedAt: Date.now(),
    });

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paintbid-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const imported = importState(json);
        store.importData(imported);
        alert("Project imported successfully!");
      } catch (error) {
        alert(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This cannot be undone. Consider exporting first."
      )
    ) {
      if (confirm("Really reset? All pricebook, takeoff, and line items will be deleted.")) {
        store.reset();
        alert("All data has been reset.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handlePrint}>
          🖨️ Print / Save as PDF
        </Button>
        <Button variant="secondary" onClick={handleExportJSON}>
          💾 Export Project JSON
        </Button>
        <Button variant="secondary" onClick={handleImportJSON}>
          📁 Import Project JSON
        </Button>
        <Button variant="danger" onClick={handleReset}>
          🗑️ Reset All Data
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Print-Friendly Proposal */}
      <div className="print:block">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 print:bg-white print:text-black print:border-0">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white print:text-black mb-2">
              {store.proposalSettings.title}
            </h1>
            {store.proposalSettings.customerName && (
              <p className="text-lg text-white/80 print:text-gray-700">
                {store.proposalSettings.customerName}
              </p>
            )}
            {store.proposalSettings.address && (
              <p className="text-white/60 print:text-gray-600">
                {store.proposalSettings.address}
              </p>
            )}
            <p className="text-sm text-white/50 print:text-gray-500 mt-2">
              {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction */}
          {store.proposalSettings.introText && (
            <div className="mb-8">
              <p className="text-white/80 print:text-gray-700 leading-relaxed">
                {store.proposalSettings.introText}
              </p>
            </div>
          )}

          {/* Scope of Work */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white print:text-black mb-4 pb-2 border-b border-white/20 print:border-gray-300">
              Scope of Work
            </h2>
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([group, items]) => (
                <div key={group}>
                  <h3 className="text-lg font-semibold text-purple-300 print:text-purple-700 mb-3">
                    {group}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {items.map((item) => {
                      const pricebookItem = store.pricebook.find(
                        (p) => p.id === item.pricebookItemId
                      );
                      const scopeText =
                        pricebookItem?.defaultScopeText ||
                        pricebookItem?.name ||
                        item.nameOverride ||
                        "Item";

                      return (
                        <li
                          key={item.id}
                          className="text-white/70 print:text-gray-700"
                        >
                          • {item.qty} {item.unit} — {scopeText}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mb-8 p-6 bg-purple-500/10 print:bg-purple-50 border border-purple-500/20 print:border-purple-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white print:text-black">
                Total Investment:
              </span>
              <span className="text-3xl font-bold text-white print:text-purple-700">
                {formatCurrency(total.total)}
              </span>
            </div>
          </div>

          {/* Exclusions */}
          {store.proposalSettings.exclusionsText && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white print:text-black mb-3 pb-2 border-b border-white/20 print:border-gray-300">
                Exclusions
              </h2>
              <p className="text-white/70 print:text-gray-700 leading-relaxed">
                {store.proposalSettings.exclusionsText}
              </p>
            </div>
          )}

          {/* Terms */}
          {store.proposalSettings.termsText && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white print:text-black mb-3 pb-2 border-b border-white/20 print:border-gray-300">
                Terms & Conditions
              </h2>
              <p className="text-white/70 print:text-gray-700 leading-relaxed">
                {store.proposalSettings.termsText}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-white/20 print:border-gray-300 text-center text-sm text-white/50 print:text-gray-500">
            <p>Generated by PaintBid POC</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="print:hidden bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
        <p className="font-semibold mb-2">Export Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Print/PDF:</strong> Click &quot;Print / Save as PDF&quot; and use your browser&apos;s print dialog to save as PDF
          </li>
          <li>
            <strong>Backup:</strong> Export Project JSON to save all data (pricebook, takeoff, line items, settings)
          </li>
          <li>
            <strong>Restore:</strong> Import a previously exported JSON file to restore a project
          </li>
          <li>
            <strong>Reset:</strong> Clear all data to start fresh (use with caution!)
          </li>
        </ul>
      </div>

      {/* Stats */}
      <div className="print:hidden grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {store.pricebook.length}
          </div>
          <div className="text-sm text-white/60">Pricebook Items</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {store.lineItems.length}
          </div>
          <div className="text-sm text-white/60">Line Items</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {includedItems.length}
          </div>
          <div className="text-sm text-white/60">Included in Proposal</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {Object.keys(store.mappings).length}
          </div>
          <div className="text-sm text-white/60">Saved Mappings</div>
        </div>
      </div>
    </div>
  );
}
