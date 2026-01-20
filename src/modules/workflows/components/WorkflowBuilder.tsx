"use client";

import React, { useState } from "react";
import { NodeLibrary } from "./NodeLibrary";
import { type Node, type NodeType } from "./WorkflowNode";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { ExecutionLog } from "./ExecutionLog";

export interface Connection {
  from: string;
  to: string;
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "trigger", x: 100, y: 200, config: { trigger: "Webhook received" } },
    { id: "2", type: "action", x: 400, y: 200, config: { action: "Send email" } },
  ]);
  const [connections, setConnections] = useState<Connection[]>([{ from: "1", to: "2" }]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ from: string; x: number; y: number } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const addNode = (type: NodeType) => {
    setNodes((prev) => {
      const newNode: Node = {
        id: `node-${prev.length + 1}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        x: 200,
        y: 100 + prev.length * 50,
        config: getDefaultConfig(type),
      };
      return [...prev, newNode];
    });
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setConnections(connections.filter((c) => c.from !== id && c.to !== id));
    setSelectedNode(null);
  };

  const moveNode = (id: string, x: number, y: number) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const startConnection = (nodeId: string, x: number, y: number) => {
    setConnecting({ from: nodeId, x, y });
  };

  const endConnection = (nodeId: string) => {
    if (connecting && connecting.from !== nodeId) {
      setConnections([...connections, { from: connecting.from, to: nodeId }]);
    }
    setConnecting(null);
  };

  const executeWorkflow = async () => {
    setIsExecuting(true);
    setExecutionLog([]);

    const log: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      log.push(`Executing: ${node.type} - ${JSON.stringify(node.config)}`);
      setExecutionLog([...log]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    log.push("✅ Workflow completed successfully");
    setExecutionLog([...log]);
    setIsExecuting(false);
  };

  const getDefaultConfig = (type: NodeType): Record<string, unknown> => {
    switch (type) {
      case "trigger":
        return { trigger: "New trigger" };
      case "condition":
        return { condition: "if value > 100" };
      case "action":
        return { action: "New action" };
      default:
        return {};
    }
  };

  return (
    <div className="flex gap-4 h-[700px]">
      {/* Node Library */}
      <NodeLibrary onAddNode={addNode} />

      {/* Canvas */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Controls */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="font-semibold text-white">My Workflow</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded font-medium transition-colors"
            >
              {isExecuting ? "Executing..." : "Test Workflow"}
            </button>
            <button
              onClick={() => console.log("Save workflow")}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Workflow Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          selectedNode={selectedNode}
          connecting={connecting}
          onSelectNode={setSelectedNode}
          onDeleteNode={deleteNode}
          onMoveNode={moveNode}
          onStartConnection={startConnection}
          onEndConnection={endConnection}
        />
      </div>

      {/* Execution Log */}
      <ExecutionLog logs={executionLog} isExecuting={isExecuting} />
    </div>
  );
}
