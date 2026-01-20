"use client";

import React from "react";
import type { Feature } from "./AppEstimator";

interface EstimateSummaryProps {
  selectedFeatures: Feature[];
  totalHours: { min: number; max: number };
  totalCost: { min: number; max: number };
  hourlyRate: number;
  techStack: string[];
  onHourlyRateChange: (rate: number) => void;
}

export function EstimateSummary({
  selectedFeatures,
  totalHours,
  totalCost,
  hourlyRate,
  techStack,
  onHourlyRateChange,
}: EstimateSummaryProps) {
  const categoryCounts = selectedFeatures.reduce((acc, feature) => {
    acc[feature.category] = (acc[feature.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-white/60 mb-2">Estimated Hours</p>
          <p className="text-3xl font-bold text-white">
            {totalHours.min}-{totalHours.max}
          </p>
          <p className="text-xs text-white/40 mt-1">hours of development</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-white/60 mb-2">Estimated Cost</p>
          <p className="text-3xl font-bold text-purple-400">
            ${totalCost.min.toLocaleString()}-${totalCost.max.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-1">at ${hourlyRate}/hour</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-white/60 mb-2">Features Selected</p>
          <p className="text-3xl font-bold text-white">{selectedFeatures.length}</p>
          <p className="text-xs text-white/40 mt-1">across {Object.keys(categoryCounts).length} categories</p>
        </div>
      </div>

      {/* Hourly Rate Adjuster */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-white">Hourly Rate</label>
          <span className="text-2xl font-bold text-purple-400">${hourlyRate}</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          step="10"
          value={hourlyRate}
          onChange={(e) => onHourlyRateChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/40 mt-2">
          <span>$50/hr</span>
          <span>$300/hr</span>
        </div>
      </div>

      {/* Selected Features Breakdown */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Selected Features</h3>
        <div className="space-y-4">
          {Object.entries(categoryCounts).map(([category, count]) => {
            const categoryFeatures = selectedFeatures.filter((f) => f.category === category);
            const categoryHours = {
              min: categoryFeatures.reduce((sum, f) => sum + f.hours.min, 0),
              max: categoryFeatures.reduce((sum, f) => sum + f.hours.max, 0),
            };

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">
                    {category} ({count})
                  </h4>
                  <span className="text-sm text-white/60">
                    {categoryHours.min}-{categoryHours.max}h
                  </span>
                </div>
                <div className="space-y-1">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between text-xs">
                      <span className="text-white/60">• {feature.name}</span>
                      <span className="text-white/40">
                        {feature.hours.min}-{feature.hours.max}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Tech Stack */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Suggested Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
