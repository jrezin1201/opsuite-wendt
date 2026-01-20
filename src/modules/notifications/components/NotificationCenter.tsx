"use client";

import React, { useState } from "react";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: { label: string; url: string };
  source?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications());
  const [filter, setFilter] = useState<"all" | "unread" | Notification["type"]>("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded text-sm border border-white/10 transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-sm border border-white/10 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "unread", "info", "success", "warning", "error"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-white/40">No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => handleMarkAsRead(notification.id)}
              onDelete={() => handleDelete(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) {
  const typeStyles = {
    info: { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "ℹ️", iconColor: "text-blue-400" },
    success: { bg: "bg-green-500/10", border: "border-green-500/30", icon: "✓", iconColor: "text-green-400" },
    warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "⚠️", iconColor: "text-yellow-400" },
    error: { bg: "bg-red-500/10", border: "border-red-500/30", icon: "✕", iconColor: "text-red-400" },
  };

  const style = typeStyles[notification.type];

  return (
    <div
      className={`p-4 ${style.bg} border ${style.border} rounded-lg ${
        !notification.read ? "opacity-100" : "opacity-60"
      } transition-all group hover:opacity-100`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`text-2xl ${style.iconColor} flex-shrink-0`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{notification.title}</h3>
              {!notification.read && (
                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-white/40 whitespace-nowrap">
              {getRelativeTime(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-white/80 mb-2">{notification.message}</p>
          {notification.source && (
            <p className="text-xs text-white/40 mb-2">From: {notification.source}</p>
          )}
          {notification.action && (
            <a
              href={notification.action.url}
              className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
            >
              {notification.action.label} →
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!notification.read && (
            <button
              onClick={onMarkAsRead}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Mark as read"
            >
              ✓
            </button>
          )}
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function generateMockNotifications(): Notification[] {
  return [
    {
      id: "1",
      type: "success",
      title: "Deployment Successful",
      message: "Your application has been deployed to production successfully.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      source: "CI/CD Pipeline",
      action: { label: "View deployment", url: "#" },
    },
    {
      id: "2",
      type: "warning",
      title: "High Memory Usage",
      message: "Your server is using 85% of available memory. Consider upgrading your plan.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      source: "Monitoring System",
      action: { label: "View metrics", url: "#" },
    },
    {
      id: "3",
      type: "info",
      title: "New Feature Available",
      message: "We've added a new dashboard widget. Check it out!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      source: "Product Updates",
    },
    {
      id: "4",
      type: "error",
      title: "Payment Failed",
      message: "Your latest payment could not be processed. Please update your payment method.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      source: "Billing System",
      action: { label: "Update payment", url: "#" },
    },
    {
      id: "5",
      type: "success",
      title: "Backup Completed",
      message: "Your daily backup has been completed successfully.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      source: "Backup Service",
    },
  ];
}
