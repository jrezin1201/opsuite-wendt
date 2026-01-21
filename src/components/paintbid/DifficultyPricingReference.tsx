"use client";

import React, { useState } from "react";
import { getDifficultyDescription, DIFFICULTY_PRICING, calculateDifficultyPrice } from "@/lib/paintbid/pricing/difficultyPricing";
import { formatCurrency } from "@/lib/paintbid/bidform/pricing";

export function DifficultyPricingReference() {
  const [expandedSection, setExpandedSection] = useState<string | null>("units");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

  const sections = {
    units: "Unit Interior",
    corridors: "Corridors",
    stairwells: "Stairwells",
    amenity: "Amenity Areas",
    exterior: "Exterior",
    garage: "Garage",
    landscape: "Landscape"
  };

  const getSectionItems = (section: string) => {
    return Object.entries(DIFFICULTY_PRICING).filter(([key]) => key.startsWith(section.slice(0, -1)));
  };

  return (
    <div className="bg-white border-2 border-brand-line rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 px-6 py-4 border-b-4 border-brand-gold">
        <h2 className="text-xl font-bold text-white">📊 Difficulty Level Pricing Reference</h2>
        <p className="text-white/80 text-sm mt-1">
          Based on professional painting difficulty standards
        </p>
      </div>

      {/* Difficulty Level Selector */}
      <div className="p-6 border-b-2 border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-brand-navy mb-4">Select Difficulty Level</h3>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDifficulty === level
                  ? "bg-brand-gold text-white border-brand-gold shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-brand-gold hover:shadow-md"
              }`}
            >
              <div className="text-2xl font-bold mb-1">{level}</div>
              <div className="text-xs">
                {level === 1 && "Base"}
                {level === 2 && "+10%"}
                {level === 3 && "+20%"}
                {level === 4 && "+30%"}
                {level === 5 && "+50%"}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <p className="text-sm font-semibold text-blue-900">
            {getDifficultyDescription(selectedDifficulty)}
          </p>
        </div>
      </div>

      {/* Pricing Sections */}
      <div className="divide-y divide-gray-200">
        {Object.entries(sections).map(([sectionKey, sectionName]) => {
          const items = getSectionItems(sectionKey);
          const isExpanded = expandedSection === sectionKey;

          return (
            <div key={sectionKey}>
              <button
                onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-brand-navy">{sectionName}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 font-semibold">
                    {items.length} items
                  </span>
                  <span className="text-2xl text-gray-400">
                    {isExpanded ? "−" : "+"}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 bg-gray-50">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2 text-sm font-bold text-gray-700">Item</th>
                        <th className="text-center py-2 text-sm font-bold text-gray-700">Base Price</th>
                        <th className="text-center py-2 text-sm font-bold text-gray-700">Increment/Level</th>
                        <th className="text-center py-2 text-sm font-bold text-gray-700">
                          Price at Level {selectedDifficulty}
                        </th>
                        <th className="text-center py-2 text-sm font-bold text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(([key, pricing]) => {
                        const displayName = key
                          .replace(sectionKey.slice(0, -1) + "_", "")
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());

                        const priceAtLevel = pricing.checkboxOnly
                          ? pricing.basePrice
                          : pricing.basePrice + pricing.incrementPerLevel * (selectedDifficulty - 1);

                        return (
                          <tr key={key} className="border-b border-gray-200 hover:bg-white transition-colors">
                            <td className="py-3 text-sm font-semibold text-gray-800">
                              {displayName}
                            </td>
                            <td className="py-3 text-center text-sm font-mono">
                              {formatCurrency(pricing.basePrice)}
                            </td>
                            <td className="py-3 text-center text-sm font-mono">
                              {pricing.checkboxOnly ? "-" :
                               pricing.incrementPerLevel === 0 ? "-" :
                               formatCurrency(pricing.incrementPerLevel)}
                            </td>
                            <td className="py-3 text-center text-sm font-bold font-mono text-brand-navy">
                              {formatCurrency(priceAtLevel)}
                            </td>
                            <td className="py-3 text-center text-xs">
                              {pricing.followsUnits && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                                  Follows Units
                                </span>
                              )}
                              {pricing.checkboxOnly && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold">
                                  Fixed Price
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Example Calculation */}
      <div className="p-6 bg-yellow-50 border-t-2 border-yellow-300">
        <h3 className="text-lg font-bold text-brand-navy mb-3">💡 Example Calculation</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">14 Units at Difficulty {selectedDifficulty}:</span>
            <span className="font-bold font-mono text-brand-navy">
              {formatCurrency(calculateDifficultyPrice("units", 14, selectedDifficulty))}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Formula: ({formatCurrency(1350)} base + {formatCurrency(50)} × {selectedDifficulty - 1} levels) × 14 units
          </div>
        </div>
      </div>
    </div>
  );
}