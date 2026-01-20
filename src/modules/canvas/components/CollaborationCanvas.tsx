"use client";

import React, { useState, useRef } from "react";
import { StickyNote, type StickyNoteData } from "./StickyNote";
import { Toolbar } from "./Toolbar";
import { PresenceIndicators } from "./PresenceIndicators";
import { MiniMap } from "./MiniMap";
import { LayersPanel } from "./LayersPanel";

export type Tool = "select" | "sticky" | "text" | "rect" | "circle" | "draw";

export interface CanvasObject {
  id: string;
  type: "sticky" | "text" | "shape";
  x: number;
  y: number;
  data: StickyNoteData | { content: string } | { shape: string; color: string };
}

export function CollaborationCanvas() {
  const [tool, setTool] = useState<Tool>("select");
  const [objects, setObjects] = useState<CanvasObject[]>([
    {
      id: "1",
      type: "sticky",
      x: 100,
      y: 100,
      data: { content: "Welcome to the Canvas!", color: "yellow" },
    },
    {
      id: "2",
      type: "sticky",
      x: 300,
      y: 200,
      data: { content: "Drag me around!", color: "pink" },
    },
  ]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev * delta)));
  };

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "select" && e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (tool === "sticky" && e.target === canvasRef.current) {
      // Create new sticky note
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        const newSticky: CanvasObject = {
          id: Date.now().toString(),
          type: "sticky",
          x,
          y,
          data: { content: "New note", color: "yellow" },
        };
        setObjects([...objects, newSticky]);
        setTool("select");
      }
    }
  };

  // Handle pan move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Update sticky note content
  const handleUpdateSticky = (id: string, content: string, color: string) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id && obj.type === "sticky"
          ? { ...obj, data: { content, color } }
          : obj
      )
    );
  };

  // Delete object
  const handleDeleteObject = (id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
  };

  // Move sticky note
  const handleMoveSticky = (id: string, dx: number, dy: number) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, x: obj.x + dx / zoom, y: obj.y + dy / zoom } : obj
      )
    );
  };

  return (
    <div className="relative h-[800px] w-full bg-gray-950 rounded-lg border border-white/10 overflow-hidden">
      {/* Toolbar */}
      <Toolbar currentTool={tool} onSelectTool={setTool} zoom={zoom} onZoomChange={setZoom} />

      {/* Presence Indicators */}
      <PresenceIndicators />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`absolute inset-0 ${isPanning ? "cursor-grabbing" : tool === "select" ? "cursor-grab" : "cursor-crosshair"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Objects container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {objects.map((obj) => {
            if (obj.type === "sticky" && "content" in obj.data && "color" in obj.data) {
              return (
                <StickyNote
                  key={obj.id}
                  id={obj.id}
                  x={obj.x}
                  y={obj.y}
                  content={obj.data.content}
                  color={obj.data.color}
                  onUpdate={handleUpdateSticky}
                  onDelete={handleDeleteObject}
                  onMove={handleMoveSticky}
                  disabled={tool !== "select"}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Mini Map */}
      <MiniMap objects={objects} pan={pan} zoom={zoom} canvasSize={{ width: 800, height: 800 }} />

      {/* Layers Panel */}
      <LayersPanel
        objects={objects}
        onSelectObject={(id) => {
          const obj = objects.find((o) => o.id === id);
          if (obj) {
            setPan({ x: -obj.x * zoom + 400, y: -obj.y * zoom + 400 });
          }
        }}
        onDeleteObject={handleDeleteObject}
      />
    </div>
  );
}
