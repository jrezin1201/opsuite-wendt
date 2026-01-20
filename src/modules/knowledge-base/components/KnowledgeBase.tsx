"use client";

import React, { useState } from "react";

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: Date;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Your Account",
    category: "Getting Started",
    content: "Learn how to set up your account, configure your profile, and get started with the platform. This comprehensive guide covers everything from initial signup to advanced account customization options.",
    tags: ["beginner", "setup", "account"],
    views: 1247,
    helpful: 98,
    lastUpdated: new Date(2024, 11, 15),
  },
  {
    id: "2",
    title: "How to Create Your First Deal",
    category: "Getting Started",
    content: "Step-by-step instructions for creating and managing deals. Learn about product configuration, pricing strategies, and deal lifecycle management.",
    tags: ["deals", "beginner", "tutorial"],
    views: 892,
    helpful: 85,
    lastUpdated: new Date(2024, 11, 10),
  },
  {
    id: "3",
    title: "Understanding Analytics Dashboard",
    category: "Analytics",
    content: "Deep dive into metrics, reports, and insights. Master the analytics dashboard to make data-driven decisions and track your performance over time.",
    tags: ["analytics", "reports", "data"],
    views: 654,
    helpful: 72,
    lastUpdated: new Date(2024, 11, 5),
  },
  {
    id: "4",
    title: "API Authentication Guide",
    category: "Developers",
    content: "Complete guide to API keys, OAuth flows, and security best practices. Learn how to securely integrate with our API and handle authentication properly.",
    tags: ["api", "authentication", "security"],
    views: 523,
    helpful: 91,
    lastUpdated: new Date(2024, 10, 28),
  },
  {
    id: "5",
    title: "Troubleshooting Common Issues",
    category: "Support",
    content: "Solutions to frequently encountered problems and error messages. Find quick fixes and workarounds for common technical issues.",
    tags: ["troubleshooting", "support", "errors"],
    views: 1456,
    helpful: 88,
    lastUpdated: new Date(2024, 11, 1),
  },
  {
    id: "6",
    title: "Advanced Webhook Configuration",
    category: "Developers",
    content: "Set up and manage webhooks for real-time event notifications. Learn about payload formats, retry logic, and webhook security.",
    tags: ["webhooks", "integration", "advanced"],
    views: 387,
    helpful: 76,
    lastUpdated: new Date(2024, 10, 20),
  },
];

const categories = ["All", "Getting Started", "Analytics", "Developers", "Support", "Billing"];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = categories.slice(1).map((cat) => ({
    name: cat,
    count: mockArticles.filter((a) => a.category === cat).length,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">How can we help you?</h2>
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search articles, guides, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
          />
        </div>
        {searchQuery && (
          <div className="mt-4 text-white/60">
            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-500 text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {category !== "All" && (
                      <span className="text-xs text-white/60">
                        {categoryStats.find((s) => s.name === category)?.count || 0}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {["beginner", "api", "tutorial", "setup", "analytics", "troubleshooting"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            /* Article View */
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
              >
                ← Back to articles
              </button>
              <div className="space-y-4">
                <div>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                    {selectedArticle.category}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-3 mb-2">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>Updated {selectedArticle.lastUpdated.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{selectedArticle.views} views</span>
                    <span>•</span>
                    <span>{selectedArticle.helpful}% found this helpful</span>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed">{selectedArticle.content}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
                  <p className="text-white mb-3">Was this article helpful?</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded transition-colors">
                      👍 Yes
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded transition-colors">
                      👎 No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Article List */
            <div className="space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
                  <p className="text-white/60">No articles found matching your search.</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                            {article.category}
                          </span>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {article.title}
                          </h3>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2 mb-2">
                          {article.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          <span>{article.views} views</span>
                          <span>•</span>
                          <span>{article.helpful}% helpful</span>
                          <span>•</span>
                          <span>Updated {article.lastUpdated.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
