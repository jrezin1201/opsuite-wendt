"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export interface Shareholder {
  name: string;
  shares: number;
  shareClass: "Common" | "Preferred" | "Options";
  investmentAmount?: number;
}

interface CapTableVisualizerProps {
  shareholders: Shareholder[];
  companyValuation?: number;
}

export function CapTableVisualizer({
  shareholders,
  companyValuation,
}: CapTableVisualizerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalShares = shareholders.reduce((sum, sh) => sum + sh.shares, 0);
  const totalInvestment = shareholders.reduce(
    (sum, sh) => sum + (sh.investmentAmount || 0),
    0
  );

  const getShareClassColor = (shareClass: string) => {
    switch (shareClass) {
      case "Common":
        return "fill-blue-500";
      case "Preferred":
        return "fill-purple-500";
      case "Options":
        return "fill-green-500";
      default:
        return "fill-gray-500";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Calculate pie chart slices
  const calculateSlices = () => {
    let currentAngle = -90; // Start at top
    return shareholders.map((sh, index) => {
      const percentage = (sh.shares / totalShares) * 100;
      const sliceAngle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      currentAngle = endAngle;

      // Calculate path for pie slice
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);

      const largeArc = sliceAngle > 180 ? 1 : 0;

      const path = [
        `M 100 100`,
        `L ${x1} ${y1}`,
        `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      return {
        path,
        percentage,
        shareholder: sh,
        index,
      };
    });
  };

  const slices = calculateSlices();

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">
            Cap Table Breakdown
          </h3>
          <p className="text-sm text-white/60">Ownership distribution</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                {slices.map((slice) => (
                  <path
                    key={slice.index}
                    d={slice.path}
                    className={`${getShareClassColor(
                      slice.shareholder.shareClass
                    )} transition-opacity cursor-pointer`}
                    opacity={
                      hoveredIndex === null || hoveredIndex === slice.index
                        ? 1
                        : 0.3
                    }
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
                {/* Center circle for donut effect */}
                <circle cx="100" cy="100" r="45" fill="#000" />
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <p className="text-xs text-white/60">Total Shares</p>
                <p className="text-lg font-bold text-white">
                  {totalShares.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Legend & Details */}
          <div className="space-y-3">
            {shareholders.map((sh, index) => {
              const percentage = (sh.shares / totalShares) * 100;
              const currentValue = companyValuation
                ? (percentage / 100) * companyValuation
                : null;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    hoveredIndex === index
                      ? "bg-white/10 border-white/30"
                      : "bg-white/5 border-white/10"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getShareClassColor(
                          sh.shareClass
                        ).replace("fill-", "bg-")}`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {sh.name}
                        </p>
                        <p className="text-xs text-white/60">{sh.shareClass}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {formatPercent(percentage)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{sh.shares.toLocaleString()} shares</span>
                    {sh.investmentAmount && (
                      <span>Invested: {formatCurrency(sh.investmentAmount)}</span>
                    )}
                  </div>

                  {currentValue && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Current Value</span>
                        <span className="font-semibold text-green-400">
                          {formatCurrency(currentValue)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/60 mb-1">Total Shares</p>
            <p className="text-sm font-semibold text-white">
              {totalShares.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/60 mb-1">Shareholders</p>
            <p className="text-sm font-semibold text-white">
              {shareholders.length}
            </p>
          </div>
          {totalInvestment > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-1">Total Invested</p>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(totalInvestment)}
              </p>
            </div>
          )}
          {companyValuation && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-1">Valuation</p>
              <p className="text-sm font-semibold text-green-400">
                {formatCurrency(companyValuation)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
