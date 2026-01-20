"use client";

import React from "react";

interface ExecutionLogProps {
  logs: string[];
  isExecuting: boolean;
}

export function ExecutionLog({ logs, isExecuting }: ExecutionLogProps) {
  return (
    <div className="w-80 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col">
      <div className="mb-3">
        <h3 className="font-semibold text-white mb-1">Execution Log</h3>
        <p className="text-xs text-white/40">
          {isExecuting ? "Running workflow..." : "Click 'Test Workflow' to execute"}
        </p>
      </div>

      <div className="flex-1 bg-black/40 rounded p-3 font-mono text-xs space-y-1 overflow-y-auto max-h-[600px]">
        {logs.length === 0 ? (
          <p className="text-white/20">No execution logs yet</p>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className={`${log.startsWith("✅") ? "text-green-400" : "text-white/60"} animate-fadeIn`}
            >
              [{new Date().toLocaleTimeString()}] {log}
            </div>
          ))
        )}
        {isExecuting && (
          <div className="text-purple-400 animate-pulse">⏳ Processing...</div>
        )}
      </div>
    </div>
  );
}
