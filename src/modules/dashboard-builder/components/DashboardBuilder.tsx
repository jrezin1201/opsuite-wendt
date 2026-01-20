"use client";

import React, { useState } from "react";
import { WidgetLibrary } from "./WidgetLibrary";
import { Widget, type WidgetInstance, type WidgetType } from "./Widget";
import { WidgetConfig } from "./WidgetConfig";

export function DashboardBuilder() {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([
    {
      id: "1",
      type: "kpi",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      config: {
        title: "Total Revenue",
        value: "$124,500",
        trend: "+12.5%",
        trendUp: true,
      },
    },
    {
      id: "2",
      type: "line-chart",
      x: 1,
      y: 0,
      width: 2,
      height: 2,
      config: {
        title: "Revenue Trend",
        data: [65, 72, 68, 80, 85, 78, 90, 95, 88, 100, 105, 98],
      },
    },
  ]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const addWidget = (type: WidgetType) => {
    setWidgets((prev) => {
      const newWidget: WidgetInstance = {
        id: `widget-${prev.length + 1}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        x: 0,
        y: Math.max(...prev.map((w) => w.y + w.height), 0),
        width: type === "kpi" ? 1 : 2,
        height: type === "kpi" || type === "progress" ? 1 : 2,
        config: getDefaultConfig(type),
      };
      return [...prev, newWidget];
    });
  };

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
    setSelectedWidget(null);
  };

  const updateWidgetConfig = (id: string, config: Record<string, unknown>) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, config: { ...w.config, ...config } } : w))
    );
  };

  const getDefaultConfig = (type: WidgetType): Record<string, unknown> => {
    switch (type) {
      case "kpi":
        return { title: "New KPI", value: "0", trend: "+0%", trendUp: true };
      case "line-chart":
        return {
          title: "Line Chart",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 85, 88, 92, 95],
        };
      case "bar-chart":
        return {
          title: "Bar Chart",
          data: [45, 52, 38, 65, 58, 72, 68, 85, 78, 90, 88, 95],
        };
      case "pie-chart":
        return {
          title: "Pie Chart",
          data: [
            { label: "Product A", value: 35 },
            { label: "Product B", value: 25 },
            { label: "Product C", value: 20 },
            { label: "Product D", value: 20 },
          ],
        };
      case "table":
        return {
          title: "Data Table",
          headers: ["Name", "Value", "Change"],
          rows: [
            ["Item 1", "$1,234", "+5%"],
            ["Item 2", "$2,345", "-2%"],
            ["Item 3", "$3,456", "+8%"],
          ],
        };
      case "progress":
        return { title: "Progress", value: 75, max: 100, label: "75%" };
      default:
        return {};
    }
  };

  const selectedWidgetData = widgets.find((w) => w.id === selectedWidget);

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-gray-900" : "relative"} transition-all`}
    >
      <div className="flex gap-4 h-full">
        {/* Widget Library Sidebar */}
        {!isFullscreen && <WidgetLibrary onAddWidget={addWidget} />}

        {/* Main Dashboard Area */}
        <div className="flex-1 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-white">My Dashboard</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "90d")}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => console.log("Save dashboard")}
                className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm font-medium transition-colors"
              >
                Save Layout
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-sm border border-white/10 transition-colors"
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 min-h-[600px]">
            <div className="grid grid-cols-4 gap-4 relative">
              {widgets.map((widget) => (
                <Widget
                  key={widget.id}
                  widget={widget}
                  onSelect={() => setSelectedWidget(widget.id)}
                  onDelete={() => deleteWidget(widget.id)}
                  isSelected={selectedWidget === widget.id}
                />
              ))}
              {widgets.length === 0 && (
                <div className="col-span-4 text-center py-20">
                  <p className="text-white/40 text-lg mb-2">
                    Your dashboard is empty
                  </p>
                  <p className="text-white/20 text-sm">
                    Drag widgets from the sidebar to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Config Panel */}
        {!isFullscreen && selectedWidgetData && (
          <WidgetConfig
            widget={selectedWidgetData}
            onUpdate={(config) => updateWidgetConfig(selectedWidgetData.id, config)}
            onClose={() => setSelectedWidget(null)}
          />
        )}
      </div>
    </div>
  );
}
