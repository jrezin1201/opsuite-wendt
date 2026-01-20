"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ROIInputs {
  currentCost: number;
  proposedCost: number;
  timeValue: number; // hours saved per month
  hourlyRate: number;
  implementationCost: number;
  timelineMonths: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    currentCost: 5000,
    proposedCost: 3000,
    timeValue: 40,
    hourlyRate: 75,
    implementationCost: 2000,
    timelineMonths: 12,
  });

  const updateInput = (field: keyof ROIInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  const calculations = useMemo(() => {
    const monthlyCostSavings = inputs.currentCost - inputs.proposedCost;
    const monthlyTimeSavings = inputs.timeValue * inputs.hourlyRate;
    const totalMonthlySavings = monthlyCostSavings + monthlyTimeSavings;
    const totalSavings = totalMonthlySavings * inputs.timelineMonths;
    const netSavings = totalSavings - inputs.implementationCost;
    const roi = inputs.implementationCost > 0
      ? ((netSavings / inputs.implementationCost) * 100)
      : 0;
    const paybackMonths = totalMonthlySavings > 0
      ? Math.ceil(inputs.implementationCost / totalMonthlySavings)
      : 0;

    // Generate monthly data for chart
    const monthlyData = Array.from({ length: inputs.timelineMonths }, (_, i) => {
      const month = i + 1;
      const cumulativeSavings = totalMonthlySavings * month;
      const netCumulative = cumulativeSavings - inputs.implementationCost;
      return {
        month,
        cumulative: cumulativeSavings,
        net: netCumulative,
        breakeven: netCumulative >= 0,
      };
    });

    return {
      monthlyCostSavings,
      monthlyTimeSavings,
      totalMonthlySavings,
      totalSavings,
      netSavings,
      roi,
      paybackMonths,
      monthlyData,
    };
  }, [inputs]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const handleExport = () => {
    const summary = `
ROI Calculation Summary
====================

Inputs:
- Current Cost: ${formatCurrency(inputs.currentCost)}/mo
- Proposed Cost: ${formatCurrency(inputs.proposedCost)}/mo
- Time Savings: ${inputs.timeValue} hrs/mo @ ${formatCurrency(inputs.hourlyRate)}/hr
- Implementation Cost: ${formatCurrency(inputs.implementationCost)}
- Timeline: ${inputs.timelineMonths} months

Results:
- Monthly Savings: ${formatCurrency(calculations.totalMonthlySavings)}
- Total Savings: ${formatCurrency(calculations.totalSavings)}
- Net Savings: ${formatCurrency(calculations.netSavings)}
- ROI: ${calculations.roi.toFixed(1)}%
- Payback Period: ${calculations.paybackMonths} months
    `.trim();

    navigator.clipboard.writeText(summary);
    alert("ROI summary copied to clipboard!");
  };

  const maxValue = Math.max(
    ...calculations.monthlyData.map((d) => Math.abs(d.cumulative))
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ROI Calculator</h1>
        <p className="text-white/60">
          Calculate return on investment for your solution
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <div className="p-6 space-y-6">
            <h3 className="font-semibold text-white text-lg">Input Parameters</h3>

            {/* Cost Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Current Monthly Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/40">$</span>
                  <input
                    type="number"
                    value={inputs.currentCost}
                    onChange={(e) => updateInput("currentCost", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Proposed Monthly Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/40">$</span>
                  <input
                    type="number"
                    value={inputs.proposedCost}
                    onChange={(e) => updateInput("proposedCost", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Time Saved (hours/month)
                </label>
                <input
                  type="number"
                  value={inputs.timeValue}
                  onChange={(e) => updateInput("timeValue", e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Hourly Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/40">$</span>
                  <input
                    type="number"
                    value={inputs.hourlyRate}
                    onChange={(e) => updateInput("hourlyRate", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Implementation Cost (one-time)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/40">$</span>
                  <input
                    type="number"
                    value={inputs.implementationCost}
                    onChange={(e) => updateInput("implementationCost", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Timeline (months)
                </label>
                <input
                  type="number"
                  value={inputs.timelineMonths}
                  onChange={(e) => updateInput("timelineMonths", e.target.value)}
                  min="1"
                  max="60"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-white text-lg mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60 mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(calculations.totalMonthlySavings)}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60 mb-1">Total Savings</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(calculations.totalSavings)}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60 mb-1">ROI</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {calculations.roi.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60 mb-1">Payback Period</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {calculations.paybackMonths} mo
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-lg">
                  Cumulative Savings
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-white/60">Gross</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-white/60">Net</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {calculations.monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <div className="w-12 text-sm text-white/60">
                      Mo {data.month}
                    </div>
                    <div className="flex-1 relative h-8">
                      {/* Background */}
                      <div className="absolute inset-0 bg-white/5 rounded"></div>

                      {/* Gross bar */}
                      <div
                        className="absolute top-0 left-0 h-full bg-purple-500/40 rounded transition-all"
                        style={{
                          width: `${(data.cumulative / maxValue) * 100}%`,
                        }}
                      ></div>

                      {/* Net bar */}
                      <div
                        className={`absolute top-0 left-0 h-full rounded transition-all ${
                          data.breakeven ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{
                          width: `${(Math.abs(data.net) / maxValue) * 100}%`,
                          opacity: 0.7,
                        }}
                      ></div>

                      {/* Value label */}
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(data.net)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Export */}
          <Button onClick={handleExport} className="w-full">
            Copy Summary to Clipboard
          </Button>
        </div>
      </div>
    </div>
  );
}
