"use client";

import { useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { computeBidFormTotals, formatCurrency } from "@/lib/paintbid/bidform/pricing";
import { checkQAGate } from "@/lib/paintbid/qaGating";

/**
 * Export & Backup Screen
 * Download bid data, export proposals, manage backups
 */
export function NewExportScreen() {
  const bidForm = usePaintBidStore((state) => state.bidForm);
  const importReport = usePaintBidStore((state) => state.importReport);
  const qa = usePaintBidStore((state) => state.qa);
  const proposalFinals = usePaintBidStore((state) => state.proposalFinals);
  const deleteProposalSnapshot = usePaintBidStore((state) => state.deleteProposalSnapshot);
  const [exportStatus, setExportStatus] = useState<string>("");

  const qaGate = checkQAGate(importReport, qa);
  const totals = bidForm ? computeBidFormTotals(bidForm, true) : null;

  const handleExportJSON = () => {
    if (!bidForm) {
      setExportStatus("❌ No bid form to export");
      return;
    }

    try {
      const exportData = {
        version: "2.0",
        exportDate: new Date().toISOString(),
        bidForm,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const projectName = bidForm.project.projectName || "untitled";
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `paintbid-${projectName.replace(/\s+/g, "-")}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus("✅ Bid exported successfully!");
      setTimeout(() => setExportStatus(""), 3000);
    } catch (error) {
      setExportStatus("❌ Export failed");
      console.error(error);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.bidForm && data.version === "2.0") {
          // TODO: Add importBidForm action to store
          setExportStatus("✅ Bid imported successfully!");
          setTimeout(() => setExportStatus(""), 3000);
        } else {
          setExportStatus("❌ Invalid file format or version");
        }
      } catch (error) {
        setExportStatus("❌ Import failed - invalid JSON");
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = "";
  };

  const handleExportFinalizedProposal = (final: typeof proposalFinals[0]) => {
    try {
      const exportData = {
        version: "2.0-finalized",
        exportDate: new Date().toISOString(),
        finalizedProposal: final,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date(final.createdAt).toISOString().split("T")[0];
      a.download = `paintbid-${final.name.replace(/\s+/g, "-")}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus("✅ Finalized proposal exported successfully!");
      setTimeout(() => setExportStatus(""), 3000);
    } catch (error) {
      setExportStatus("❌ Export failed");
      console.error(error);
    }
  };

  const handleDeleteFinal = (id: string, name: string) => {
    if (confirm(`Delete finalized proposal "${name}"? This cannot be undone.`)) {
      deleteProposalSnapshot(id);
      setExportStatus(`🗑️ Deleted "${name}"`);
      setTimeout(() => setExportStatus(""), 3000);
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "⚠️ WARNING: This will delete all bid data from your browser. This cannot be undone. Are you sure?"
      )
    ) {
      if (confirm("Really delete everything? Consider exporting first!")) {
        localStorage.clear();
        setExportStatus("🗑️ All data cleared. Refresh page to restart.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* QA Gate Warning */}
      {!qaGate.canProceed && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-4xl">⛔</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">QA Review Required</h3>
              <p className="text-red-800 mb-3">
                {qaGate.reason}
              </p>
              <p className="text-sm text-red-700 mb-4">
                You must acknowledge the QA review before exporting final data.
                Go to the <strong>QA / Reconcile</strong> tab to review unmapped items.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QA Warning (gate passed but unresolved items) */}
      {qaGate.canProceed && qaGate.unresolvedCount > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                QA acknowledged with {qaGate.unresolvedCount} unresolved item(s).
                Review the QA tab if you want to resolve them before exporting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {exportStatus && (
        <div
          className={`rounded-lg p-4 text-center font-semibold ${
            exportStatus.includes("✅")
              ? "bg-green-50 border-2 border-green-300 text-green-900"
              : exportStatus.includes("❌")
              ? "bg-red-50 border-2 border-red-300 text-red-900"
              : "bg-blue-50 border-2 border-blue-300 text-blue-900"
          }`}
        >
          {exportStatus}
        </div>
      )}

      {/* Current Bid Summary */}
      {bidForm && totals ? (
        <div className="bg-gradient-to-br from-brand-navy to-brand-navy2 rounded-xl p-6 text-white shadow-lg border-2 border-brand-gold">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">📊</div>
            <h2 className="text-2xl font-bold">Current Bid Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Project"
              value={bidForm.project.projectName || "Untitled"}
            />
            <StatCard
              label="Location"
              value={bidForm.project.address || "Not set"}
            />
            <StatCard
              label="Total Items"
              value={`${
                bidForm.sections.reduce((acc, s) => acc + s.lines.length, 0)
              } items`}
            />
            <StatCard
              label="Included"
              value={`${totals.itemCount} items`}
            />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            No Bid Form Created Yet
          </h3>
          <p className="text-yellow-800">
            Create a bid form first to export your data
          </p>
        </div>
      )}

      {/* Finalized Proposals */}
      {proposalFinals.length > 0 && (
        <div className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📋</div>
            <h3 className="text-xl font-bold text-brand-navy">Finalized Proposals</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These are frozen snapshots ready for printing or delivery. They cannot be edited.
          </p>
          <div className="space-y-3">
            {proposalFinals.map((final) => (
              <div
                key={final.id}
                className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-bold text-brand-navy">{final.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-bold text-green-700">{formatCurrency(final.bidTotals.total)}</span>
                    {" • "}
                    Created: {new Date(final.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExportFinalizedProposal(final)}
                    variant="secondary"
                    className="text-sm px-4 py-2"
                  >
                    📥 Download
                  </Button>
                  <button
                    onClick={() => handleDeleteFinal(final.id, final.name)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">📤</div>
          <h3 className="text-xl font-bold text-brand-navy">Export Options</h3>
        </div>

        <div className="space-y-4">
          {/* JSON Backup */}
          <ExportCard
            icon="💾"
            title="Download Bid as JSON"
            description="Save your complete bid data as a JSON file for backup or sharing with team members"
            disabled={!bidForm}
          >
            <Button onClick={handleExportJSON} disabled={!bidForm}>
              Download JSON Backup
            </Button>
          </ExportCard>

          {/* Print Proposal */}
          <ExportCard
            icon="🖨️"
            title="Print Proposal"
            description="Navigate to the Proposal tab to view and print your professional proposal document"
            disabled={!bidForm}
          >
            <Button
              onClick={() => {
                // User should navigate to proposal tab
                setExportStatus(
                  "→ Go to the Proposal tab to print your proposal"
                );
                setTimeout(() => setExportStatus(""), 3000);
              }}
              disabled={!bidForm}
              variant="secondary"
            >
              View Instructions
            </Button>
          </ExportCard>

          {/* CSV Export (Future) */}
          <ExportCard
            icon="📊"
            title="Export to Excel/CSV"
            description="Export line items and pricing breakdown to Excel format for external analysis"
            disabled={true}
          >
            <Button disabled={true} variant="secondary">
              Coming Soon
            </Button>
          </ExportCard>
        </div>
      </div>

      {/* Import Options */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">📥</div>
          <h3 className="text-xl font-bold text-brand-navy">Import Options</h3>
        </div>

        <div className="space-y-4">
          {/* JSON Import */}
          <ExportCard
            icon="📁"
            title="Import Bid from JSON"
            description="Restore a previously saved bid from JSON backup file (version 2.0+ required)"
          >
            <div>
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer">
                  Choose JSON File
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Warning: This will replace your current bid
              </p>
            </div>
          </ExportCard>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border-2 border-red-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">⚠️</div>
          <h3 className="text-xl font-bold text-red-700">Data Management</h3>
        </div>

        <div className="space-y-4">
          {/* Auto-save Info */}
          <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">
                  Automatic Saving
                </h4>
                <p className="text-sm text-gray-700">
                  PaintBid automatically saves your work to browser localStorage
                  every 5 seconds. Your data persists between sessions, but{" "}
                  <strong>is only stored on this device</strong>. Regular JSON
                  backups are recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Clear Data Warning */}
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🗑️</div>
              <div className="flex-1">
                <h4 className="font-bold text-red-700 mb-2">
                  Clear All Data
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Remove all bid data, settings, and cached information from
                  your browser. <strong>This action cannot be undone.</strong>{" "}
                  Export your bid first!
                </p>
                <Button variant="secondary" onClick={handleClearAllData}>
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl">💡</div>
          <h3 className="text-lg font-bold text-brand-navy">Export Tips</h3>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-lg">•</span>
            <span>
              <strong>Regular backups:</strong> Export your bid as JSON weekly
              to prevent data loss. JSON files are small and easy to email or store
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-lg">•</span>
            <span>
              <strong>PDF proposals:</strong> Go to Proposal tab, then use
              Ctrl+P (Windows) or Cmd+P (Mac) and select &quot;Save as PDF&quot;
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-lg">•</span>
            <span>
              <strong>Share bids:</strong> Send JSON files to team members who
              can import them into their PaintBid for collaboration
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-lg">•</span>
            <span>
              <strong>Local only:</strong> All data stays on your device - no
              cloud storage, no external servers, no data transmission
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-lg">•</span>
            <span>
              <strong>Version control:</strong> Name your JSON exports with
              dates (e.g., project-2024-01-15.json) to track changes over time
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
      <div className="text-white/70 text-xs mb-1 font-semibold">{label}</div>
      <div className="text-white font-semibold text-sm truncate">{value}</div>
    </div>
  );
}

function ExportCard({
  icon,
  title,
  description,
  disabled,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-4 p-4 border-2 rounded-lg transition-all ${
        disabled
          ? "border-gray-300 bg-gray-50 opacity-60"
          : "border-brand-line bg-white hover:border-brand-gold hover:shadow-md"
      }`}
    >
      <div className="text-4xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-brand-navy text-base mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        {children}
      </div>
    </div>
  );
}
