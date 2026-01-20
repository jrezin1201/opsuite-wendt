/**
 * ModuleSidebar Component
 *
 * Sidebar navigation showing all modules grouped by category
 * Includes search functionality
 */

"use client";

import { useState } from "react";
import {
  getModulesByCategory,
  searchModules,
} from "@/config/registry";
import { isFeatureActive } from "@/config/site-config";
import { ModuleCard } from "./ModuleCard";

export function ModuleSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const modulesByCategory = getModulesByCategory();
  const filteredModules = searchQuery
    ? searchModules(searchQuery)
    : undefined;

  return (
    <div className="w-80 h-screen border-r border-white/10 bg-gray-950 overflow-y-auto flex-shrink-0">
      <div className="sticky top-0 bg-gray-950 border-b border-white/10 p-4 z-10">
        <h2 className="text-lg font-bold text-white mb-3">
          Module Catalog
        </h2>
        <input
          type="text"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="p-4 space-y-6">
        {filteredModules ? (
          // Search results
          <div>
            <p className="text-xs text-white/40 mb-3">
              {filteredModules.length} result{filteredModules.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isActive={isFeatureActive(module.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Grouped by category
          Object.entries(modulesByCategory).map(([category, modules]) => {
            if (modules.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isActive={isFeatureActive(module.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
