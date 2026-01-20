"use client";

import React from "react";
import type { NodeType } from "./WorkflowNode";

interface NodeLibraryProps {
  onAddNode: (type: NodeType) => void;
}

const nodes: { type: NodeType; label: string; icon: string; description: string }[] = [
  { type: "trigger", label: "Trigger", icon: "🎯", description: "Starts the workflow" },
  { type: "condition", label: "Condition", icon: "❓", description: "If/else branching" },
  { type: "action", label: "Action", icon: "⚡", description: "Perform an action" },
];

export function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  return (
    <div className="w-64 bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-white mb-1">Node Library</h3>
        <p className="text-xs text-white/40">Click to add to canvas</p>
      </div>

      <div className="space-y-2">
        {nodes.map((node) => (
          <button
            key={node.type}
            onClick={() => onAddNode(node.type)}
            className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{node.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                  {node.label}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{node.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 space-y-2">
        <p className="text-xs text-white/60 font-medium">Examples:</p>
        <ul className="text-xs text-white/40 space-y-1">
          <li>• Webhook received → Send email</li>
          <li>• Schedule → Check condition → API call</li>
          <li>• Form submitted → Create record</li>
        </ul>
      </div>
    </div>
  );
}
