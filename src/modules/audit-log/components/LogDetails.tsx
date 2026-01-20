"use client";

import React from "react";
import type { AuditLogEntry } from "./AuditLogViewer";

interface LogDetailsProps {
  log: AuditLogEntry;
  onClose: () => void;
}

export function LogDetails({ log, onClose }: LogDetailsProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden sticky top-6">
      {/* Header */}
      <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-white">Event Details</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-center py-3">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              log.status === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : log.status === "failed"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            {log.status.toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">User</p>
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium text-white">{log.user.name}</p>
            <p className="text-xs text-white/60">{log.user.email}</p>
            <p className="text-xs text-white/40">ID: {log.user.id}</p>
          </div>
        </div>

        {/* Action */}
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Action</p>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm font-medium text-white capitalize">{log.action}</p>
          </div>
        </div>

        {/* Resource */}
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Resource</p>
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium text-white">{log.resource.type}</p>
            <p className="text-xs text-white/60">{log.resource.name}</p>
            <p className="text-xs text-white/40">ID: {log.resource.id}</p>
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Timestamp</p>
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            <p className="text-sm text-white">{log.timestamp.toLocaleTimeString()}</p>
            <p className="text-xs text-white/60">{log.timestamp.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Location</p>
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            <p className="text-sm text-white">{log.location || "Unknown"}</p>
            <p className="text-xs text-white/60">IP: {log.ip}</p>
          </div>
        </div>

        {/* Details */}
        {Object.keys(log.details).length > 0 && (
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Additional Details</p>
            <div className="bg-white/5 rounded-lg p-3">
              <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 space-y-2">
          <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
            View Related Events
          </button>
          <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/10 transition-colors">
            Export Event Data
          </button>
        </div>
      </div>
    </div>
  );
}
