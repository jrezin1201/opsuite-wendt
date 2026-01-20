"use client";

import React, { useState } from "react";
import type { Feature, SelectedFeatures } from "./AppEstimator";

interface FeatureSelectorProps {
  features: Feature[];
  selectedFeatures: SelectedFeatures;
  onToggleFeature: (featureId: string) => void;
  categories: string[];
}

const complexityColors = {
  low: "text-green-400 bg-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/20",
  high: "text-red-400 bg-red-500/20",
};

export function FeatureSelector({ features, selectedFeatures, onToggleFeature, categories }: FeatureSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFeatures = activeCategory
    ? features.filter((f) => f.category === activeCategory)
    : features;

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-purple-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => {
          const isSelected = selectedFeatures[feature.id];

          return (
            <button
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? "bg-purple-500/10 border-purple-500"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected ? "bg-purple-500 border-purple-500" : "border-white/20"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="pr-8">
                <h4 className="text-sm font-semibold text-white mb-1">{feature.name}</h4>
                <p className="text-xs text-white/60 mb-3">{feature.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-white/40">
                    {feature.hours.min}-{feature.hours.max}h
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${complexityColors[feature.complexity]}`}>
                    {feature.complexity}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {feature.techStack.slice(0, 2).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-white/10 text-white/60 rounded">
                      {tech}
                    </span>
                  ))}
                  {feature.techStack.length > 2 && (
                    <span className="text-xs text-white/40">+{feature.techStack.length - 2}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/40">No features found in this category</p>
        </div>
      )}
    </div>
  );
}
