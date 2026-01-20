"use client";

import React, { useState } from "react";
import type { LogFiltersState, AuditLogEntry } from "./AuditLogViewer";

interface LogFiltersProps {
  filters: LogFiltersState;
  onChange: (filters: LogFiltersState) => void;
  logs: AuditLogEntry[];
}

export function LogFilters({ filters, onChange, logs }: LogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user.name)));
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueResources = Array.from(new Set(logs.map((log) => log.resource.type)));

  const handleToggle = (key: "users" | "actions" | "resources" | "status", value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onChange({ ...filters, [key]: newValues });
  };

  const clearFilters = () => {
    onChange({
      search: "",
      users: [],
      actions: [],
      resources: [],
      dateRange: { start: null, end: null },
      status: [],
    });
  };

  const activeFilterCount =
    (filters.users.length || 0) +
    (filters.actions.length || 0) +
    (filters.resources.length || 0) +
    (filters.status.length || 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="px-2 py-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-white/10 space-y-4">
          {/* Search */}
          <div>
            <label className="text-xs text-white/60 block mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Search by user, action, resource..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Users */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Users</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {uniqueUsers.map((user) => (
                  <label key={user} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                    <input
                      type="checkbox"
                      checked={filters.users.includes(user)}
                      onChange={() => handleToggle("users", user)}
                      className="rounded"
                    />
                    <span className="text-sm text-white">{user}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Actions</label>
              <div className="space-y-1">
                {uniqueActions.map((action) => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                    <input
                      type="checkbox"
                      checked={filters.actions.includes(action)}
                      onChange={() => handleToggle("actions", action)}
                      className="rounded"
                    />
                    <span className="text-sm text-white capitalize">{action}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Resources</label>
              <div className="space-y-1">
                {uniqueResources.map((resource) => (
                  <label key={resource} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                    <input
                      type="checkbox"
                      checked={filters.resources.includes(resource)}
                      onChange={() => handleToggle("resources", resource)}
                      className="rounded"
                    />
                    <span className="text-sm text-white">{resource}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Status</label>
              <div className="space-y-1">
                {["success", "failed", "warning"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleToggle("status", status)}
                      className="rounded"
                    />
                    <span className="text-sm text-white capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
