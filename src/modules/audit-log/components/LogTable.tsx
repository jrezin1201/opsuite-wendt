"use client";

import React from "react";
import type { AuditLogEntry } from "./AuditLogViewer";

interface LogTableProps {
  logs: AuditLogEntry[];
  viewMode: "table" | "timeline";
  onSelectLog: (log: AuditLogEntry) => void;
  selectedLogId?: string;
}

export function LogTable({ logs, viewMode, onSelectLog, selectedLogId }: LogTableProps) {
  if (viewMode === "timeline") {
    return <TimelineView logs={logs} onSelectLog={onSelectLog} selectedLogId={selectedLogId} />;
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                User
              </th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                Action
              </th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                Resource
              </th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left text-xs text-white/60 font-medium px-4 py-3 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-white/40">
                  No logs found matching your filters
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    selectedLogId === log.id ? "bg-purple-500/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-white">
                    <div>
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-white/40">
                      {log.timestamp.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div>{log.user.name}</div>
                    <div className="text-xs text-white/40">{log.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div>{log.resource.type}</div>
                    <div className="text-xs text-white/40">{log.resource.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">{log.location || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimelineView({ logs, onSelectLog, selectedLogId }: Omit<LogTableProps, "viewMode">) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            No logs found matching your filters
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className={`relative pl-8 pb-6 cursor-pointer ${
                selectedLogId === log.id ? "opacity-100" : "opacity-80 hover:opacity-100"
              } transition-opacity`}
            >
              {/* Timeline line */}
              {i < logs.length - 1 && (
                <div className="absolute left-3 top-6 w-0.5 h-full bg-white/10" />
              )}

              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  log.status === "success"
                    ? "bg-green-500/20 border-green-500"
                    : log.status === "failed"
                    ? "bg-red-500/20 border-red-500"
                    : "bg-yellow-500/20 border-yellow-500"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Event content */}
              <div className={`bg-white/5 border rounded-lg p-4 hover:bg-white/10 transition-colors ${
                selectedLogId === log.id ? "border-purple-500" : "border-white/10"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      {log.user.name} <span className="text-white/60">performed</span>{" "}
                      <span className={`font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </p>
                    <p className="text-xs text-white/40">
                      on {log.resource.type}: {log.resource.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{log.timestamp.toLocaleString()}</span>
                  <span>•</span>
                  <span>{log.location}</span>
                  <span>•</span>
                  <span>{log.ip}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getActionStyle(action: string): string {
  const styles: Record<string, string> = {
    create: "bg-green-500/20 text-green-400 border border-green-500/30",
    update: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    delete: "bg-red-500/20 text-red-400 border border-red-500/30",
    login: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    logout: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    access: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    export: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    config: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  return styles[action] || "bg-white/10 text-white/60";
}

function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    create: "text-green-400",
    update: "text-blue-400",
    delete: "text-red-400",
    login: "text-purple-400",
    logout: "text-gray-400",
    access: "text-cyan-400",
    export: "text-orange-400",
    config: "text-yellow-400",
  };
  return colors[action] || "text-white";
}

function getStatusStyle(status: string): string {
  const styles: Record<string, string> = {
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    failed: "bg-red-500/20 text-red-400 border border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  return styles[status] || "bg-white/10 text-white/60";
}
