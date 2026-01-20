"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";

export interface HealthMetric {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime?: number;
  uptime?: number;
  lastChecked: Date;
}

interface SystemHealthMonitorProps {
  metrics?: HealthMetric[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SystemHealthMonitor({
  metrics: initialMetrics,
  autoRefresh = false,
  refreshInterval = 30000,
}: SystemHealthMonitorProps) {
  const [metrics] = useState<HealthMetric[]>(
    initialMetrics || [
      {
        name: "API Server",
        status: "healthy",
        responseTime: 45,
        uptime: 99.9,
        lastChecked: new Date(),
      },
      {
        name: "Database",
        status: "healthy",
        responseTime: 12,
        uptime: 99.99,
        lastChecked: new Date(),
      },
      {
        name: "Cache (Redis)",
        status: "healthy",
        responseTime: 3,
        uptime: 99.95,
        lastChecked: new Date(),
      },
      {
        name: "CDN",
        status: "degraded",
        responseTime: 180,
        uptime: 98.5,
        lastChecked: new Date(),
      },
      {
        name: "Email Service",
        status: "healthy",
        responseTime: 120,
        uptime: 99.8,
        lastChecked: new Date(),
      },
      {
        name: "Payment Gateway",
        status: "healthy",
        responseTime: 250,
        uptime: 99.99,
        lastChecked: new Date(),
      },
    ]
  );

  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In production, fetch real health data from /api/health
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBgColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 border-green-500/20";
      case "degraded":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "down":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <svg
            className="w-5 h-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "degraded":
        return (
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const overallStatus = metrics.every((m) => m.status === "healthy")
    ? "All Systems Operational"
    : metrics.some((m) => m.status === "down")
    ? "Major Outage"
    : "Partial Outage";

  const healthyCount = metrics.filter((m) => m.status === "healthy").length;
  const degradedCount = metrics.filter((m) => m.status === "degraded").length;
  const downCount = metrics.filter((m) => m.status === "down").length;

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              System Health Monitor
            </h3>
            <p className="text-sm text-white/60">
              Real-time infrastructure status
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-bold ${
                overallStatus === "All Systems Operational"
                  ? "text-green-400"
                  : overallStatus === "Major Outage"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {overallStatus}
            </div>
            <p className="text-xs text-white/60">
              Last checked: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{healthyCount}</p>
            <p className="text-xs text-white/60">Healthy</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{degradedCount}</p>
            <p className="text-xs text-white/60">Degraded</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{downCount}</p>
            <p className="text-xs text-white/60">Down</p>
          </div>
        </div>

        {/* Metrics List */}
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getStatusBgColor(
                metric.status
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <h4 className="font-semibold text-white">{metric.name}</h4>
                    <p className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status.charAt(0).toUpperCase() +
                        metric.status.slice(1)}
                    </p>
                  </div>
                </div>

                {metric.responseTime && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {metric.responseTime}ms
                    </p>
                    <p className="text-xs text-white/60">Response Time</p>
                  </div>
                )}
              </div>

              {metric.uptime !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">Uptime</span>
                    <span className="text-xs font-semibold text-white">
                      {metric.uptime}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        metric.uptime >= 99.9
                          ? "bg-green-500"
                          : metric.uptime >= 95
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${metric.uptime}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 Monitoring {metrics.length} services. Auto-refresh:{" "}
            {autoRefresh ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>
    </Card>
  );
}
