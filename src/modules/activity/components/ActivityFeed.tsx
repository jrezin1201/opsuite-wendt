"use client";

import React, { useState } from "react";

export type ActivityType = "user_signup" | "deal_created" | "payment_received" | "file_uploaded" | "comment_added" | "status_changed" | "user_invited" | "task_completed";

export interface Activity {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export function ActivityFeed() {
  const [activities] = useState<Activity[]>(generateMockActivities());
  const [filter, setFilter] = useState<"all" | ActivityType>("all");
  const [groupBy, setGroupBy] = useState<"time" | "type">("time");

  const filteredActivities = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter);

  const groupedActivities = groupBy === "time"
    ? groupByTime(filteredActivities)
    : groupByType(filteredActivities);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Activity Feed</h2>
          <p className="text-sm text-white/60">{filteredActivities.length} activities</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Activities</option>
            <option value="user_signup">User Signups</option>
            <option value="deal_created">Deals</option>
            <option value="payment_received">Payments</option>
            <option value="file_uploaded">Files</option>
            <option value="comment_added">Comments</option>
            <option value="status_changed">Status Changes</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as typeof groupBy)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="time">Group by Time</option>
            <option value="type">Group by Type</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([group, groupActivities]) => (
          <div key={group} className="space-y-3">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider sticky top-0 bg-gray-900 py-2">
              {group}
            </h3>
            <div className="space-y-2">
              {groupActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const typeConfig = {
    user_signup: { icon: "👤", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    deal_created: { icon: "💼", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    payment_received: { icon: "💰", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    file_uploaded: { icon: "📁", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    comment_added: { icon: "💬", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    status_changed: { icon: "🔄", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    user_invited: { icon: "✉️", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    task_completed: { icon: "✓", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  };

  const config = typeConfig[activity.type];

  return (
    <div className={`p-4 ${config.bg} border ${config.border} rounded-lg hover:bg-white/5 transition-all group`}>
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-white">
                <span className="font-semibold">{activity.user.name}</span>{" "}
                <span className="text-white/80">{activity.action}</span>
                {activity.target && (
                  <span className={`font-medium ${config.color}`}> {activity.target}</span>
                )}
              </p>
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <p className="text-xs text-white/40 mt-1">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key}: {String(value)}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <span className="text-xs text-white/40 whitespace-nowrap">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function groupByTime(activities: Activity[]): Record<string, Activity[]> {
  const now = new Date();
  const groups: Record<string, Activity[]> = {
    "Today": [],
    "Yesterday": [],
    "This Week": [],
    "Older": [],
  };

  activities.forEach((activity) => {
    const diffDays = Math.floor((now.getTime() - activity.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) groups["Today"].push(activity);
    else if (diffDays === 1) groups["Yesterday"].push(activity);
    else if (diffDays < 7) groups["This Week"].push(activity);
    else groups["Older"].push(activity);
  });

  return Object.fromEntries(Object.entries(groups).filter(([, acts]) => acts.length > 0));
}

function groupByType(activities: Activity[]): Record<string, Activity[]> {
  const groups: Record<string, Activity[]> = {};
  activities.forEach((activity) => {
    const typeName = activity.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    if (!groups[typeName]) groups[typeName] = [];
    groups[typeName].push(activity);
  });
  return groups;
}

function generateMockActivities(): Activity[] {
  const users = ["Sarah Chen", "Mike Rodriguez", "Emily Johnson", "David Kim", "Alex Turner"];
  const activities: Omit<Activity, "id" | "user" | "timestamp">[] = [
    { type: "user_signup", action: "signed up", target: undefined, metadata: { plan: "Pro" } },
    { type: "deal_created", action: "created deal", target: "Acme Corp - $50K", metadata: { stage: "Negotiation" } },
    { type: "payment_received", action: "received payment", target: "$5,000", metadata: { method: "Card" } },
    { type: "file_uploaded", action: "uploaded", target: "Q4-Report.pdf", metadata: { size: "2.3 MB" } },
    { type: "comment_added", action: "commented on", target: "Project Alpha", metadata: undefined },
    { type: "status_changed", action: "changed status to", target: "In Progress", metadata: undefined },
    { type: "user_invited", action: "invited", target: "john@example.com", metadata: { role: "Member" } },
    { type: "task_completed", action: "completed task", target: "Update documentation", metadata: undefined },
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const activity = activities[i % activities.length];
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.random() * 72; // Random time in last 3 days

    return {
      id: `activity-${i + 1}`,
      ...activity,
      user: { name: user },
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
