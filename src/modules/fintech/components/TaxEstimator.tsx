"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface TaxEstimatorProps {
  initialIncome?: number;
  initialDeductions?: number;
}

export function TaxEstimator({
  initialIncome = 100000,
  initialDeductions = 0,
}: TaxEstimatorProps) {
  const [grossIncome, setGrossIncome] = useState(initialIncome);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [businessType, setBusinessType] = useState<"llc" | "scorp" | "ccorp">("llc");

  // 2024 Federal Tax Brackets (simplified)
  const taxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 10 },
      { min: 11000, max: 44725, rate: 12 },
      { min: 44725, max: 95375, rate: 22 },
      { min: 95375, max: 182100, rate: 24 },
      { min: 182100, max: 231250, rate: 32 },
      { min: 231250, max: 578125, rate: 35 },
      { min: 578125, max: Infinity, rate: 37 },
    ],
    married: [
      { min: 0, max: 22000, rate: 10 },
      { min: 22000, max: 89075, rate: 12 },
      { min: 89075, max: 190750, rate: 22 },
      { min: 190750, max: 364200, rate: 24 },
      { min: 364200, max: 462500, rate: 32 },
      { min: 462500, max: 693750, rate: 35 },
      { min: 693750, max: Infinity, rate: 37 },
    ],
  };

  const standardDeduction = filingStatus === "single" ? 13850 : 27700;

  const calculateFederalTax = (taxableIncome: number) => {
    const brackets = taxBrackets[filingStatus];
    let tax = 0;

    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(
          taxableIncome - bracket.min,
          bracket.max - bracket.min
        );
        tax += (taxableInBracket * bracket.rate) / 100;
      }
    }

    return tax;
  };

  const calculateSelfEmploymentTax = (income: number) => {
    // Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare)
    // Only applies to first $160,200 for Social Security (2024 limit)
    const socialSecurityLimit = 160200;
    const netIncome = income * 0.9235; // 92.35% of net earnings

    const socialSecurityTax = Math.min(netIncome, socialSecurityLimit) * 0.124;
    const medicareTax = netIncome * 0.029;

    return socialSecurityTax + medicareTax;
  };

  const taxableIncome = Math.max(0, grossIncome - deductions - standardDeduction);
  const federalIncomeTax = calculateFederalTax(taxableIncome);

  // Self-employment tax only for LLC and S-Corp (simplified)
  const selfEmploymentTax =
    businessType === "llc" ? calculateSelfEmploymentTax(grossIncome - deductions) : 0;

  // Estimated state tax (simplified - using 5% average)
  const stateTax = taxableIncome * 0.05;

  const totalTax = federalIncomeTax + selfEmploymentTax + stateTax;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netIncome = grossIncome - totalTax;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Tax Estimator</h3>
          <p className="text-sm text-white/60">
            2024 Federal tax estimate (simplified)
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-4 mb-6">
          {/* Gross Income */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Gross Income
            </label>
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Deductions */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Business Deductions
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filing Status */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Filing Status
            </label>
            <div className="flex gap-2">
              <Button
                variant={filingStatus === "single" ? "primary" : "secondary"}
                onClick={() => setFilingStatus("single")}
                className="flex-1"
              >
                Single
              </Button>
              <Button
                variant={filingStatus === "married" ? "primary" : "secondary"}
                onClick={() => setFilingStatus("married")}
                className="flex-1"
              >
                Married
              </Button>
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Business Structure
            </label>
            <div className="flex gap-2">
              <Button
                variant={businessType === "llc" ? "primary" : "secondary"}
                onClick={() => setBusinessType("llc")}
                className="flex-1"
                size="sm"
              >
                LLC
              </Button>
              <Button
                variant={businessType === "scorp" ? "primary" : "secondary"}
                onClick={() => setBusinessType("scorp")}
                className="flex-1"
                size="sm"
              >
                S-Corp
              </Button>
              <Button
                variant={businessType === "ccorp" ? "primary" : "secondary"}
                onClick={() => setBusinessType("ccorp")}
                className="flex-1"
                size="sm"
              >
                C-Corp
              </Button>
            </div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <span className="text-sm text-white/60">Gross Income</span>
            <span className="text-sm font-semibold text-white">
              {formatCurrency(grossIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <span className="text-sm text-white/60">Business Deductions</span>
            <span className="text-sm font-semibold text-orange-400">
              -{formatCurrency(deductions)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <span className="text-sm text-white/60">
              Standard Deduction ({filingStatus})
            </span>
            <span className="text-sm font-semibold text-orange-400">
              -{formatCurrency(standardDeduction)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span className="text-sm font-semibold text-white">Taxable Income</span>
            <span className="text-sm font-semibold text-purple-400">
              {formatCurrency(taxableIncome)}
            </span>
          </div>

          <div className="border-t border-white/10 my-4"></div>

          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <span className="text-sm text-white/60">Federal Income Tax</span>
            <span className="text-sm font-semibold text-red-400">
              {formatCurrency(federalIncomeTax)}
            </span>
          </div>

          {selfEmploymentTax > 0 && (
            <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
              <span className="text-sm text-white/60">Self-Employment Tax</span>
              <span className="text-sm font-semibold text-red-400">
                {formatCurrency(selfEmploymentTax)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <span className="text-sm text-white/60">Est. State Tax (5%)</span>
            <span className="text-sm font-semibold text-red-400">
              {formatCurrency(stateTax)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="text-sm font-bold text-white">Total Tax Liability</span>
            <span className="text-lg font-bold text-red-400">
              {formatCurrency(totalTax)}
            </span>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-xs text-white/60 mb-1">Net Income</p>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(netIncome)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/60 mb-1">Effective Tax Rate</p>
            <p className="text-xl font-bold text-white">
              {formatPercent(effectiveTaxRate)}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">
            ⚠️ This is a simplified estimate. Consult a tax professional for
            accurate filing. Does not include additional deductions, credits, or
            state-specific rules.
          </p>
        </div>
      </div>
    </Card>
  );
}
