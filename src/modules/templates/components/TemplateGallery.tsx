"use client";

import React, { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  downloads: number;
  rating: number;
  isPremium: boolean;
  author: string;
  tags: string[];
  lastUpdated: Date;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "SaaS Landing Page",
    description: "Modern landing page template with hero section, features, pricing, and testimonials. Perfect for SaaS products.",
    category: "Marketing",
    preview: "🎨",
    downloads: 3421,
    rating: 4.9,
    isPremium: false,
    author: "Design Team",
    tags: ["landing", "saas", "marketing"],
    lastUpdated: new Date(2024, 11, 15),
  },
  {
    id: "2",
    name: "E-commerce Dashboard",
    description: "Complete admin dashboard for e-commerce platforms. Includes orders, products, customers, and analytics.",
    category: "Dashboard",
    preview: "📊",
    downloads: 2187,
    rating: 4.7,
    isPremium: true,
    author: "Admin Pro",
    tags: ["dashboard", "ecommerce", "admin"],
    lastUpdated: new Date(2024, 11, 10),
  },
  {
    id: "3",
    name: "Email Newsletter",
    description: "Responsive email template for newsletters and marketing campaigns. Works across all major email clients.",
    category: "Email",
    preview: "✉️",
    downloads: 5632,
    rating: 4.8,
    isPremium: false,
    author: "Email Masters",
    tags: ["email", "newsletter", "marketing"],
    lastUpdated: new Date(2024, 11, 12),
  },
  {
    id: "4",
    name: "Invoice Template",
    description: "Professional invoice template with automatic calculations and PDF export capabilities.",
    category: "Business",
    preview: "📄",
    downloads: 1876,
    rating: 4.6,
    isPremium: false,
    author: "Business Tools",
    tags: ["invoice", "business", "finance"],
    lastUpdated: new Date(2024, 11, 5),
  },
  {
    id: "5",
    name: "Project Proposal",
    description: "Comprehensive project proposal template with sections for scope, timeline, budget, and deliverables.",
    category: "Business",
    preview: "📋",
    downloads: 2943,
    rating: 4.7,
    isPremium: true,
    author: "Pro Templates",
    tags: ["proposal", "business", "project"],
    lastUpdated: new Date(2024, 11, 8),
  },
  {
    id: "6",
    name: "Mobile App UI Kit",
    description: "Complete UI kit for mobile applications with 50+ screens and components. iOS and Android compatible.",
    category: "Design",
    preview: "📱",
    downloads: 4521,
    rating: 4.9,
    isPremium: true,
    author: "UI Designers",
    tags: ["mobile", "ui", "design"],
    lastUpdated: new Date(2024, 11, 14),
  },
  {
    id: "7",
    name: "Blog Post Layout",
    description: "Clean and readable blog post template with typography optimized for long-form content.",
    category: "Content",
    preview: "📝",
    downloads: 3156,
    rating: 4.5,
    isPremium: false,
    author: "Content Creators",
    tags: ["blog", "content", "writing"],
    lastUpdated: new Date(2024, 11, 3),
  },
  {
    id: "8",
    name: "API Documentation",
    description: "Technical documentation template for APIs with code examples, endpoint references, and guides.",
    category: "Documentation",
    preview: "📚",
    downloads: 1654,
    rating: 4.8,
    isPremium: false,
    author: "Dev Docs",
    tags: ["api", "documentation", "developer"],
    lastUpdated: new Date(2024, 10, 28),
  },
];

const categories = ["All", "Marketing", "Dashboard", "Email", "Business", "Design", "Content", "Documentation"];

export function TemplateGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "rating">("popular");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = mockTemplates
    .filter((template) => {
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.downloads - a.downloads;
      if (sortBy === "recent") return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Template Gallery</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-white/60">
        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
      </div>

      {/* Template Grid */}
      {selectedTemplate ? (
        /* Template Details */
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="text-purple-400 hover:text-purple-300 mb-6 flex items-center gap-2"
          >
            ← Back to gallery
          </button>
          <div className="flex items-start gap-6">
            <div className="text-8xl">{selectedTemplate.preview}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                {selectedTemplate.isPremium && (
                  <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300 font-medium">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-white/60 mb-4">by {selectedTemplate.author}</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span>{selectedTemplate.rating}</span>
                </div>
                <span>•</span>
                <span>{selectedTemplate.downloads.toLocaleString()} downloads</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {selectedTemplate.category}
                </span>
                <span>•</span>
                <span>Updated {selectedTemplate.lastUpdated.toLocaleDateString()}</span>
              </div>
              <p className="text-white/80 mb-4">{selectedTemplate.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTemplate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                  Use Template
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-medium text-white mb-1">Quick Setup</h4>
              <p className="text-sm text-white/60">Ready to use in minutes</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium text-white mb-1">Customizable</h4>
              <p className="text-sm text-white/60">Fully editable and flexible</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-medium text-white mb-1">Responsive</h4>
              <p className="text-sm text-white/60">Works on all devices</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full bg-white/5 border border-white/10 rounded-lg p-12 text-center">
              <p className="text-white/60">No templates found matching your criteria.</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-6xl">
                  {template.preview}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white flex-1 truncate">{template.name}</h3>
                    {template.isPremium && (
                      <span className="px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{template.rating}</span>
                    </div>
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                  <button className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded text-sm font-medium transition-colors">
                    Use Template
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
