"use client";

import React from "react";
import type { AuditLogEntry } from "./AuditLogViewer";

interface LogStatsProps {
  logs: AuditLogEntry[];
  filteredLogs: AuditLogEntry[];
}

export function LogStats({ logs, filteredLogs }: LogStatsProps) {
  const totalEvents = logs.length;
  const successCount = filteredLogs.filter((log) => log.status === "success").length;
  const failedCount = filteredLogs.filter((log) => log.status === "failed").length;
  const uniqueUsers = new Set(filteredLogs.map((log) => log.user.id)).size;

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      change: "+12%",
      trend: "up" as const,
      icon: "📊",
    },
    {
      label: "Success Rate",
      value: `${Math.round((successCount / (filteredLogs.length || 1)) * 100)}%`,
      change: "+2.5%",
      trend: "up" as const,
      icon: "✅",
    },
    {
      label: "Failed Events",
      value: failedCount,
      change: "-8%",
      trend: "down" as const,
      icon: "❌",
    },
    {
      label: "Active Users",
      value: uniqueUsers,
      change: "+5",
      trend: "up" as const,
      icon: "👥",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                stat.trend === "up"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-white/60 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
