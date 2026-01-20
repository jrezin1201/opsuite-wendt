"use client";

import React from "react";
import type { WidgetType } from "./Widget";

interface WidgetLibraryProps {
  onAddWidget: (type: WidgetType) => void;
}

const widgets: { type: WidgetType; label: string; icon: string; description: string }[] = [
  { type: "kpi", label: "KPI Card", icon: "📊", description: "Big number with trend" },
  { type: "line-chart", label: "Line Chart", icon: "📈", description: "Time series data" },
  { type: "bar-chart", label: "Bar Chart", icon: "📊", description: "Compare categories" },
  { type: "pie-chart", label: "Pie Chart", icon: "🥧", description: "Show proportions" },
  { type: "table", label: "Data Table", icon: "📋", description: "Tabular data" },
  { type: "progress", label: "Progress Bar", icon: "⏳", description: "Track progress" },
];

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  return (
    <div className="w-64 bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-white mb-1">Widget Library</h3>
        <p className="text-xs text-white/40">Click to add to dashboard</p>
      </div>

      <div className="space-y-2">
        {widgets.map((widget) => (
          <button
            key={widget.type}
            onClick={() => onAddWidget(widget.type)}
            className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{widget.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                  {widget.label}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{widget.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-white/40">
          Drag widgets to reorder, click to configure
        </p>
      </div>
    </div>
  );
}
