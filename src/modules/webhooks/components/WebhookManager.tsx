"use client";

import React, { useState } from "react";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  lastTriggered?: Date;
  successRate: number;
}

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: "1", url: "https://api.example.com/webhook", events: ["user.created", "payment.success"], active: true, secret: "whsec_***", lastTriggered: new Date(), successRate: 98.5 },
    { id: "2", url: "https://hooks.slack.com/services/***", events: ["deal.closed"], active: true, secret: "whsec_***", successRate: 100 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableEvents = [
    "user.created", "user.updated", "user.deleted",
    "payment.success", "payment.failed",
    "deal.created", "deal.closed",
    "subscription.created", "subscription.cancelled"
  ];

  const handleDelete = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Webhook Endpoints</h2>
          <p className="text-sm text-white/60">{webhooks.length} endpoints configured</p>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
        >
          + Add Webhook
        </button>
      </div>

      {showAddModal && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Webhook</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Endpoint URL</label>
              <input
                type="url"
                placeholder="https://your-domain.com/webhook"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Events to Subscribe</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableEvents.map((event) => (
                  <label key={event} className="flex items-center gap-2 p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-white">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
              Create Webhook
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-sm font-mono text-white">{webhook.url}</code>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${webhook.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {webhook.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {webhook.events.map((event) => (
                    <span key={event} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                      {event}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span>Success Rate: {webhook.successRate}%</span>
                  {webhook.lastTriggered && <span>Last: {webhook.lastTriggered.toLocaleString()}</span>}
                  <span>Secret: {webhook.secret}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">Test</button>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">Edit</button>
                <button onClick={() => handleDelete(webhook.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
