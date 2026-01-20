"use client";

import React, { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  isInstalled: boolean;
  isPremium: boolean;
  rating: number;
  installs: number;
  provider: string;
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Slack",
    description: "Send notifications and updates directly to your Slack channels. Get real-time alerts for important events.",
    category: "Communication",
    logo: "💬",
    isInstalled: true,
    isPremium: false,
    rating: 4.8,
    installs: 12453,
    provider: "Slack Technologies",
  },
  {
    id: "2",
    name: "Stripe",
    description: "Accept payments and manage subscriptions with Stripe integration. Full payment processing capabilities.",
    category: "Payments",
    logo: "💳",
    isInstalled: false,
    isPremium: true,
    rating: 4.9,
    installs: 8932,
    provider: "Stripe, Inc.",
  },
  {
    id: "3",
    name: "Google Analytics",
    description: "Track user behavior and analyze traffic with Google Analytics integration. Deep insights into user engagement.",
    category: "Analytics",
    logo: "📊",
    isInstalled: true,
    isPremium: false,
    rating: 4.6,
    installs: 15678,
    provider: "Google LLC",
  },
  {
    id: "4",
    name: "Salesforce",
    description: "Sync contacts, deals, and activities with Salesforce CRM. Bidirectional data synchronization.",
    category: "CRM",
    logo: "☁️",
    isInstalled: false,
    isPremium: true,
    rating: 4.7,
    installs: 6234,
    provider: "Salesforce.com",
  },
  {
    id: "5",
    name: "Zapier",
    description: "Connect with 5000+ apps through Zapier automation. Create custom workflows without code.",
    category: "Automation",
    logo: "⚡",
    isInstalled: false,
    isPremium: false,
    rating: 4.5,
    installs: 9876,
    provider: "Zapier Inc.",
  },
  {
    id: "6",
    name: "GitHub",
    description: "Link repositories and track development activity. Sync issues and pull requests automatically.",
    category: "Development",
    logo: "🐙",
    isInstalled: true,
    isPremium: false,
    rating: 4.8,
    installs: 11234,
    provider: "GitHub, Inc.",
  },
  {
    id: "7",
    name: "HubSpot",
    description: "Marketing automation and CRM integration. Manage campaigns and track customer journeys.",
    category: "Marketing",
    logo: "🎯",
    isInstalled: false,
    isPremium: true,
    rating: 4.6,
    installs: 5432,
    provider: "HubSpot, Inc.",
  },
  {
    id: "8",
    name: "Zoom",
    description: "Schedule and join meetings directly from the platform. Calendar integration included.",
    category: "Communication",
    logo: "📹",
    isInstalled: false,
    isPremium: false,
    rating: 4.4,
    installs: 7654,
    provider: "Zoom Video Communications",
  },
];

const categories = ["All", "Communication", "Payments", "Analytics", "CRM", "Automation", "Development", "Marketing"];

export function IntegrationMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInstalled, setShowInstalled] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = mockIntegrations.filter((integration) => {
    const matchesSearch =
      searchQuery === "" ||
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    const matchesInstalled = !showInstalled || integration.isInstalled;
    return matchesSearch && matchesCategory && matchesInstalled;
  });

  const installedCount = mockIntegrations.filter((i) => i.isInstalled).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Integration Marketplace</h2>
            <p className="text-white/60">
              {installedCount} active integration{installedCount !== 1 ? "s" : ""} • {mockIntegrations.length} available
            </p>
          </div>
          <button
            onClick={() => setShowInstalled(!showInstalled)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showInstalled
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {showInstalled ? "Show All" : "Show Installed"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
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

      {/* Integration Grid */}
      {selectedIntegration ? (
        /* Integration Details */
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <button
            onClick={() => setSelectedIntegration(null)}
            className="text-purple-400 hover:text-purple-300 mb-6 flex items-center gap-2"
          >
            ← Back to marketplace
          </button>
          <div className="flex items-start gap-6">
            <div className="text-6xl">{selectedIntegration.logo}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{selectedIntegration.name}</h2>
                {selectedIntegration.isPremium && (
                  <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300 font-medium">
                    PRO
                  </span>
                )}
                {selectedIntegration.isInstalled && (
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300 font-medium">
                    Installed
                  </span>
                )}
              </div>
              <p className="text-white/60 mb-4">by {selectedIntegration.provider}</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span>{selectedIntegration.rating}</span>
                </div>
                <span>•</span>
                <span>{selectedIntegration.installs.toLocaleString()} installs</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {selectedIntegration.category}
                </span>
              </div>
              <p className="text-white/80 mb-6">{selectedIntegration.description}</p>
              <div className="flex gap-3">
                {selectedIntegration.isInstalled ? (
                  <>
                    <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                      Configure
                    </button>
                    <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg font-medium transition-colors">
                      Uninstall
                    </button>
                  </>
                ) : (
                  <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                    Install Integration
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.length === 0 ? (
            <div className="col-span-full bg-white/5 border border-white/10 rounded-lg p-12 text-center">
              <p className="text-white/60">No integrations found matching your criteria.</p>
            </div>
          ) : (
            filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                onClick={() => setSelectedIntegration(integration)}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl">{integration.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{integration.name}</h3>
                      {integration.isPremium && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mb-2">{integration.provider}</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-3 line-clamp-2">{integration.description}</p>
                <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span>{integration.rating}</span>
                  </div>
                  <span>{integration.installs.toLocaleString()} installs</span>
                </div>
                {integration.isInstalled ? (
                  <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300 text-center font-medium">
                    ✓ Installed
                  </div>
                ) : (
                  <button className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded text-xs font-medium transition-colors">
                    Install
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
