"use client";

import React, { useState } from "react";
import type { CanvasObject } from "./CollaborationCanvas";

interface LayersPanelProps {
  objects: CanvasObject[];
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}

export function LayersPanel({ objects, onSelectObject, onDeleteObject }: LayersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getObjectLabel = (obj: CanvasObject) => {
    if (obj.type === "sticky" && "content" in obj.data) {
      return obj.data.content.substring(0, 20) + (obj.data.content.length > 20 ? "..." : "");
    }
    return obj.type;
  };

  const getObjectIcon = (obj: CanvasObject) => {
    switch (obj.type) {
      case "sticky":
        return "📝";
      case "text":
        return "T";
      case "shape":
        return "▭";
      default:
        return "•";
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden w-64">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold">Layers ({objects.length})</span>
        <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Layers list */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {objects.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/40 text-sm">
              No objects yet. Click &quot;Sticky Note&quot; to create one!
            </div>
          ) : (
            objects.map((obj) => (
              <div
                key={obj.id}
                className="group px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => onSelectObject(obj.id)}
              >
                <span className="text-lg">{getObjectIcon(obj)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{getObjectLabel(obj)}</p>
                  <p className="text-xs text-white/40">
                    {obj.type} • ({Math.round(obj.x)}, {Math.round(obj.y)})
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteObject(obj.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
