"use client";

import { useState, useMemo } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { computeLine, computeTotals, formatCurrency, formatPercent } from "@/lib/paintbid/pricing";
import type { Complexity, LineItemToggles } from "@/lib/paintbid/types";

export function BidScreen() {
  const lineItems = usePaintBidStore((state) => state.lineItems);
  const pricebook = usePaintBidStore((state) => state.pricebook);
  const estimateSettings = usePaintBidStore((state) => state.estimateSettings);
  const updateLineItem = usePaintBidStore((state) => state.updateLineItem);
  const setLineItemComplexity = usePaintBidStore((state) => state.setLineItemComplexity);
  const setLineItemToggles = usePaintBidStore((state) => state.setLineItemToggles);
  const setLineItemIncluded = usePaintBidStore((state) => state.setLineItemIncluded);
  const updateEstimateSettings = usePaintBidStore((state) => state.updateEstimateSettings);

  const [showOnlyIncluded, setShowOnlyIncluded] = useState(false);
  const [showUnmappedOnly, setShowUnmappedOnly] = useState(false);

  const filteredItems = useMemo(() => {
    let items = lineItems;
    if (showOnlyIncluded) {
      items = items.filter((item) => item.includedInProposal);
    }
    if (showUnmappedOnly) {
      items = items.filter((item) => !item.pricebookItemId || item.baseUnitPrice === 0);
    }
    return items;
  }, [lineItems, showOnlyIncluded, showUnmappedOnly]);

  const totals = useMemo(() => {
    return computeTotals(lineItems, estimateSettings, false);
  }, [lineItems, estimateSettings]);

  const proposalTotals = useMemo(() => {
    return computeTotals(lineItems, estimateSettings, true);
  }, [lineItems, estimateSettings]);

  if (lineItems.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <div className="text-4xl mb-4">💰</div>
        <p>No line items yet. Import a takeoff to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Button
          variant={showOnlyIncluded ? "primary" : "secondary"}
          onClick={() => setShowOnlyIncluded(!showOnlyIncluded)}
          size="sm"
        >
          {showOnlyIncluded ? "Show All" : "Show Included Only"}
        </Button>
        <Button
          variant={showUnmappedOnly ? "primary" : "secondary"}
          onClick={() => setShowUnmappedOnly(!showUnmappedOnly)}
          size="sm"
        >
          {showUnmappedOnly ? "Show All" : "Show Unmapped Only"}
        </Button>
      </div>

      {/* Estimate Settings */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Estimate Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Input
            label="Contingency %"
            type="number"
            step="0.01"
            value={estimateSettings.contingencyPct * 100}
            onChange={(e) =>
              updateEstimateSettings({
                contingencyPct: parseFloat(e.target.value) / 100 || 0,
              })
            }
          />
          <Input
            label="Overhead %"
            type="number"
            step="0.01"
            value={estimateSettings.overheadPct * 100}
            onChange={(e) =>
              updateEstimateSettings({
                overheadPct: parseFloat(e.target.value) / 100 || 0,
              })
            }
          />
          <Input
            label="Profit %"
            type="number"
            step="0.01"
            value={estimateSettings.profitPct * 100}
            onChange={(e) =>
              updateEstimateSettings({
                profitPct: parseFloat(e.target.value) / 100 || 0,
              })
            }
          />
          <Input
            label="Tax %"
            type="number"
            step="0.01"
            value={(estimateSettings.taxPct || 0) * 100}
            onChange={(e) =>
              updateEstimateSettings({
                taxPct: parseFloat(e.target.value) / 100 || 0,
              })
            }
          />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-2 text-left text-white/70 font-semibold">✓</th>
              <th className="py-2 px-2 text-left text-white/70 font-semibold">Item</th>
              <th className="py-2 px-2 text-right text-white/70 font-semibold">Qty</th>
              <th className="py-2 px-2 text-right text-white/70 font-semibold">Unit Price</th>
              <th className="py-2 px-2 text-center text-white/70 font-semibold">Complexity</th>
              <th className="py-2 px-2 text-center text-white/70 font-semibold">Toggles</th>
              <th className="py-2 px-2 text-right text-white/70 font-semibold">Mult</th>
              <th className="py-2 px-2 text-right text-white/70 font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const pricebookItem = pricebook.find((p) => p.id === item.pricebookItemId);
              const pricing = computeLine(item);
              const isUnmapped = !item.pricebookItemId || item.baseUnitPrice === 0;

              return (
                <tr
                  key={item.id}
                  className={`border-b border-white/5 ${
                    !item.includedInProposal ? "opacity-50" : ""
                  } ${isUnmapped ? "bg-red-500/10" : ""}`}
                >
                  {/* Included Checkbox */}
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      checked={item.includedInProposal}
                      onChange={(e) =>
                        setLineItemIncluded(item.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-400/30 cursor-pointer"
                    />
                  </td>

                  {/* Item Name */}
                  <td className="py-2 px-2">
                    <div className="text-white">
                      {pricebookItem?.name || item.nameOverride || "Unmapped"}
                    </div>
                    {item.group && (
                      <div className="text-xs text-purple-300">{item.group}</div>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="py-2 px-2 text-right text-white/80">{item.qty}</td>

                  {/* Unit Price */}
                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      step="0.01"
                      value={item.baseUnitPrice}
                      onChange={(e) =>
                        updateLineItem(item.id, {
                          baseUnitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 rounded border bg-white/5 text-white text-sm text-right border-white/10 focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </td>

                  {/* Complexity */}
                  <td className="py-2 px-2">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((c) => (
                        <button
                          key={c}
                          onClick={() => setLineItemComplexity(item.id, c as Complexity)}
                          className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                            item.complexity === c
                              ? "bg-purple-500 text-white"
                              : "bg-white/10 text-white/50 hover:bg-white/20"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Toggles */}
                  <td className="py-2 px-2">
                    <div className="flex justify-center gap-1">
                      {[
                        { key: "highAccess", icon: "⬆️", title: "High Access" },
                        { key: "occupied", icon: "🏠", title: "Occupied" },
                        { key: "heavyMasking", icon: "🎭", title: "Heavy Masking" },
                        { key: "badSubstrate", icon: "⚠️", title: "Bad Substrate" },
                        { key: "rush", icon: "⚡", title: "Rush" },
                      ].map((toggle) => (
                        <button
                          key={toggle.key}
                          title={toggle.title}
                          onClick={() =>
                            setLineItemToggles(item.id, {
                              [toggle.key]: !item.toggles[toggle.key as keyof LineItemToggles],
                            })
                          }
                          className={`text-xs p-1 rounded transition-all ${
                            item.toggles[toggle.key as keyof LineItemToggles]
                              ? "bg-orange-500/20 scale-110"
                              : "bg-white/5 opacity-40 hover:opacity-70"
                          }`}
                        >
                          {toggle.icon}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Multiplier */}
                  <td className="py-2 px-2 text-right text-white/80">
                    {pricing.multiplier.toFixed(2)}x
                  </td>

                  {/* Subtotal */}
                  <td className="py-2 px-2 text-right text-white font-semibold">
                    {formatCurrency(pricing.subtotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* All Items */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            All Items ({totals.itemCount})
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Base Subtotal:</span>
              <span>{formatCurrency(totals.baseSubtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>
                Contingency ({formatPercent(estimateSettings.contingencyPct)}):
              </span>
              <span>{formatCurrency(totals.contingency)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Overhead ({formatPercent(estimateSettings.overheadPct)}):</span>
              <span>{formatCurrency(totals.overhead)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Profit ({formatPercent(estimateSettings.profitPct)}):</span>
              <span>{formatCurrency(totals.profit)}</span>
            </div>
            {totals.tax > 0 && (
              <div className="flex justify-between text-white/70">
                <span>Tax ({formatPercent(estimateSettings.taxPct || 0)}):</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
              <span>Total:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Proposal Items Only */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Proposal Total ({proposalTotals.itemCount} included)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Base Subtotal:</span>
              <span>{formatCurrency(proposalTotals.baseSubtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>
                Contingency ({formatPercent(estimateSettings.contingencyPct)}):
              </span>
              <span>{formatCurrency(proposalTotals.contingency)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Overhead ({formatPercent(estimateSettings.overheadPct)}):</span>
              <span>{formatCurrency(proposalTotals.overhead)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Profit ({formatPercent(estimateSettings.profitPct)}):</span>
              <span>{formatCurrency(proposalTotals.profit)}</span>
            </div>
            {proposalTotals.tax > 0 && (
              <div className="flex justify-between text-white/70">
                <span>Tax ({formatPercent(estimateSettings.taxPct || 0)}):</span>
                <span>{formatCurrency(proposalTotals.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-purple-500/20">
              <span>Total:</span>
              <span>{formatCurrency(proposalTotals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
