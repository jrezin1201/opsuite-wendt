"use client";

import React from "react";
import type { CanvasObject } from "./CollaborationCanvas";

interface MiniMapProps {
  objects: CanvasObject[];
  pan: { x: number; y: number };
  zoom: number;
  canvasSize: { width: number; height: number };
}

export function MiniMap({ objects, pan, zoom, canvasSize }: MiniMapProps) {
  const miniMapSize = 150;
  const scale = miniMapSize / Math.max(canvasSize.width, canvasSize.height);

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
      <div
        className="relative bg-gray-900/50 rounded"
        style={{ width: miniMapSize, height: miniMapSize }}
      >
        {/* Objects */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute bg-purple-500/50 rounded"
            style={{
              left: obj.x * scale,
              top: obj.y * scale,
              width: 8,
              height: 8,
            }}
          />
        ))}

        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-white/40 bg-white/10 rounded"
          style={{
            left: (-pan.x * scale) / zoom,
            top: (-pan.y * scale) / zoom,
            width: (canvasSize.width * scale) / zoom,
            height: (canvasSize.height * scale) / zoom,
          }}
        />
      </div>
      <p className="text-xs text-white/40 mt-1 text-center">Mini Map</p>
    </div>
  );
}
