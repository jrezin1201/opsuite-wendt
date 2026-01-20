"use client";

import React, { useState } from "react";
import type { APIRequest } from "./APIPlayground";

interface RequestBuilderProps {
  request: APIRequest;
  onRequestChange: (request: APIRequest) => void;
  onSend: () => void;
  isLoading: boolean;
}

const methods: APIRequest["method"][] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export function RequestBuilder({ request, onRequestChange, onSend, isLoading }: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<"headers" | "body">("headers");

  const addHeader = () => {
    onRequestChange({
      ...request,
      headers: [...request.headers, { key: "", value: "" }],
    });
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = [...request.headers];
    newHeaders[index] = { key, value };
    onRequestChange({ ...request, headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    onRequestChange({
      ...request,
      headers: request.headers.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
      {/* Method & URL */}
      <div className="flex gap-2">
        <select
          value={request.method}
          onChange={(e) => onRequestChange({ ...request, method: e.target.value as APIRequest["method"] })}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {methods.map((method) => (
            <option key={method} value={method} className="bg-gray-900">
              {method}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={request.url}
          onChange={(e) => onRequestChange({ ...request, url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={onSend}
          disabled={isLoading}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded font-medium transition-colors"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab("headers")}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === "headers"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-white/60 hover:text-white"
          }`}
        >
          Headers ({request.headers.length})
        </button>
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
      </div>

      {/* Tab Content */}
      {activeTab === "headers" && (
        <div className="space-y-2">
          {request.headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={header.key}
                onChange={(e) => updateHeader(index, e.target.value, header.value)}
                placeholder="Header name"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={header.value}
                onChange={(e) => updateHeader(index, header.key, e.target.value)}
                placeholder="Header value"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => removeHeader(index)}
                className="w-10 h-10 rounded text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addHeader}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
          >
            + Add Header
          </button>
        </div>
      )}

      {activeTab === "body" && (
        <textarea
          value={request.body}
          onChange={(e) => onRequestChange({ ...request, body: e.target.value })}
          placeholder={`{\n  "name": "John Doe",\n  "email": "john@example.com"\n}`}
          className="w-full h-48 px-3 py-2 bg-black/40 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      )}
    </div>
  );
}
