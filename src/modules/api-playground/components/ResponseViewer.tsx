"use client";

import React, { useState } from "react";
import type { APIResponse } from "./APIPlayground";

interface ResponseViewerProps {
  response: APIResponse;
}

export function ResponseViewer({ response }: ResponseViewerProps) {
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400 bg-green-500/20";
    if (status >= 400 && status < 500) return "text-yellow-400 bg-yellow-500/20";
    if (status >= 500) return "text-red-400 bg-red-500/20";
    return "text-blue-400 bg-blue-500/20";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      {/* Status Line */}
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1 rounded font-mono text-sm font-semibold ${getStatusColor(response.status)}`}>
          {response.status} {response.statusText}
        </div>
        <div className="text-sm text-white/60">
          Time: <span className="text-white font-mono">{response.time}ms</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab("body")}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === "body"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-white/60 hover:text-white"
          }`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveTab("headers")}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === "headers"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-white/60 hover:text-white"
          }`}
        >
          Headers ({response.headers.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "body" && (
        <div className="relative">
          <pre className="bg-black/40 rounded p-4 text-xs text-green-400 font-mono overflow-x-auto max-h-96 overflow-y-auto">
            {response.body}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(response.body)}
            className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded text-xs transition-colors"
          >
            Copy
          </button>
        </div>
      )}

      {activeTab === "headers" && (
        <div className="space-y-2">
          {response.headers.map((header, index) => (
            <div key={index} className="flex gap-4 p-2 bg-white/5 rounded">
              <span className="text-sm text-purple-400 font-mono font-semibold">{header.key}:</span>
              <span className="text-sm text-white/80 font-mono">{header.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
