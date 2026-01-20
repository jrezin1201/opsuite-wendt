"use client";

import { useMemo, useState } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { generateProposalFromBidForm } from "@/lib/paintbid/proposal/fromBidForm";
import { formatCurrency, computeBidFormTotals } from "@/lib/paintbid/bidform/pricing";
import { Button } from "@/components/ui/Button";
import { checkQAGate } from "@/lib/paintbid/qaGating";

type ViewMode = "edit" | "preview";

export function NewProposalScreen() {
  const bidForm = usePaintBidStore((state) => state.bidForm);
  const importReport = usePaintBidStore((state) => state.importReport);
  const qa = usePaintBidStore((state) => state.qa);
  const activeFinalId = usePaintBidStore((state) => state.activeFinalId);
  const proposalFinals = usePaintBidStore((state) => state.proposalFinals);
  const updateBidFormProject = usePaintBidStore((state) => state.updateBidFormProject);
  const updateBidFormExclusions = usePaintBidStore((state) => state.updateBidFormExclusions);
  const createProposalSnapshot = usePaintBidStore((state) => state.createProposalSnapshot);
  const setActiveFinal = usePaintBidStore((state) => state.setActiveFinal);

  const [mode, setMode] = useState<ViewMode>("edit");

  const qaGate = checkQAGate(importReport, qa);

  // Generate live proposal from current bidForm
  const liveProposal = useMemo(() => {
    if (!bidForm) return null;
    return generateProposalFromBidForm(bidForm);
  }, [bidForm]);

  // Get active finalized snapshot
  const activeFinal = proposalFinals.find((f) => f.id === activeFinalId);

  // Determine which proposal to show
  const displayProposal = mode === "preview" && activeFinal ? activeFinal.proposal : liveProposal;
  const isFinalized = mode === "preview" && activeFinal !== undefined;

  const handleFinalize = () => {
    if (!bidForm || !liveProposal) return;

    const totals = computeBidFormTotals(bidForm, true);
    const versionNumber = proposalFinals.length + 1;

    createProposalSnapshot(
      `Final v${versionNumber}`,
      liveProposal,
      {
        subtotal: totals.baseSubtotal,
        overhead: totals.overhead,
        profit: totals.profit,
        contingency: totals.contingency,
        total: totals.total,
      }
    );

    setMode("preview");
  };

  const handleEditNewVersion = () => {
    setActiveFinal(undefined);
    setMode("edit");
  };

  const handlePrint = () => {
    // Save original title
    const originalTitle = document.title;

    // Create sanitized filename from project name
    const projectName = bidForm?.project?.projectName || "Proposal";
    const sanitizedName = projectName.replace(/\s+/g, "_");
    const newTitle = `${sanitizedName}-RCWendtPainting`;

    // Set new title (this becomes the print filename)
    document.title = newTitle;

    // Print
    window.print();

    // Restore original title after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  if (!bidForm || !liveProposal) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
          <div className="text-7xl">📄</div>
        </div>
        <h3 className="text-3xl font-bold text-brand-navy mb-3">
          No Proposal Yet
        </h3>
        <p className="text-gray-700 text-lg mb-8 max-w-md mx-auto">
          Generate a bid form first to see the proposal preview
        </p>
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 max-w-lg mx-auto">
          <p className="text-brand-navy font-semibold text-base">
            📍 Go to the <strong className="text-brand-gold">Import</strong> tab to upload your File 2 Excel and generate a bid form
          </p>
        </div>
      </div>
    );
  }

  const proposal = displayProposal as ReturnType<typeof generateProposalFromBidForm>;

  return (
    <div className="space-y-6">
      {/* QA Gate Warning */}
      {!qaGate.canProceed && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 print:hidden">
          <div className="flex items-start gap-3">
            <div className="text-4xl">⛔</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">QA Review Required</h3>
              <p className="text-red-800 mb-3">
                {qaGate.reason}
              </p>
              <p className="text-sm text-red-700 mb-4">
                You must acknowledge the QA review before proceeding to finalize and print proposals.
                Go to the <strong>QA / Reconcile</strong> tab to review unmapped items.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QA Warning (gate passed but unresolved items) */}
      {qaGate.canProceed && qaGate.unresolvedCount > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 print:hidden">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                QA acknowledged with {qaGate.unresolvedCount} unresolved item(s).
                Review the QA tab if you want to resolve them before finalizing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Toggle & Action Bar */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-4 shadow-sm print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">
                {isFinalized ? "📋 Finalized Proposal" : "✏️ Draft Proposal"}
              </h3>
              <p className="text-sm text-gray-600">
                {isFinalized
                  ? `Viewing: ${activeFinal?.name} (created ${new Date(activeFinal?.createdAt || 0).toLocaleString()})`
                  : "Editing live proposal - changes apply in real-time"}
              </p>
            </div>
            {proposalFinals.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("edit")}
                  className={`px-3 py-1.5 rounded font-semibold text-sm transition-colors ${
                    mode === "edit"
                      ? "bg-brand-navy text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Edit Mode
                </button>
                <button
                  onClick={() => setMode("preview")}
                  disabled={!activeFinal}
                  className={`px-3 py-1.5 rounded font-semibold text-sm transition-colors ${
                    mode === "preview"
                      ? "bg-brand-navy text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  Preview Mode
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isFinalized ? (
              <>
                <Button
                  onClick={handlePrint}
                  className="text-base px-6 py-3"
                >
                  🖨️ Print Finalized
                </Button>
                <Button
                  onClick={handleEditNewVersion}
                  variant="secondary"
                  className="text-base px-6 py-3"
                >
                  ✏️ Edit New Version
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handlePrint}
                  variant="secondary"
                  className="text-base px-6 py-3"
                  disabled={!qaGate.canProceed}
                >
                  🖨️ Print Draft
                </Button>
                <Button
                  onClick={handleFinalize}
                  className="text-base px-6 py-3"
                  disabled={!qaGate.canProceed}
                >
                  ✅ Finalize for Print
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Finalized Proposals Dropdown (if multiple) */}
      {proposalFinals.length > 1 && mode === "preview" && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 print:hidden">
          <label className="text-sm font-semibold text-blue-900 block mb-2">
            Select Finalized Version to View:
          </label>
          <select
            value={activeFinalId || ""}
            onChange={(e) => setActiveFinal(e.target.value || undefined)}
            className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 bg-white font-semibold"
          >
            {proposalFinals.map((final) => (
              <option key={final.id} value={final.id}>
                {final.name} - {formatCurrency(final.bidTotals.total)} (
                {new Date(final.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Proposal Preview */}
      <ProposalDocument
        proposal={proposal}
        isFinalized={isFinalized}
        updateBidFormProject={updateBidFormProject}
        updateBidFormExclusions={updateBidFormExclusions}
      />
    </div>
  );
}

function ProposalDocument({
  proposal,
  isFinalized,
  updateBidFormProject,
  updateBidFormExclusions,
}: {
  proposal: ReturnType<typeof generateProposalFromBidForm>;
  isFinalized: boolean;
  updateBidFormProject: (updates: Record<string, string>) => void;
  updateBidFormExclusions: (exclusions: string[]) => void;
}) {
  return (
    <>
      <div className="bg-white border-2 border-brand-line rounded-lg shadow-lg overflow-hidden print:shadow-none print:border-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 px-8 py-8 border-b-4 border-brand-gold print:bg-brand-navy">
          <div className="flex items-start justify-between">
            <div>
              <img
                src="/logo_circle.png"
                alt="RC Wendt Painting Logo"
                className="w-24 h-24 mb-4 object-contain"
              />
              <h1 className="text-3xl font-bold text-white mb-2">
                {proposal.header.companyName}
              </h1>
              <div className="text-white/90 text-base space-y-1 font-semibold">
                {proposal.header.license && <div>{proposal.header.license}</div>}
                {proposal.header.phone && <div>{proposal.header.phone}</div>}
                {proposal.header.email && <div>{proposal.header.email}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-brand-gold text-base font-bold mb-2 uppercase tracking-wide">PROPOSAL</div>
              <div className="text-white font-mono text-sm font-semibold">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Project Info (Editable in Edit Mode) */}
        {!isFinalized && (
          <div className="px-8 py-6 border-b-2 border-brand-line bg-gray-50 print:hidden">
            <h3 className="text-lg font-bold text-brand-navy mb-4">
              Project Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Project Name</label>
                <input
                  type="text"
                  value={proposal.project.projectName || ""}
                  onChange={(e) =>
                    updateBidFormProject({ projectName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  value={proposal.project.address || ""}
                  onChange={(e) =>
                    updateBidFormProject({ address: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Developer/Client</label>
                <input
                  type="text"
                  value={proposal.project.developer || ""}
                  onChange={(e) =>
                    updateBidFormProject({ developer: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="Enter developer/client"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Contact</label>
                <input
                  type="text"
                  value={proposal.project.contact || ""}
                  onChange={(e) =>
                    updateBidFormProject({ contact: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="Enter contact"
                />
              </div>
            </div>
          </div>
        )}

        {/* Project Info (Print Only / Finalized View) */}
        <div className={isFinalized ? "px-8 py-6 border-b-2 border-gray-300" : "hidden print:block px-8 py-6 border-b-2 border-gray-300"}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Project Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {proposal.project.projectName && (
              <div>
                <div className="text-gray-600 font-semibold">Project Name</div>
                <div className="text-gray-900 font-bold">{proposal.project.projectName}</div>
              </div>
            )}
            {proposal.project.address && (
              <div>
                <div className="text-gray-600 font-semibold">Location</div>
                <div className="text-gray-900">{proposal.project.address}</div>
              </div>
            )}
            {proposal.project.developer && (
              <div>
                <div className="text-gray-600 font-semibold">Client</div>
                <div className="text-gray-900">{proposal.project.developer}</div>
              </div>
            )}
            {proposal.project.contact && (
              <div>
                <div className="text-gray-600 font-semibold">Contact</div>
                <div className="text-gray-900">{proposal.project.contact}</div>
              </div>
            )}
          </div>
        </div>

        {/* Scope of Work */}
        <div className="px-8 py-6 border-b-2 border-brand-line">
          <h2 className="text-2xl font-bold text-brand-navy mb-6 print:text-gray-900">
            Scope of Work
          </h2>
          <div className="space-y-6">
            {proposal.scopeSections.map((section, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-brand-gold">
                <h3 className="text-lg font-bold text-brand-navy mb-3 print:text-gray-900">
                  {section.title}
                </h3>
                <ul className="space-y-2 ml-5">
                  {section.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-gray-700 text-base list-disc font-medium print:text-gray-800"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="px-8 py-6 border-b-2 border-brand-line bg-gray-50">
          <h2 className="text-2xl font-bold text-brand-navy mb-6 print:text-gray-900">
            Pricing
          </h2>
          <div className="space-y-3">
            {proposal.pricing.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between py-3 border-b-2 border-gray-300"
              >
                <span className="text-gray-700 font-semibold text-base">{item.label}</span>
                <span className="font-bold text-brand-navy font-mono text-lg print:text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-4 border-t-4 border-brand-navy mt-4 print:border-gray-900">
              <span className="text-xl font-bold text-brand-navy print:text-gray-900">
                Total Contract Price
              </span>
              <span className="text-3xl font-bold text-brand-gold font-mono print:text-gray-900">
                {formatCurrency(proposal.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Add Alternates */}
        {proposal.addAlternates.length > 0 && (
          <div className="px-8 py-6 border-b-2 border-brand-line bg-blue-50">
            <h2 className="text-2xl font-bold text-brand-navy mb-4 print:text-gray-900">
              Add Alternates
            </h2>
            <p className="text-base text-gray-700 mb-4 font-semibold">
              The following items may be added to the base contract price:
            </p>
            <div className="space-y-3">
              {proposal.addAlternates.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 border-b-2 border-blue-200 bg-white rounded px-4"
                >
                  <span className="text-gray-700 font-semibold">{alt.label}</span>
                  <span className="font-bold text-brand-navy font-mono text-lg print:text-gray-900">
                    +{formatCurrency(alt.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exclusions */}
        <div className="px-8 py-6 border-b-2 border-brand-line">
          <h2 className="text-2xl font-bold text-brand-navy mb-4 print:text-gray-900">
            Exclusions
          </h2>
          <p className="text-base text-gray-700 mb-4 font-semibold">
            The following items are NOT included in this proposal:
          </p>
          <ul className="space-y-2 ml-5">
            {proposal.exclusions.map((exclusion, idx) => (
              <li
                key={idx}
                className="text-gray-700 text-base list-disc font-medium print:text-gray-800"
              >
                {exclusion}
              </li>
            ))}
          </ul>
        </div>

        {/* Terms & Conditions */}
        <div className="px-8 py-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-brand-navy mb-4 print:text-gray-900">
            Terms & Conditions
          </h2>
          <ul className="space-y-3">
            {proposal.footerNotes.map((note, idx) => (
              <li key={idx} className="text-gray-700 text-base font-medium print:text-gray-800">
                • {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Signature Block */}
        <div className="px-8 py-6 border-t-2 border-brand-line print:border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-base font-bold text-brand-navy mb-3 print:text-gray-900">
                Contractor Signature
              </div>
              <div className="border-b-2 border-gray-400 h-16 mb-3 print:border-gray-900"></div>
              <div className="text-sm text-gray-700 font-semibold">
                {proposal.header.companyName}
              </div>
              <div className="text-sm text-gray-600 mt-1">Date: _____________</div>
            </div>
            <div>
              <div className="text-base font-bold text-brand-navy mb-3 print:text-gray-900">
                Client Acceptance
              </div>
              <div className="border-b-2 border-gray-400 h-16 mb-3 print:border-gray-900"></div>
              <div className="text-sm text-gray-700 font-semibold">
                {proposal.project.developer || "Client"}
              </div>
              <div className="text-sm text-gray-600 mt-1">Date: _____________</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Exclusions Section (Edit Mode Only) */}
      {!isFinalized && (
        <div className="bg-white border-2 border-brand-line rounded-lg p-6 shadow-sm print:hidden">
          <h3 className="text-xl font-bold text-brand-navy mb-4">
            Edit Exclusions
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Modify the list of excluded items. One exclusion per line.
          </p>
          <textarea
            value={proposal.exclusions.join("\n")}
            onChange={(e) =>
              updateBidFormExclusions(
                e.target.value.split("\n").filter((line) => line.trim())
              )
            }
            className="w-full h-48 px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-mono focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Enter exclusions (one per line)"
          />
          <p className="text-sm text-gray-600 mt-3 font-semibold">
            💡 Changes apply immediately to the proposal above
          </p>
        </div>
      )}
    </>
  );
}
