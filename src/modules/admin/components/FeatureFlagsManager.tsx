"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  environment: "development" | "staging" | "production" | "all";
  rolloutPercentage?: number;
}

interface FeatureFlagsManagerProps {
  flags: FeatureFlag[];
  onToggleFlag?: (flagId: string, enabled: boolean) => void;
  onUpdateRollout?: (flagId: string, percentage: number) => void;
}

export function FeatureFlagsManager({
  flags,
  onToggleFlag,
  onUpdateRollout,
}: FeatureFlagsManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterEnvironment, setFilterEnvironment] = useState<string>("all");

  const categories = ["all", ...new Set(flags.map((f) => f.category))];

  const filteredFlags = flags.filter((flag) => {
    const matchesCategory =
      filterCategory === "all" || flag.category === filterCategory;
    const matchesEnvironment =
      filterEnvironment === "all" ||
      flag.environment === filterEnvironment ||
      flag.environment === "all";
    return matchesCategory && matchesEnvironment;
  });

  const enabledCount = filteredFlags.filter((f) => f.enabled).length;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Features: "text-blue-400",
      UI: "text-purple-400",
      Backend: "text-green-400",
      Experiments: "text-yellow-400",
      Beta: "text-orange-400",
    };
    return colors[category] || "text-white/60";
  };

  const getEnvironmentBadge = (env: FeatureFlag["environment"]) => {
    const styles: Record<
      string,
      string
    > = {
      development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      staging: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      production: "bg-red-500/20 text-red-400 border-red-500/30",
      all: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return styles[env] || styles.all;
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Feature Flags Manager
            </h3>
            <p className="text-sm text-white/60">
              {enabledCount} of {filteredFlags.length} flags enabled
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-900">
              All Categories
            </option>
            {categories
              .filter((c) => c !== "all")
              .map((category) => (
                <option key={category} value={category} className="bg-gray-900">
                  {category}
                </option>
              ))}
          </select>

          <select
            value={filterEnvironment}
            onChange={(e) => setFilterEnvironment(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-900">
              All Environments
            </option>
            <option value="development" className="bg-gray-900">
              Development
            </option>
            <option value="staging" className="bg-gray-900">
              Staging
            </option>
            <option value="production" className="bg-gray-900">
              Production
            </option>
          </select>
        </div>

        {/* Flags List */}
        <div className="space-y-3">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`border rounded-lg p-4 transition-all ${
                flag.enabled
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Flag Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{flag.name}</h4>
                    <span
                      className={`text-xs font-semibold ${getCategoryColor(
                        flag.category
                      )}`}
                    >
                      {flag.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getEnvironmentBadge(
                        flag.environment
                      )}`}
                    >
                      {flag.environment}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">
                    {flag.description}
                  </p>

                  {/* Rollout Percentage */}
                  {flag.enabled && flag.rolloutPercentage !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-white/60">
                          Rollout: {flag.rolloutPercentage}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={flag.rolloutPercentage}
                          onChange={(e) =>
                            onUpdateRollout &&
                            onUpdateRollout(flag.id, Number(e.target.value))
                          }
                          className="flex-1 ml-4"
                        />
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                          style={{ width: `${flag.rolloutPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() =>
                    onToggleFlag && onToggleFlag(flag.id, !flag.enabled)
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    flag.enabled ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      flag.enabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFlags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No feature flags found.</p>
          </div>
        )}

        {/* Warning */}
        {filteredFlags.some(
          (f) => f.enabled && f.environment === "production"
        ) && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-1">
                  Production Flags Active
                </p>
                <p className="text-xs text-yellow-400/80">
                  You have feature flags enabled in production. Make sure they
                  are tested thoroughly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
