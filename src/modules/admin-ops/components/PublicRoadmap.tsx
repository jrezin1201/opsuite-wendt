"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  votes: number;
  category: string;
  estimatedQuarter?: string;
}

interface PublicRoadmapProps {
  items: RoadmapItem[];
  onVote?: (itemId: string) => void;
  allowVoting?: boolean;
}

export function PublicRoadmap({
  items: initialItems,
  onVote,
  allowVoting = true,
}: PublicRoadmapProps) {
  const [items, setItems] = useState(initialItems);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<
    "all" | "planned" | "in-progress" | "completed"
  >("all");

  const handleVote = (itemId: string) => {
    if (!allowVoting) return;

    // Toggle vote
    if (votedItems.has(itemId)) {
      setVotedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, votes: item.votes - 1 } : item
        )
      );
    } else {
      setVotedItems((prev) => new Set(prev).add(itemId));
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, votes: item.votes + 1 } : item
        )
      );
    }

    if (onVote) {
      onVote(itemId);
    }
  };

  const getStatusColor = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "planned":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "completed":
        return "✓ Completed";
      case "in-progress":
        return "⚡ In Progress";
      case "planned":
        return "📋 Planned";
      default:
        return status;
    }
  };

  const filteredItems = items.filter((item) =>
    filterStatus === "all" ? true : item.status === filterStatus
  );

  const sortedItems = [...filteredItems].sort((a, b) => b.votes - a.votes);

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Product Roadmap</h3>
          <p className="text-sm text-white/60">
            Vote on features you&apos;d like to see next
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterStatus("planned")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "planned"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Planned ({items.filter((i) => i.status === "planned").length})
          </button>
          <button
            onClick={() => setFilterStatus("in-progress")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "in-progress"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            In Progress ({items.filter((i) => i.status === "in-progress").length})
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "completed"
                ? "bg-green-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Completed ({items.filter((i) => i.status === "completed").length})
          </button>
        </div>

        {/* Roadmap Items */}
        <div className="space-y-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Vote Button */}
                {allowVoting && (
                  <button
                    onClick={() => handleVote(item.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all ${
                      votedItems.has(item.id)
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-white/5 border-white/20 text-white/60 hover:border-purple-500/50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mb-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="text-sm font-bold">{item.votes}</span>
                  </button>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-white/60 mb-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                      {item.category}
                    </span>
                    {item.estimatedQuarter && (
                      <span className="text-xs text-white/40">
                        Est. {item.estimatedQuarter}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No items in this category yet.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
