"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details?: string;
  severity: "info" | "warning" | "error" | "success";
}

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  maxEntries?: number;
}

export function ActivityLog({ entries, maxEntries = 50 }: ActivityLogProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");

  const users = ["all", ...new Set(entries.map((e) => e.user))];

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSeverity =
        filterSeverity === "all" || entry.severity === filterSeverity;
      const matchesUser = filterUser === "all" || entry.user === filterUser;
      return matchesSeverity && matchesUser;
    })
    .slice(0, maxEntries);

  const getSeverityIcon = (severity: ActivityLogEntry["severity"]) => {
    switch (severity) {
      case "success":
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getSeverityColor = (severity: ActivityLogEntry["severity"]) => {
    switch (severity) {
      case "success":
        return "bg-green-500/10 border-green-500/20";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "error":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const severityCounts = {
    info: entries.filter((e) => e.severity === "info").length,
    success: entries.filter((e) => e.severity === "success").length,
    warning: entries.filter((e) => e.severity === "warning").length,
    error: entries.filter((e) => e.severity === "error").length,
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Activity Log</h3>
            <p className="text-sm text-white/60">
              {filteredEntries.length} of {entries.length} entries
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {severityCounts.info}
            </p>
            <p className="text-xs text-white/60">Info</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">
              {severityCounts.success}
            </p>
            <p className="text-xs text-white/60">Success</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {severityCounts.warning}
            </p>
            <p className="text-xs text-white/60">Warning</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">
              {severityCounts.error}
            </p>
            <p className="text-xs text-white/60">Error</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-900">
              All Severity
            </option>
            <option value="info" className="bg-gray-900">
              Info
            </option>
            <option value="success" className="bg-gray-900">
              Success
            </option>
            <option value="warning" className="bg-gray-900">
              Warning
            </option>
            <option value="error" className="bg-gray-900">
              Error
            </option>
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {users.map((user) => (
              <option key={user} value={user} className="bg-gray-900">
                {user === "all" ? "All Users" : user}
              </option>
            ))}
          </select>
        </div>

        {/* Log Entries */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`border rounded-lg p-4 ${getSeverityColor(
                entry.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getSeverityIcon(entry.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {entry.action}
                      </span>
                      <span className="text-sm text-white/60">·</span>
                      <span className="text-sm text-white/60">
                        {entry.resource}
                      </span>
                    </div>
                    <span className="text-xs text-white/40">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">by {entry.user}</p>
                  {entry.details && (
                    <p className="text-xs text-white/40 mt-2">{entry.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No activity logs found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
