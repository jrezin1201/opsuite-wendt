"use client";

import React from "react";
import type { Tool } from "./CollaborationCanvas";

interface ToolbarProps {
  currentTool: Tool;
  onSelectTool: (tool: Tool) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const tools: { id: Tool; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "sticky", label: "Sticky Note", icon: "📝" },
  { id: "text", label: "Text", icon: "T" },
  { id: "rect", label: "Rectangle", icon: "▭" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "draw", label: "Draw", icon: "✏" },
];

export function Toolbar({ currentTool, onSelectTool, zoom, onZoomChange }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 flex items-center gap-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          className={`w-10 h-10 rounded flex items-center justify-center text-lg transition-all ${
            currentTool === tool.id
              ? "bg-purple-500 text-white shadow-lg"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}

      <div className="w-px h-8 bg-white/20 mx-2" />

      {/* Zoom controls */}
      <button
        onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
        className="w-10 h-10 rounded bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
      >
        −
      </button>
      <span className="text-sm text-white/60 w-12 text-center">{Math.round(zoom * 100)}%</span>
      <button
        onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
        className="w-10 h-10 rounded bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
      >
        +
      </button>
    </div>
  );
}
