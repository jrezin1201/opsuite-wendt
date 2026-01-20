"use client";

import React, { useState } from "react";
import { LogTable } from "./LogTable";
import { LogFilters } from "./LogFilters";
import { LogDetails } from "./LogDetails";
import { LogStats } from "./LogStats";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  action: "create" | "update" | "delete" | "login" | "logout" | "access" | "export" | "config";
  resource: {
    type: string;
    id: string;
    name: string;
  };
  details: Record<string, unknown>;
  ip: string;
  location?: string;
  status: "success" | "failed" | "warning";
}

export interface LogFiltersState {
  search: string;
  users: string[];
  actions: string[];
  resources: string[];
  dateRange: { start: Date | null; end: Date | null };
  status: string[];
}

export function AuditLogViewer() {
  const [logs] = useState<AuditLogEntry[]>(generateMockLogs());
  const [filters, setFilters] = useState<LogFiltersState>({
    search: "",
    users: [],
    actions: [],
    resources: [],
    dateRange: { start: null, end: null },
    status: [],
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");

  const filteredLogs = logs.filter((log) => {
    if (filters.search && !JSON.stringify(log).toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.users.length > 0 && !filters.users.includes(log.user.id)) {
      return false;
    }
    if (filters.actions.length > 0 && !filters.actions.includes(log.action)) {
      return false;
    }
    if (filters.resources.length > 0 && !filters.resources.includes(log.resource.type)) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(log.status)) {
      return false;
    }
    if (filters.dateRange.start && log.timestamp < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && log.timestamp > filters.dateRange.end) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <LogStats logs={logs} filteredLogs={filteredLogs} />

      {/* Controls */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Audit Log</h3>
          <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              viewMode === "table"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              viewMode === "timeline"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            Timeline
          </button>
          <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-sm border border-white/10 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <LogFilters
        filters={filters}
        onChange={setFilters}
        logs={logs}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedLog ? "lg:col-span-2" : "lg:col-span-3"}>
          <LogTable
            logs={filteredLogs}
            viewMode={viewMode}
            onSelectLog={setSelectedLog}
            selectedLogId={selectedLog?.id}
          />
        </div>

        {selectedLog && (
          <div className="lg:col-span-1">
            <LogDetails
              log={selectedLog}
              onClose={() => setSelectedLog(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function generateMockLogs(): AuditLogEntry[] {
  const users = [
    { id: "1", name: "Sarah Chen", email: "sarah@company.com" },
    { id: "2", name: "Mike Rodriguez", email: "mike@company.com" },
    { id: "3", name: "Emily Johnson", email: "emily@company.com" },
    { id: "4", name: "David Kim", email: "david@company.com" },
  ];

  const actions: AuditLogEntry["action"][] = ["create", "update", "delete", "login", "logout", "access", "export", "config"];
  const resources = [
    { type: "User", name: "User Account" },
    { type: "Deal", name: "Sales Deal" },
    { type: "Document", name: "Document" },
    { type: "Settings", name: "System Settings" },
    { type: "Report", name: "Analytics Report" },
  ];
  const statuses: AuditLogEntry["status"][] = ["success", "success", "success", "success", "failed", "warning"];

  return Array.from({ length: 50 }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      user,
      action,
      resource: {
        type: resource.type,
        id: `${resource.type.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        name: `${resource.name} #${Math.floor(Math.random() * 1000)}`,
      },
      details: {
        changes: action === "update" ? { field: "status", old: "draft", new: "published" } : undefined,
        reason: action === "delete" ? "User requested deletion" : undefined,
      },
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: ["San Francisco, CA", "New York, NY", "London, UK", "Singapore"][Math.floor(Math.random() * 4)],
      status,
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
