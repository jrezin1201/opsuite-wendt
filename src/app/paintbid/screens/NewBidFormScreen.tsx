"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { computeBidFormLine, computeBidFormTotals, formatCurrency, formatPercent } from "@/lib/paintbid/bidform/pricing";
import type { Difficulty } from "@/lib/paintbid/bidform/types";

export function NewBidFormScreen() {
  const bidForm = usePaintBidStore((state) => state.bidForm);
  const createNewBidForm = usePaintBidStore((state) => state.createNewBidForm);
  const updateBidFormLine = usePaintBidStore((state) => state.updateBidFormLine);
  const setBidFormLineDifficulty = usePaintBidStore((state) => state.setBidFormLineDifficulty);
  const setBidFormLineToggles = usePaintBidStore((state) => state.setBidFormLineToggles);
  const setBidFormLineIncluded = usePaintBidStore((state) => state.setBidFormLineIncluded);
  const updateBidFormSettings = usePaintBidStore((state) => state.updateBidFormSettings);
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);
  const lastBidFormIdRef = useRef<string | undefined>(undefined);

  // Trigger refresh animation on bid form changes
  useEffect(() => {
    if (bidForm && bidForm.id !== lastBidFormIdRef.current) {
      if (lastBidFormIdRef.current !== undefined) {
        // Only show animation if this isn't the initial load
        // Defer setState to avoid synchronous updates in effect
        const showTimer = setTimeout(() => {
          setShowRefreshAnimation(true);
          const hideTimer = setTimeout(() => setShowRefreshAnimation(false), 1000);
          return () => clearTimeout(hideTimer);
        }, 0);
        lastBidFormIdRef.current = bidForm.id;
        return () => clearTimeout(showTimer);
      }
      lastBidFormIdRef.current = bidForm.id;
    }
  }, [bidForm]); // Track bid form changes

  const totals = useMemo(() => {
    if (!bidForm) return null;
    return computeBidFormTotals(bidForm, false);
  }, [bidForm]);

  const proposalTotals = useMemo(() => {
    if (!bidForm) return null;
    return computeBidFormTotals(bidForm, true);
  }, [bidForm]);

  if (!bidForm) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-brand-navy mb-2">
          No Bid Form Yet
        </h3>
        <p className="text-brand-ink/60 mb-6">
          Create a new bid form or import counts from your takeoff Excel file
        </p>
        <Button onClick={createNewBidForm}>
          Create New Bid Form
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${showRefreshAnimation ? 'animate-pulse-once' : ''}`}>
      {showRefreshAnimation && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 mb-6 shadow-md animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-spin-slow">🔄</div>
            <div>
              <div className="font-bold text-green-800">Bid Form Updated!</div>
              <div className="text-sm text-green-700">Data refreshed from Excel import</div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Bar */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-6 shadow-sm">
        <h3 className="text-base font-bold text-brand-navy mb-4">
          Global Settings
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Contingency %</label>
            <input
              type="number"
              step="0.01"
              value={bidForm.settings.contingencyPct * 100}
              onChange={(e) =>
                updateBidFormSettings({
                  contingencyPct: parseFloat(e.target.value) / 100 || 0,
                })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Overhead %</label>
            <input
              type="number"
              step="0.01"
              value={bidForm.settings.overheadPct * 100}
              onChange={(e) =>
                updateBidFormSettings({
                  overheadPct: parseFloat(e.target.value) / 100 || 0,
                })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Profit %</label>
            <input
              type="number"
              step="0.01"
              value={bidForm.settings.profitPct * 100}
              onChange={(e) =>
                updateBidFormSettings({
                  profitPct: parseFloat(e.target.value) / 100 || 0,
                })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-brand-line bg-white text-gray-800 text-base font-semibold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
        </div>
      </div>

      {/* Bid Form Sections */}
      {bidForm.sections.map((section) => (
        <div key={section.name} className="bg-white border-2 border-brand-line rounded-lg overflow-hidden shadow-sm">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{section.name}</h3>
            {totals && (
              <div className="text-brand-gold font-bold text-lg">
                {formatCurrency(totals.sections[section.name] || 0)}
              </div>
            )}
          </div>

          {/* Lines Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-brand-line">
                <tr>
                  <th className="py-3 px-3 text-left text-brand-navy font-bold text-xs uppercase w-12">✓</th>
                  <th className="py-3 px-3 text-left text-brand-navy font-bold text-xs uppercase">Item</th>
                  <th className="py-3 px-3 text-right text-brand-navy font-bold text-xs uppercase">Qty</th>
                  <th className="py-3 px-3 text-center text-brand-navy font-bold text-xs uppercase">UOM</th>
                  <th className="py-3 px-3 text-right text-brand-navy font-bold text-xs uppercase">$/Unit</th>
                  <th className="py-3 px-3 text-center text-brand-navy font-bold text-xs uppercase">Difficulty</th>
                  <th className="py-3 px-3 text-center text-brand-navy font-bold text-xs uppercase">Toggles</th>
                  <th className="py-3 px-3 text-right text-brand-navy font-bold text-xs uppercase">Mult</th>
                  <th className="py-3 px-3 text-right text-brand-navy font-bold text-xs uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {section.lines.map((line) => {
                  const pricing = computeBidFormLine(line);
                  const isAlternate = line.isAlternate;

                  return (
                    <tr
                      key={line.id}
                      className={`border-b border-brand-line/50 hover:bg-gray-50 transition-colors ${
                        !line.included ? "opacity-50" : ""
                      } ${isAlternate ? "bg-blue-50/30" : ""}`}
                    >
                      {/* Include Checkbox */}
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={line.included}
                          onChange={(e) =>
                            setBidFormLineIncluded(line.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                        />
                      </td>

                      {/* Item Name */}
                      <td className="py-2 px-3">
                        <div className="text-brand-navy font-semibold text-base">
                          {line.label}
                          {isAlternate && (
                            <span className="ml-2 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">(Alt)</span>
                          )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={line.qty}
                          onChange={(e) =>
                            updateBidFormLine(line.id, {
                              qty: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-20 px-2 py-1 text-right rounded border border-brand-line bg-white text-brand-ink text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        />
                      </td>

                      {/* UOM */}
                      <td className="py-2 px-3 text-center text-gray-700 font-semibold">
                        {line.uom}
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          value={line.baseUnitPrice}
                          onChange={(e) =>
                            updateBidFormLine(line.id, {
                              baseUnitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-24 px-2 py-1 text-right rounded border border-brand-line bg-white text-brand-ink text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        />
                      </td>

                      {/* Difficulty (1-5) */}
                      <td className="py-2 px-3">
                        <div className="flex justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((d) => (
                            <button
                              key={d}
                              onClick={() =>
                                setBidFormLineDifficulty(line.id, d as Difficulty)
                              }
                              className={`w-8 h-8 rounded font-semibold text-xs transition-all ${
                                line.difficulty === d
                                  ? "bg-brand-gold text-white shadow-md scale-110"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                              title={getDifficultyLabel(d as Difficulty)}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Toggles */}
                      <td className="py-2 px-3">
                        <div className="flex justify-center gap-1">
                          <ToggleButton
                            active={line.toggles.tightAccess || false}
                            onClick={() =>
                              setBidFormLineToggles(line.id, {
                                tightAccess: !line.toggles.tightAccess,
                              })
                            }
                            icon="🔒"
                            title="Tight Access"
                          />
                          <ToggleButton
                            active={line.toggles.heavyPrep || false}
                            onClick={() =>
                              setBidFormLineToggles(line.id, {
                                heavyPrep: !line.toggles.heavyPrep,
                              })
                            }
                            icon="🔧"
                            title="Heavy Prep"
                          />
                          <ToggleButton
                            active={line.toggles.occupied || false}
                            onClick={() =>
                              setBidFormLineToggles(line.id, {
                                occupied: !line.toggles.occupied,
                              })
                            }
                            icon="🏠"
                            title="Occupied"
                          />
                        </div>
                      </td>

                      {/* Multiplier */}
                      <td className="py-2 px-3 text-right text-gray-700 font-mono text-sm font-semibold">
                        {pricing.multiplier.toFixed(2)}x
                      </td>

                      {/* Total */}
                      <td className="py-2 px-3 text-right text-brand-navy font-bold text-base">
                        {formatCurrency(pricing.subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Totals Cards */}
      {totals && proposalTotals && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Items Total */}
          <div className="bg-white border-2 border-brand-line rounded-lg p-6 shadow-sm">
            <h3 className="text-base font-bold text-brand-navy mb-4">
              All Items ({totals.itemCount})
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Base Subtotal:</span>
                <span className="font-mono font-semibold">{formatCurrency(totals.baseSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Contingency ({formatPercent(bidForm.settings.contingencyPct)}):</span>
                <span className="font-mono font-semibold">{formatCurrency(totals.contingency)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Overhead ({formatPercent(bidForm.settings.overheadPct)}):</span>
                <span className="font-mono font-semibold">{formatCurrency(totals.overhead)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Profit ({formatPercent(bidForm.settings.profitPct)}):</span>
                <span className="font-mono font-semibold">{formatCurrency(totals.profit)}</span>
              </div>
              <div className="flex justify-between text-brand-navy font-bold text-xl pt-4 border-t-2 border-brand-line">
                <span>Total:</span>
                <span className="font-mono">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Proposal Total */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-navy2 text-white rounded-lg p-6 shadow-lg border-2 border-brand-gold">
            <h3 className="text-base font-bold text-white mb-4">
              Proposal Total ({proposalTotals.itemCount} included)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/90">
                <span className="font-semibold">Base Subtotal:</span>
                <span className="font-mono font-semibold">{formatCurrency(proposalTotals.baseSubtotal)}</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span className="font-semibold">Contingency:</span>
                <span className="font-mono font-semibold">{formatCurrency(proposalTotals.contingency)}</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span className="font-semibold">Overhead:</span>
                <span className="font-mono font-semibold">{formatCurrency(proposalTotals.overhead)}</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span className="font-semibold">Profit:</span>
                <span className="font-mono font-semibold">{formatCurrency(proposalTotals.profit)}</span>
              </div>
              <div className="flex justify-between text-brand-gold font-bold text-2xl pt-4 border-t-2 border-white/30">
                <span>Total:</span>
                <span className="font-mono">{formatCurrency(proposalTotals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDifficultyLabel(difficulty: Difficulty): string {
  const labels = {
    1: "Very Easy",
    2: "Easy",
    3: "Standard",
    4: "Hard",
    5: "Very Hard",
  };
  return labels[difficulty];
}

function ToggleButton({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
        active
          ? "bg-orange-500 text-white shadow-md scale-110"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      }`}
    >
      {icon}
    </button>
  );
}
