"use client";

import React, { useState } from "react";
import { DIFFICULTY_PRICING } from "@/lib/paintbid/pricing/difficultyPricing";
import { formatCurrency } from "@/lib/paintbid/bidform/pricing";

export function PricingLogicScreen() {
  const [expandedSection, setExpandedSection] = useState<string>("all");

  // Group items by category
  const categories = {
    "Unit Interior": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("units")),
    "Corridors": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("corridor")),
    "Stairwells": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("stairwell")),
    "Amenity Areas": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("amenity")),
    "Exterior": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("exterior")),
    "Garage": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("garage")),
    "Landscape": Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith("landscape")),
  };

  const formatItemName = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/^\w/, c => c.toUpperCase())
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const calculatePriceAtLevel = (basePrice: number, increment: number, level: number): number => {
    return basePrice + (increment * (level - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📊 Pricing Logic Reference</h1>
        <p className="text-white/80">
          Complete breakdown of difficulty-based pricing calculations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border-2 border-brand-line rounded-lg p-4">
          <div className="text-2xl font-bold text-brand-navy">
            {Object.keys(DIFFICULTY_PRICING).length}
          </div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white border-2 border-brand-line rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">5</div>
          <div className="text-sm text-gray-600">Difficulty Levels</div>
        </div>
        <div className="bg-white border-2 border-brand-line rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {Object.values(categories).reduce((sum, items) => sum + items.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Configured Prices</div>
        </div>
        <div className="bg-white border-2 border-brand-line rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">7</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>

      {/* Category Toggle */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setExpandedSection("all")}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              expandedSection === "all"
                ? "bg-brand-gold text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Show All
          </button>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setExpandedSection(expandedSection === category ? "all" : category)}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                expandedSection === category
                  ? "bg-brand-navy text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Tables */}
      {Object.entries(categories).map(([category, items]) => {
        if (expandedSection !== "all" && expandedSection !== category) return null;

        return (
          <div key={category} className="bg-white border-2 border-brand-line rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 px-6 py-4">
              <h2 className="text-xl font-bold text-white">{category}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-brand-line">
                  <tr>
                    <th className="py-3 px-4 text-left text-brand-navy font-bold">Item</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold">Base Price</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold">+Per Level</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold bg-gray-50">Level 1</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold bg-blue-50">Level 2</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold bg-green-50">Level 3</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold bg-yellow-50">Level 4</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold bg-red-50">Level 5</th>
                    <th className="py-3 px-4 text-center text-brand-navy font-bold">Formula</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(([key, pricing], idx) => {
                    const itemName = formatItemName(key);
                    const isFixedPrice = pricing.checkboxOnly || pricing.incrementPerLevel === 0;

                    return (
                      <tr key={key} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {itemName}
                          {pricing.followsUnits && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Follows Units
                            </span>
                          )}
                          {isFixedPrice && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              Fixed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm">
                          {formatCurrency(pricing.basePrice)}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm">
                          {isFixedPrice ? "-" : formatCurrency(pricing.incrementPerLevel)}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm font-bold bg-gray-50">
                          {formatCurrency(calculatePriceAtLevel(pricing.basePrice, pricing.incrementPerLevel, 1))}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm font-bold bg-blue-50">
                          {formatCurrency(calculatePriceAtLevel(pricing.basePrice, pricing.incrementPerLevel, 2))}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm font-bold bg-green-50">
                          {formatCurrency(calculatePriceAtLevel(pricing.basePrice, pricing.incrementPerLevel, 3))}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm font-bold bg-yellow-50">
                          {formatCurrency(calculatePriceAtLevel(pricing.basePrice, pricing.incrementPerLevel, 4))}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-sm font-bold bg-red-50">
                          {formatCurrency(calculatePriceAtLevel(pricing.basePrice, pricing.incrementPerLevel, 5))}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-gray-600">
                          {isFixedPrice ? (
                            <span className="font-semibold">Fixed Price</span>
                          ) : (
                            <span className="font-mono">
                              ${pricing.basePrice} + (${pricing.incrementPerLevel} × (L-1))
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Example Calculations */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-navy mb-4">💡 Example Calculations</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-bold text-gray-800 mb-2">Corridor Doors (10 doors)</h4>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Level 1:</span>
                <div className="font-mono font-bold">10 × $175 = $1,750</div>
              </div>
              <div>
                <span className="text-gray-600">Level 2:</span>
                <div className="font-mono font-bold">10 × $200 = $2,000</div>
              </div>
              <div>
                <span className="text-gray-600">Level 3:</span>
                <div className="font-mono font-bold">10 × $225 = $2,250</div>
              </div>
              <div>
                <span className="text-gray-600">Level 4:</span>
                <div className="font-mono font-bold">10 × $250 = $2,500</div>
              </div>
              <div>
                <span className="text-gray-600">Level 5:</span>
                <div className="font-mono font-bold">10 × $275 = $2,750</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Formula: Base $175 + ($25 increment × (Level - 1))
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-bold text-gray-800 mb-2">Units (14 units)</h4>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Level 1:</span>
                <div className="font-mono font-bold">14 × $1,350 = $18,900</div>
              </div>
              <div>
                <span className="text-gray-600">Level 2:</span>
                <div className="font-mono font-bold">14 × $1,400 = $19,600</div>
              </div>
              <div>
                <span className="text-gray-600">Level 3:</span>
                <div className="font-mono font-bold">14 × $1,450 = $20,300</div>
              </div>
              <div>
                <span className="text-gray-600">Level 4:</span>
                <div className="font-mono font-bold">14 × $1,500 = $21,000</div>
              </div>
              <div>
                <span className="text-gray-600">Level 5:</span>
                <div className="font-mono font-bold">14 × $1,550 = $21,700</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Formula: Base $1,350 + ($50 increment × (Level - 1))
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-2 border-brand-line rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-navy mb-4">📖 Legend</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Pricing Types</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                  Follows Units
                </span>
                <span className="text-sm text-gray-600">Uses the same difficulty as unit items</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                  Fixed
                </span>
                <span className="text-sm text-gray-600">Price doesn&apos;t change with difficulty</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Difficulty Levels</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-bold">Level 1:</span> Base price (easiest)</div>
              <div><span className="font-bold">Level 2:</span> Base + 1 increment</div>
              <div><span className="font-bold">Level 3:</span> Base + 2 increments</div>
              <div><span className="font-bold">Level 4:</span> Base + 3 increments</div>
              <div><span className="font-bold">Level 5:</span> Base + 4 increments (hardest)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}