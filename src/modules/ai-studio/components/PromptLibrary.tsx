"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  variables?: string[];
}

interface PromptLibraryProps {
  templates: PromptTemplate[];
  onSelectTemplate?: (template: PromptTemplate) => void;
}

export function PromptLibrary({
  templates,
  onSelectTemplate,
}: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["all", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "writing":
        return "✍️";
      case "coding":
        return "💻";
      case "analysis":
        return "📊";
      case "creative":
        return "🎨";
      case "business":
        return "💼";
      default:
        return "📝";
    }
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Prompt Library</h3>
          <p className="text-sm text-white/60">
            Pre-built templates to get started quickly
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {category === "all"
                ? "All"
                : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="space-y-3">
          {filteredTemplates.map((template) => {
            const isExpanded = expandedId === template.id;

            return (
              <div
                key={template.id}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/30 transition-colors"
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : template.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getCategoryIcon(template.category)}
                        </span>
                        <h4 className="font-semibold text-white">
                          {template.title}
                        </h4>
                      </div>
                      <p className="text-sm text-white/60">
                        {template.description}
                      </p>
                      {template.variables && template.variables.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {template.variables.map((variable) => (
                            <span
                              key={variable}
                              className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400"
                            >
                              {`{${variable}}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-white/60 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                      <p className="text-xs font-semibold text-white/60 mb-2">
                        PROMPT TEMPLATE
                      </p>
                      <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
                        {template.prompt}
                      </pre>
                    </div>
                    {onSelectTemplate && (
                      <Button
                        onClick={() => onSelectTemplate(template)}
                        className="w-full"
                      >
                        Use This Template
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No templates found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
