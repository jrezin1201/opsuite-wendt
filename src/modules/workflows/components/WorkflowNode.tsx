"use client";

import React, { useState, useRef, useEffect } from "react";

export type NodeType = "trigger" | "condition" | "action";

export interface Node {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  config: Record<string, unknown>;
}

interface WorkflowNodeProps {
  node: Node;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  onStartConnection: (x: number, y: number) => void;
  onEndConnection: () => void;
}

const nodeStyles = {
  trigger: { bg: "bg-green-500/20", border: "border-green-500", icon: "🎯" },
  condition: { bg: "bg-yellow-500/20", border: "border-yellow-500", icon: "❓" },
  action: { bg: "bg-blue-500/20", border: "border-blue-500", icon: "⚡" },
};

export function WorkflowNode({
  node,
  isSelected,
  onSelect,
  onDelete,
  onMove,
  onStartConnection,
  onEndConnection,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const style = nodeStyles[node.type];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - node.x, y: e.clientY - node.y });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onMove(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart]);

  const handleOutputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      onStartConnection(rect.right, rect.top + rect.height / 2);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEndConnection();
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute w-48 ${style.bg} border-2 ${isSelected ? style.border : "border-white/20"} rounded-lg p-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"} transition-all shadow-lg`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ×
      </button>

      {/* Input port */}
      {node.type !== "trigger" && (
        <div
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 border-2 border-white/40 rounded-full hover:bg-purple-500 hover:border-purple-400 transition-all cursor-pointer"
          onClick={handleInputClick}
        />
      )}

      {/* Output port */}
      <div
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 border-2 border-white/40 rounded-full hover:bg-purple-500 hover:border-purple-400 transition-all cursor-pointer"
        onClick={handleOutputClick}
      />

      {/* Content */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{style.icon}</span>
        <div className="flex-1">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{node.type}</p>
          <p className="text-sm text-white font-medium">{String(Object.values(node.config)[0] || "")}</p>
        </div>
      </div>
    </div>
  );
}
