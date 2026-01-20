"use client";

import { Card } from "@/components/ui/Card";

interface BurnRateGaugeProps {
  monthlyBurn: number;
  cashBalance: number;
  monthlyRevenue?: number;
}

export function BurnRateGauge({
  monthlyBurn,
  cashBalance,
  monthlyRevenue = 0,
}: BurnRateGaugeProps) {
  const netBurn = monthlyBurn - monthlyRevenue;
  const runwayMonths = netBurn > 0 ? cashBalance / netBurn : Infinity;
  const runwayDays = runwayMonths * 30;

  // Calculate gauge position (0-180 degrees for semi-circle)
  // Green zone: >12 months (0-60deg)
  // Yellow zone: 6-12 months (60-120deg)
  // Red zone: <6 months (120-180deg)
  const getGaugeRotation = () => {
    if (runwayMonths >= 18) return 0;
    if (runwayMonths >= 12) return 30;
    if (runwayMonths >= 9) return 60;
    if (runwayMonths >= 6) return 90;
    if (runwayMonths >= 3) return 120;
    if (runwayMonths >= 1) return 150;
    return 170;
  };

  const getRunwayColor = () => {
    if (runwayMonths >= 12) return "text-green-400";
    if (runwayMonths >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getRunwayStatus = () => {
    if (runwayMonths >= 18) return "Excellent";
    if (runwayMonths >= 12) return "Healthy";
    if (runwayMonths >= 6) return "Moderate";
    if (runwayMonths >= 3) return "Concerning";
    return "Critical";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const rotation = getGaugeRotation();

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Burn Rate Analysis</h3>
          <p className="text-sm text-white/60">Cash runway projection</p>
        </div>

        {/* Semi-Circle Gauge */}
        <div className="relative flex items-center justify-center mb-8">
          <svg
            viewBox="0 0 200 120"
            className="w-full max-w-sm"
            style={{ overflow: "visible" }}
          >
            {/* Background arc - Green zone */}
            <path
              d="M 20 100 A 80 80 0 0 1 60 30"
              fill="none"
              stroke="rgba(34, 197, 94, 0.2)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Background arc - Yellow zone */}
            <path
              d="M 60 30 A 80 80 0 0 1 140 30"
              fill="none"
              stroke="rgba(234, 179, 8, 0.2)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Background arc - Red zone */}
            <path
              d="M 140 30 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(239, 68, 68, 0.2)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Needle */}
            <g transform="translate(100, 100)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${rotation - 90})`}
                style={{ transition: "transform 0.5s ease-out" }}
              />
              <circle cx="0" cy="0" r="6" fill="white" />
            </g>

            {/* Labels */}
            <text
              x="20"
              y="115"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
              textAnchor="start"
            >
              18+ mo
            </text>
            <text
              x="100"
              y="20"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
              textAnchor="middle"
            >
              6 mo
            </text>
            <text
              x="180"
              y="115"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
              textAnchor="end"
            >
              0 mo
            </text>
          </svg>
        </div>

        {/* Runway Display */}
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${getRunwayColor()}`}>
            {runwayMonths === Infinity ? "∞" : runwayMonths.toFixed(1)}
            {runwayMonths !== Infinity && (
              <span className="text-2xl ml-1">months</span>
            )}
          </div>
          <div className="text-sm text-white/60">
            {runwayMonths !== Infinity && `~${Math.round(runwayDays)} days`}
          </div>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              runwayMonths >= 12
                ? "bg-green-500/20 text-green-400"
                : runwayMonths >= 6
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {getRunwayStatus()}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/60 mb-1">Cash Balance</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(cashBalance)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/60 mb-1">Monthly Burn</p>
            <p className="text-lg font-semibold text-red-400">
              {formatCurrency(monthlyBurn)}
            </p>
          </div>
          {monthlyRevenue > 0 && (
            <>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-xs text-white/60 mb-1">Monthly Revenue</p>
                <p className="text-lg font-semibold text-green-400">
                  {formatCurrency(monthlyRevenue)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-xs text-white/60 mb-1">Net Burn</p>
                <p className="text-lg font-semibold text-orange-400">
                  {formatCurrency(netBurn)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Alert */}
        {runwayMonths < 6 && runwayMonths !== Infinity && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs text-red-400">
              ⚠️ Critical: Less than 6 months runway remaining. Consider
              fundraising or reducing burn rate.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
