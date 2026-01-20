"use client";

import { Card } from "@/components/ui/Card";

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  averageSessionTime: string;
  conversionRate: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  period?: "7d" | "30d" | "90d" | "1y";
}

export function AnalyticsDashboard({
  data,
  period = "30d",
}: AnalyticsDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "1y":
        return "Last year";
    }
  };

  const metrics = [
    {
      label: "Total Users",
      value: formatNumber(data.totalUsers),
      change: data.monthlyGrowth,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Active Users",
      value: formatNumber(data.activeUsers),
      subValue: `${((data.activeUsers / data.totalUsers) * 100).toFixed(1)}% of total`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      change: data.monthlyGrowth * 0.8,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Conversion Rate",
      value: `${data.conversionRate.toFixed(1)}%`,
      subValue: `${data.conversionRate > 3 ? "Above" : "Below"} industry avg`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Analytics Dashboard
            </h3>
            <p className="text-sm text-white/60">{getPeriodLabel()}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white`}
                >
                  {metric.icon}
                </div>
                {metric.change !== undefined && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      metric.change >= 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {formatPercent(metric.change)}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/60 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-white mb-1">
                {metric.value}
              </p>
              {metric.subValue && (
                <p className="text-xs text-white/40">{metric.subValue}</p>
              )}
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">
            User Growth Trend
          </h4>
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 72, 68, 80, 85, 78, 90, 95, 88, 100, 105, 98].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`Week ${index + 1}: ${Math.round(
                    (data.totalUsers * height) / 100
                  )} users`}
                />
              )
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-white/40">12 weeks ago</span>
            <span className="text-xs text-white/40">Today</span>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/60 mb-2">Avg Session Time</p>
            <p className="text-2xl font-bold text-white">
              {data.averageSessionTime}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/60 mb-2">Bounce Rate</p>
            <p className="text-2xl font-bold text-white">34.2%</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/60 mb-2">Pages per Session</p>
            <p className="text-2xl font-bold text-white">4.7</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
