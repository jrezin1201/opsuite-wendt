"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { Button } from "@/components/ui/Button";
import { computeBidFormLine, computeBidFormTotals, formatCurrency, formatPercent } from "@/lib/paintbid/bidform/pricing";
import type { Difficulty, BidFormLine } from "@/lib/paintbid/bidform/types";
import { DifficultyPricingReference } from "@/components/paintbid/DifficultyPricingReference";
import { getDifficultyDescription, DIFFICULTY_PRICING, calculateDifficultyPrice } from "@/lib/paintbid/pricing/difficultyPricing";

export function NewBidFormScreen() {
  const bidForm = usePaintBidStore((state) => state.bidForm);
  const createNewBidForm = usePaintBidStore((state) => state.createNewBidForm);
  const updateBidFormLine = usePaintBidStore((state) => state.updateBidFormLine);
  const setBidFormLineDifficulty = usePaintBidStore((state) => state.setBidFormLineDifficulty);
  const setBidFormLineToggles = usePaintBidStore((state) => state.setBidFormLineToggles);
  const setBidFormLineIncluded = usePaintBidStore((state) => state.setBidFormLineIncluded);
  const updateBidFormSettings = usePaintBidStore((state) => state.updateBidFormSettings);
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);
  const [showPricingReference, setShowPricingReference] = useState(false);
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

  // Helper function to get the price display for a difficulty level
  const getDifficultyPriceDisplay = (line: BidFormLine, difficulty: Difficulty): string => {
    // Map line item to pricing key
    const itemKey = getItemPricingKey(line.label, line.section);
    const pricing = DIFFICULTY_PRICING[itemKey];

    if (pricing) {
      // Calculate the price per unit for this difficulty
      const pricePerUnit = pricing.basePrice + (pricing.incrementPerLevel * (difficulty - 1));

      // Format based on whether it's a whole dollar or has cents
      if (pricePerUnit >= 10) {
        return `$${Math.round(pricePerUnit)}`;
      } else if (pricePerUnit >= 1) {
        return `$${pricePerUnit.toFixed(pricePerUnit % 1 === 0 ? 0 : 2)}`;
      } else {
        // For prices less than $1, show cents
        return `${(pricePerUnit * 100).toFixed(0)}¢`;
      }
    } else {
      // Fallback for items without specific pricing
      const multipliers: Record<Difficulty, number> = { 1: 1.0, 2: 1.1, 3: 1.2, 4: 1.3, 5: 1.5 };
      const price = line.baseUnitPrice * multipliers[difficulty];
      if (price >= 10) {
        return `$${Math.round(price)}`;
      } else {
        return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
      }
    }
  };

  // Helper function to map line items to pricing keys
  const getItemPricingKey = (label: string, section: string): string => {
    const lowerLabel = label.toLowerCase();
    const lowerSection = section.toLowerCase();

    // Unit Interior items
    if (lowerSection.includes("unit")) {
      if (lowerLabel.includes("unit") && !lowerLabel.includes("prime") && !lowerLabel.includes("eggshell")) return "units";
      if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "units_prime_coat";
      if (lowerLabel.includes("eggshell")) return "units_eggshell_walls";
      if (lowerLabel.includes("two") && lowerLabel.includes("tone")) return "units_two_tone";
      if (lowerLabel.includes("base") && lowerLabel.includes("floor")) return "units_base_over_floor";
      if (lowerLabel.includes("cased") && lowerLabel.includes("window")) return "units_cased_windows";
      if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "units_smooth_wall";
      if (lowerLabel.includes("mask") && lowerLabel.includes("hinge")) return "units_mask_hinges";
    }

    // Corridor items
    if (lowerSection.includes("corridor")) {
      if (lowerLabel.includes("wall") && lowerLabel.includes("sf")) return "corridor_wall_sf";
      if (lowerLabel.includes("ceiling") && lowerLabel.includes("sf")) return "corridor_ceiling_sf";
      if (lowerLabel.includes("entry") && lowerLabel.includes("door")) return "corridor_entry_doors";
      if (lowerLabel.includes("door") && !lowerLabel.includes("entry")) return "corridor_doors";
      if (lowerLabel.includes("storage")) return "corridor_doors";
      if (lowerLabel.includes("base")) return "corridor_base";
      if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "corridor_prime_coat";
      if (lowerLabel.includes("eggshell")) return "corridor_eggshell_walls";
      if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "corridor_smooth_wall";
      if (lowerLabel.includes("mask") && lowerLabel.includes("hinge")) return "corridor_base";
    }

    // Stairwell items
    if (lowerSection.includes("stair")) {
      if (lowerLabel.includes("stair") && (lowerLabel.includes("1") || lowerLabel.includes("2"))) return "stairwell_rails";
      if (lowerLabel.includes("prime") && lowerLabel.includes("coat")) return "stairwell_prime_coat";
      if (lowerLabel.includes("eggshell")) return "stairwell_eggshell_walls";
      if (lowerLabel.includes("smooth") && lowerLabel.includes("wall")) return "stairwell_smooth_wall";
      if (lowerLabel.includes("mask") && lowerLabel.includes("hinge")) return "stairwell_walls";
    }

    // Amenity items
    if (lowerSection.includes("amenity")) {
      return "amenity_room_sf";
    }

    // Exterior items
    if (lowerSection.includes("exterior")) {
      if (lowerLabel.includes("door") && !lowerLabel.includes("balc")) return "exterior_door";
      if (lowerLabel.includes("parapet")) return "exterior_parapet";
      if (lowerLabel.includes("window") && lowerLabel.includes("trim")) return "exterior_window_trim";
      if (lowerLabel.includes("wood") && lowerLabel.includes("vertical")) return "exterior_window_wood_verticals";
      if (lowerLabel.includes("balcony") && lowerLabel.includes("rail")) return "exterior_balc_rail";
      if (lowerLabel.includes("misc")) return "exterior_misc";
      if (lowerLabel.includes("stucco") && lowerLabel.includes("body")) return "exterior_stucco_body";
      if (lowerLabel.includes("prime") && lowerLabel.includes("stucco") && !lowerLabel.includes("accent")) return "exterior_prime_stucco";
      if (lowerLabel.includes("stucco") && lowerLabel.includes("accent")) return "exterior_stucco_accents_balcs";
      if (lowerLabel.includes("prime") && lowerLabel.includes("accent")) return "exterior_prime_stucco_accents";
      if (lowerLabel.includes("balcony") && lowerLabel.includes("door")) return "exterior_balc_doors";
    }

    // Garage items
    if (lowerSection.includes("garage")) {
      if (lowerLabel.includes("trash")) return "garage_trash_room";
      if (lowerLabel.includes("bike")) return "garage_bike_storage";
      if (lowerLabel.includes("door")) return "garage_doors";
      if (lowerLabel.includes("garage") && lowerLabel.includes("wall")) return "garage_walls";
      if (lowerLabel.includes("column")) return "garage_columns";
    }

    // Landscape items
    if (lowerSection.includes("landscape")) {
      if (lowerLabel.includes("gate")) return "landscape_gates";
    }

    return lowerLabel.replace(/\s+/g, "_");
  };

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

      {/* Important Notice about Alternates */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="text-base font-bold text-blue-900">Add Alternates (ALTs) Included by Default</h3>
            <p className="text-sm text-blue-800 mt-1">
              All items marked as <span className="font-bold bg-blue-100 px-2 py-0.5 rounded text-blue-700">ALT</span> are automatically included in your proposal.
              Uncheck any alternates you don&apos;t want to appear in the final proposal.
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty Pricing Reference Toggle */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 shadow-sm">
        <button
          onClick={() => setShowPricingReference(!showPricingReference)}
          className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div className="text-left">
              <h3 className="text-lg font-bold text-brand-navy">Difficulty Level Pricing Reference</h3>
              <p className="text-sm text-gray-600">
                View how difficulty levels 1-5 affect pricing for each item type
              </p>
            </div>
          </div>
          <span className="text-2xl text-brand-navy">
            {showPricingReference ? "−" : "+"}
          </span>
        </button>
      </div>

      {/* Pricing Reference Component */}
      {showPricingReference && (
        <div className="animate-slide-down">
          <DifficultyPricingReference />
        </div>
      )}

      {/* Global Settings - Grey Box */}
      <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚙️</span>
          <h3 className="text-lg font-bold text-gray-800">
            Global Project Settings
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Contingency</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={bidForm.settings.contingencyPct * 100}
                onChange={(e) =>
                  updateBidFormSettings({
                    contingencyPct: parseFloat(e.target.value) / 100 || 0,
                  })
                }
                className="w-full px-4 py-3 pr-8 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-lg font-bold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>
            <p className="text-xs text-gray-600">Project uncertainty buffer</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Overhead</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={bidForm.settings.overheadPct * 100}
                onChange={(e) =>
                  updateBidFormSettings({
                    overheadPct: parseFloat(e.target.value) / 100 || 0,
                  })
                }
                className="w-full px-4 py-3 pr-8 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-lg font-bold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>
            <p className="text-xs text-gray-600">Business operating costs</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Profit Margin</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={bidForm.settings.profitPct * 100}
                onChange={(e) =>
                  updateBidFormSettings({
                    profitPct: parseFloat(e.target.value) / 100 || 0,
                  })
                }
                className="w-full px-4 py-3 pr-8 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-lg font-bold focus:ring-2 focus:ring-brand-gold focus:border-brand-gold shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>
            <p className="text-xs text-gray-600">Target profit percentage</p>
          </div>
        </div>
        {/* Show calculated amounts */}
        {totals && (
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-gray-600">Contingency Amount:</span>
                <div className="font-bold text-gray-800">{formatCurrency(totals.contingency)}</div>
              </div>
              <div>
                <span className="text-gray-600">Overhead Amount:</span>
                <div className="font-bold text-gray-800">{formatCurrency(totals.overhead)}</div>
              </div>
              <div>
                <span className="text-gray-600">Profit Amount:</span>
                <div className="font-bold text-gray-800">{formatCurrency(totals.profit)}</div>
              </div>
            </div>
          </div>
        )}
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
                  <th className="py-3 px-3 text-center text-brand-navy font-bold text-xs uppercase">
                    <div>Difficulty</div>
                    <div className="flex justify-center gap-1 mt-1">
                      <span className="text-[10px] font-normal">1</span>
                      <span className="text-[10px] font-normal">2</span>
                      <span className="text-[10px] font-normal">3</span>
                      <span className="text-[10px] font-normal">4</span>
                      <span className="text-[10px] font-normal">5</span>
                    </div>
                  </th>
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
                            <span className="ml-2 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded" title="Add Alternate - Included in proposal by default">
                              ALT
                            </span>
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

                      {/* Difficulty (1-5) with Pricing */}
                      <td className="py-2 px-3">
                        <div className="flex justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((d) => {
                            // Calculate the price difference for this difficulty level
                            const priceDisplay = getDifficultyPriceDisplay(line, d as Difficulty);

                            return (
                              <button
                                key={d}
                                onClick={() =>
                                  setBidFormLineDifficulty(line.id, d as Difficulty)
                                }
                                className={`min-w-[45px] px-1 py-1 rounded font-semibold text-[10px] transition-all ${
                                  line.difficulty === d
                                    ? "bg-brand-gold text-white shadow-md scale-105"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                title={`Level ${d}: ${getDifficultyDescription(d)}`}
                              >
                                {priceDisplay}
                              </button>
                            );
                          })}
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
