"use client";

import React from "react";
import { WorkflowNode, type Node } from "./WorkflowNode";
import type { Connection } from "./WorkflowBuilder";

interface WorkflowCanvasProps {
  nodes: Node[];
  connections: Connection[];
  selectedNode: string | null;
  connecting: { from: string; x: number; y: number } | null;
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onStartConnection: (nodeId: string, x: number, y: number) => void;
  onEndConnection: (nodeId: string) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNode,
  connecting,
  onSelectNode,
  onDeleteNode,
  onMoveNode,
  onStartConnection,
  onEndConnection,
}: WorkflowCanvasProps) {
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + 96, y: node.y + 32 };
  };

  return (
    <div className="relative flex-1 bg-gray-950 rounded-lg border border-white/10 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Existing connections */}
        {connections.map((conn, i) => {
          const from = getNodeCenter(conn.from);
          const to = getNodeCenter(conn.to);
          const midX = (from.x + to.x) / 2;

          return (
            <g key={i}>
              {/* Connection line */}
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
              />
              {/* Animated dot */}
              <circle r="4" fill="#8B5CF6">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                />
              </circle>
            </g>
          );
        })}

        {/* Connection in progress */}
        {connecting && (
          <line
            x1={connecting.x}
            y1={connecting.y}
            x2={connecting.x}
            y2={connecting.y}
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="5,5"
          >
            <animate
              attributeName="x2"
              from={connecting.x}
              to={connecting.x + 100}
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <WorkflowNode
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          onSelect={() => onSelectNode(node.id)}
          onDelete={() => onDeleteNode(node.id)}
          onMove={(x, y) => onMoveNode(node.id, x, y)}
          onStartConnection={(x, y) => onStartConnection(node.id, x, y)}
          onEndConnection={() => onEndConnection(node.id)}
        />
      ))}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 text-lg mb-2">Your workflow is empty</p>
            <p className="text-white/20 text-sm">Add nodes from the sidebar to get started</p>
          </div>
        </div>
      )}
    </div>
  );
}
