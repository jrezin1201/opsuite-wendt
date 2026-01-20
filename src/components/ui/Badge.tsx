"use client";

import React from "react";
import { motion } from "framer-motion";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "scenario-a" | "scenario-b";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  pill?: boolean;
  pulse?: boolean;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  pill = false,
  pulse = false,
  className = "",
}: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const variants = {
    default: "bg-white/10 text-white border-white/20",
    primary: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    success: "bg-green-500/20 text-green-300 border-green-500/50",
    warning: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    danger: "bg-red-500/20 text-red-300 border-red-500/50",
    info: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
    "scenario-a": "bg-green-50 text-green-700 border-green-200 font-medium",
    "scenario-b": "bg-purple-50 text-purple-700 border-purple-200 font-medium"
  };

  const dotColors = {
    default: "bg-white",
    primary: "bg-blue-400",
    success: "bg-green-400",
    warning: "bg-orange-400",
    danger: "bg-red-400",
    info: "bg-cyan-400",
    "scenario-a": "bg-green-600",
    "scenario-b": "bg-purple-600",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`
        inline-flex items-center gap-1.5
        border ${pill ? "rounded-full" : "rounded-md"} font-medium
        ${sizes[size]} ${variants[variant]} ${className}
      `}
    >
      {/* Dot Indicator */}
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`
                absolute inline-flex h-full w-full rounded-full opacity-75
                ${dotColors[variant]} animate-ping
              `}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </motion.span>
  );
}

// Notification Badge (for icons/avatars)
interface NotificationBadgeProps {
  count: number;
  max?: number;
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  dot?: boolean;
}

export function NotificationBadge({
  count,
  max = 99,
  children,
  position = "top-right",
  dot = false,
}: NotificationBadgeProps) {
  const positions = {
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  };

  const displayCount = count > max ? `${max}+` : count;
  const showBadge = count > 0;

  return (
    <div className="relative inline-block">
      {children}

      {showBadge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`
            absolute ${positions[position]}
            ${dot ? "h-2 w-2" : "min-w-[20px] h-5 px-1.5"}
            flex items-center justify-center
            bg-gradient-to-br from-red-500 to-pink-500
            text-white text-xs font-bold
            rounded-full border-2 border-slate-900
          `}
        >
          {!dot && displayCount}
        </motion.span>
      )}
    </div>
  );
}
