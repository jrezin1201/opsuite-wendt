"use client";

import { useMemo } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { generateProposalFromBidForm } from "@/lib/paintbid/proposal/fromBidForm";
import { formatCurrency } from "@/lib/paintbid/bidform/pricing";
import { Button } from "@/components/ui/Button";

export function NewProposalScreen() {
  const bidForm = usePaintBidStore((state) => state.bidForm);
  const updateBidFormProject = usePaintBidStore((state) => state.updateBidFormProject);
  const updateBidFormExclusions = usePaintBidStore((state) => state.updateBidFormExclusions);

  const proposal = useMemo(() => {
    if (!bidForm) return null;
    return generateProposalFromBidForm(bidForm);
  }, [bidForm]);

  if (!bidForm || !proposal) {
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

  return (
    <div className="space-y-6">
      {/* Action Bar - Hidden on Print */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-4 shadow-sm flex items-center justify-between print:hidden">
        <div>
          <h3 className="text-lg font-bold text-brand-navy">Proposal Preview</h3>
          <p className="text-sm text-gray-600">Review and print your professional proposal</p>
        </div>
        <Button
          onClick={() => window.print()}
          className="text-base px-6 py-3"
        >
          🖨️ Print / Save as PDF
        </Button>
      </div>

      {/* Proposal Preview */}
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

        {/* Project Info (Editable) */}
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

        {/* Project Info (Print Only) */}
        <div className="hidden print:block px-8 py-6 border-b-2 border-gray-300">
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

      {/* Edit Exclusions Section */}
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
    </div>
  );
}
