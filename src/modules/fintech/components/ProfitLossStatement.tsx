"use client";

import { Card } from "@/components/ui/Card";

export interface PLLineItem {
  category: string;
  amount: number;
  subcategories?: PLLineItem[];
}

interface ProfitLossStatementProps {
  data: {
    revenue: PLLineItem[];
    cogs: PLLineItem[];
    opex: PLLineItem[];
    period: string;
  };
}

export function ProfitLossStatement({ data }: ProfitLossStatementProps) {
  const calculateTotal = (items: PLLineItem[]): number => {
    return items.reduce((sum, item) => {
      const itemTotal = item.amount + (item.subcategories ? calculateTotal(item.subcategories) : 0);
      return sum + itemTotal;
    }, 0);
  };

  const totalRevenue = calculateTotal(data.revenue);
  const totalCOGS = calculateTotal(data.cogs);
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const totalOpex = calculateTotal(data.opex);
  const ebitda = grossProfit - totalOpex;
  const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const renderLineItems = (items: PLLineItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div
          className={`flex items-center justify-between py-2 px-4 ${
            depth === 0 ? "bg-white/5" : ""
          } ${depth > 0 ? "ml-8" : ""}`}
        >
          <span
            className={`${
              depth === 0 ? "font-semibold text-white" : "text-white/60"
            } text-sm`}
          >
            {item.category}
          </span>
          <span
            className={`${
              depth === 0 ? "font-semibold text-white" : "text-white/60"
            } text-sm`}
          >
            {formatCurrency(item.amount)}
          </span>
        </div>
        {item.subcategories && renderLineItems(item.subcategories, depth + 1)}
      </div>
    ));
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">
            Profit & Loss Statement
          </h3>
          <p className="text-sm text-white/60">{data.period}</p>
        </div>

        {/* Revenue */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-3 px-4 bg-green-500/10 border-l-4 border-green-500 mb-2">
            <span className="font-bold text-white">Total Revenue</span>
            <span className="font-bold text-green-400">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          {renderLineItems(data.revenue)}
        </div>

        {/* COGS */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-3 px-4 bg-red-500/10 border-l-4 border-red-500 mb-2">
            <span className="font-bold text-white">Cost of Goods Sold</span>
            <span className="font-bold text-red-400">
              ({formatCurrency(totalCOGS)})
            </span>
          </div>
          {renderLineItems(data.cogs)}
        </div>

        {/* Gross Profit */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-3 px-4 bg-purple-500/10 border-l-4 border-purple-500">
            <div>
              <span className="font-bold text-white block">Gross Profit</span>
              <span className="text-xs text-white/60">
                {formatPercent(grossMargin)} margin
              </span>
            </div>
            <span className="font-bold text-purple-400">
              {formatCurrency(grossProfit)}
            </span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-3 px-4 bg-orange-500/10 border-l-4 border-orange-500 mb-2">
            <span className="font-bold text-white">Operating Expenses</span>
            <span className="font-bold text-orange-400">
              ({formatCurrency(totalOpex)})
            </span>
          </div>
          {renderLineItems(data.opex)}
        </div>

        {/* EBITDA */}
        <div className="border-t-2 border-white/20 pt-4">
          <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 rounded-lg">
            <div>
              <span className="font-bold text-white text-lg block">EBITDA</span>
              <span className="text-xs text-white/60">
                {formatPercent(ebitdaMargin)} margin
              </span>
            </div>
            <span
              className={`font-bold text-lg ${
                ebitda >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(ebitda)}
            </span>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-xs text-white/60 mb-1">Revenue</p>
            <p className="text-sm font-semibold text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-xs text-white/60 mb-1">Gross Margin</p>
            <p className="text-sm font-semibold text-purple-400">
              {grossMargin.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-xs text-white/60 mb-1">EBITDA Margin</p>
            <p
              className={`text-sm font-semibold ${
                ebitdaMargin >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {ebitdaMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
