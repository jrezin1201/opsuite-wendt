"use client";

import React, { useState } from "react";

interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  category: string;
}

interface EndpointSidebarProps {
  selectedEndpoint: string;
  onSelectEndpoint: (id: string, method: Endpoint["method"], url: string) => void;
}

const endpoints: Endpoint[] = [
  { id: "users", name: "List Users", method: "GET", path: "/users", category: "Users" },
  { id: "user", name: "Get User", method: "GET", path: "/users/{id}", category: "Users" },
  { id: "create-user", name: "Create User", method: "POST", path: "/users", category: "Users" },
  { id: "posts", name: "List Posts", method: "GET", path: "/posts", category: "Posts" },
  { id: "create-post", name: "Create Post", method: "POST", path: "/posts", category: "Posts" },
  { id: "delete-post", name: "Delete Post", method: "DELETE", path: "/posts/{id}", category: "Posts" },
];

const methodColors = {
  GET: "text-green-400 bg-green-500/20",
  POST: "text-blue-400 bg-blue-500/20",
  PUT: "text-yellow-400 bg-yellow-500/20",
  DELETE: "text-red-400 bg-red-500/20",
};

export function EndpointSidebar({ selectedEndpoint, onSelectEndpoint }: EndpointSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [...new Set(endpoints.map((e) => e.category))];

  const filteredEndpoints = endpoints.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col">
      <div className="mb-4">
        <h3 className="font-semibold text-white mb-3">Endpoints</h3>
        <input
          type="text"
          placeholder="Search endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              {category}
            </h4>
            <div className="space-y-1">
              {filteredEndpoints
                .filter((e) => e.category === category)
                .map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() =>
                      onSelectEndpoint(
                        endpoint.id,
                        endpoint.method,
                        `https://api.example.com${endpoint.path}`
                      )
                    }
                    className={`w-full p-2 rounded text-left transition-all ${
                      selectedEndpoint === endpoint.id
                        ? "bg-purple-500/20 border border-purple-500/40"
                        : "bg-white/5 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-mono px-1.5 py-0.5 rounded ${methodColors[endpoint.method]}`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="text-sm text-white/80 font-medium">{endpoint.name}</span>
                    </div>
                    <p className="text-xs text-white/40 font-mono">{endpoint.path}</p>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
