"use client";

import React, { useState } from "react";
import type { WidgetInstance } from "./Widget";

interface WidgetConfigProps {
  widget: WidgetInstance;
  onUpdate: (config: Record<string, unknown>) => void;
  onClose: () => void;
}

export function WidgetConfig({ widget, onUpdate, onClose }: WidgetConfigProps) {
  const [config, setConfig] = useState(widget.config);

  const handleChange = (key: string, value: unknown) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(newConfig);
  };

  return (
    <div className="w-80 bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Widget Settings</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          ×
        </button>
      </div>

      {/* Config Form */}
      <div className="space-y-3">
        {/* Title */}
        <div>
          <label className="text-xs text-white/60 block mb-1.5">Title</label>
          <input
            type="text"
            value={String(config.title || "")}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* KPI specific */}
        {widget.type === "kpi" && (
          <>
            <div>
              <label className="text-xs text-white/60 block mb-1.5">Value</label>
              <input
                type="text"
                value={String(config.value || "")}
                onChange={(e) => handleChange("value", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1.5">Trend</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={String(config.trend || "")}
                  onChange={(e) => handleChange("trend", e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => handleChange("trendUp", !config.trendUp)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    config.trendUp
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {config.trendUp ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Progress specific */}
        {widget.type === "progress" && (
          <>
            <div>
              <label className="text-xs text-white/60 block mb-1.5">
                Progress: {String(config.value)}/{String(config.max)}
              </label>
              <input
                type="range"
                min="0"
                max={Number(config.max || 100)}
                value={Number(config.value || 0)}
                onChange={(e) => handleChange("value", parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1.5">Label</label>
              <input
                type="text"
                value={String(config.label || "")}
                onChange={(e) => handleChange("label", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </>
        )}

        {/* Data Source (for charts) */}
        {(widget.type === "line-chart" || widget.type === "bar-chart") && (
          <div>
            <label className="text-xs text-white/60 block mb-1.5">Data Source</label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Revenue (mock)</option>
              <option>Users (mock)</option>
              <option>Sessions (mock)</option>
            </select>
          </div>
        )}

        {/* Color Scheme */}
        <div>
          <label className="text-xs text-white/60 block mb-1.5">Color Scheme</label>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white" />
            <button className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white/20" />
            <button className="w-8 h-8 rounded bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-white/20" />
            <button className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-500 border-2 border-white/20" />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="pt-3 border-t border-white/10">
        <label className="text-xs text-white/60 block mb-2">Widget Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-white/40 mb-1">Width</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((w) => (
                <button
                  key={w}
                  className={`flex-1 px-2 py-1 rounded text-xs ${widget.width === w ? "bg-purple-500 text-white" : "bg-white/5 text-white/60"}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Height</p>
            <div className="flex gap-1">
              {[1, 2].map((h) => (
                <button
                  key={h}
                  className={`flex-1 px-2 py-1 rounded text-xs ${widget.height === h ? "bg-purple-500 text-white" : "bg-white/5 text-white/60"}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
