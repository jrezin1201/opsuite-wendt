"use client";

import { useMemo } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Input } from "@/components/ui/Input";
import { computeTotals, formatCurrency } from "@/lib/paintbid/pricing";

export function ProposalScreen() {
  const lineItems = usePaintBidStore((state) => state.lineItems);
  const pricebook = usePaintBidStore((state) => state.pricebook);
  const estimateSettings = usePaintBidStore((state) => state.estimateSettings);
  const proposalSettings = usePaintBidStore((state) => state.proposalSettings);
  const updateProposalSettings = usePaintBidStore(
    (state) => state.updateProposalSettings
  );

  const includedItems = useMemo(() => {
    return lineItems.filter((item) => item.includedInProposal);
  }, [lineItems]);

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
    return computeTotals(lineItems, estimateSettings, true);
  }, [lineItems, estimateSettings]);

  if (includedItems.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <div className="text-4xl mb-4">📄</div>
        <p>No items included in proposal. Go to &quot;Bid&quot; tab to include items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Proposal Settings */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Proposal Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Proposal Title"
            value={proposalSettings.title}
            onChange={(e) =>
              updateProposalSettings({ title: e.target.value })
            }
          />
          <Input
            label="Customer Name"
            value={proposalSettings.customerName || ""}
            onChange={(e) =>
              updateProposalSettings({ customerName: e.target.value })
            }
          />
          <Input
            label="Address"
            value={proposalSettings.address || ""}
            onChange={(e) =>
              updateProposalSettings({ address: e.target.value })
            }
          />
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Introduction Text
            </label>
            <textarea
              value={proposalSettings.introText || ""}
              onChange={(e) =>
                updateProposalSettings({ introText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Exclusions
            </label>
            <textarea
              value={proposalSettings.exclusionsText || ""}
              onChange={(e) =>
                updateProposalSettings({ exclusionsText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={proposalSettings.termsText || ""}
              onChange={(e) =>
                updateProposalSettings({ termsText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border-2 bg-white/5 text-sm text-white border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Proposal Preview */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Proposal Preview
        </h3>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {proposalSettings.title}
          </h1>
          {proposalSettings.customerName && (
            <p className="text-white/80">{proposalSettings.customerName}</p>
          )}
          {proposalSettings.address && (
            <p className="text-white/60">{proposalSettings.address}</p>
          )}
        </div>

        {/* Intro */}
        {proposalSettings.introText && (
          <div className="mb-6">
            <p className="text-white/80 text-sm leading-relaxed">
              {proposalSettings.introText}
            </p>
          </div>
        )}

        {/* Scope of Work */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            Scope of Work
          </h2>
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-md font-semibold text-purple-300 mb-2">
                  {group}
                </h3>
                <ul className="space-y-1 ml-4">
                  {items.map((item) => {
                    const pricebookItem = pricebook.find(
                      (p) => p.id === item.pricebookItemId
                    );
                    const scopeText =
                      pricebookItem?.defaultScopeText ||
                      pricebookItem?.name ||
                      item.nameOverride ||
                      "Item";

                    return (
                      <li key={item.id} className="text-white/70 text-sm">
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
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">
              Total Investment:
            </span>
            <span className="text-2xl font-bold text-white">
              {formatCurrency(total.total)}
            </span>
          </div>
        </div>

        {/* Exclusions */}
        {proposalSettings.exclusionsText && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Exclusions
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {proposalSettings.exclusionsText}
            </p>
          </div>
        )}

        {/* Terms */}
        {proposalSettings.termsText && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Terms & Conditions
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {proposalSettings.termsText}
            </p>
          </div>
        )}
      </div>

      {/* Next Step Hint */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm text-green-200">
        ✅ Preview looks good? Go to the &quot;Export&quot; tab to print or save your proposal.
      </div>
    </div>
  );
}
