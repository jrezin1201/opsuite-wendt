"use client";

import React from "react";

export type WidgetType = "kpi" | "line-chart" | "bar-chart" | "pie-chart" | "area-chart" | "table" | "progress";

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  config: Record<string, unknown>;
}

interface WidgetProps {
  widget: WidgetInstance;
  onSelect: () => void;
  onDelete: () => void;
  isSelected: boolean;
}

export function Widget({ widget, onSelect, onDelete, isSelected }: WidgetProps) {

  const renderContent = () => {
    switch (widget.type) {
      case "kpi":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-white/60 mb-2">{String(widget.config.title)}</p>
            <p className="text-3xl font-bold text-white mb-1">{String(widget.config.value)}</p>
            <p
              className={`text-sm font-medium ${widget.config.trendUp ? "text-green-400" : "text-red-400"}`}
            >
              {String(widget.config.trend)}
            </p>
          </div>
        );

      case "line-chart":
        return (
          <div className="p-4 h-full flex flex-col">
            <h4 className="text-sm font-semibold text-white mb-4">{String(widget.config.title)}</h4>
            <div className="flex-1 flex items-end justify-between gap-1">
              {Array.isArray(widget.config.data) && (widget.config.data as number[]).map((value: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t w-full transition-all hover:opacity-80"
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "bar-chart":
        return (
          <div className="p-4 h-full flex flex-col">
            <h4 className="text-sm font-semibold text-white mb-4">{String(widget.config.title)}</h4>
            <div className="flex-1 space-y-2">
              {Array.isArray(widget.config.data) && (widget.config.data as number[]).slice(0, 5).map((value: number, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-12">Item {i + 1}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-8">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "pie-chart": {
        const pieData = (widget.config.data as Array<{ label: string; value: number }>) || [];
        return (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full relative" style={{
              background: `conic-gradient(
                #8B5CF6 0deg ${pieData[0]?.value * 3.6 || 0}deg,
                #EC4899 ${pieData[0]?.value * 3.6 || 0}deg ${((pieData[0]?.value || 0) + (pieData[1]?.value || 0)) * 3.6}deg,
                #3B82F6 ${((pieData[0]?.value || 0) + (pieData[1]?.value || 0)) * 3.6}deg ${((pieData[0]?.value || 0) + (pieData[1]?.value || 0) + (pieData[2]?.value || 0)) * 3.6}deg,
                #10B981 ${((pieData[0]?.value || 0) + (pieData[1]?.value || 0) + (pieData[2]?.value || 0)) * 3.6}deg 360deg
              )`
            }}>
              <div className="absolute inset-4 bg-gray-900 rounded-full" />
            </div>
          </div>
        );
      }

      case "table":
        return (
          <div className="p-4 h-full flex flex-col">
            <h4 className="text-sm font-semibold text-white mb-3">{String(widget.config.title)}</h4>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    {Array.isArray(widget.config.headers) && (widget.config.headers as string[]).map((header: string, i: number) => (
                      <th key={i} className="text-left text-white/60 pb-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(widget.config.rows) && (widget.config.rows as string[][]).map((row: string[], i: number) => (
                    <tr key={i} className="border-b border-white/5">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 text-white/80">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="p-4 h-full flex flex-col justify-center">
            <p className="text-sm text-white/60 mb-3">{String(widget.config.title)}</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${(Number(widget.config.value) / Number(widget.config.max)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2 text-right">{String(widget.config.label)}</p>
          </div>
        );

      default:
        return <div className="p-4">Unknown widget type</div>;
    }
  };

  return (
    <div
      className={`relative bg-white/5 border-2 ${isSelected ? "border-purple-500" : "border-white/10"} rounded-lg overflow-hidden transition-all cursor-pointer hover:border-purple-500/50`}
      style={{
        gridColumn: `span ${widget.width}`,
        gridRow: `span ${widget.height}`,
        minHeight: widget.height === 1 ? "150px" : "300px",
      }}
      onClick={onSelect}
    >
      {/* Delete button */}
      <button
        className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ×
      </button>

      {renderContent()}
    </div>
  );
}
