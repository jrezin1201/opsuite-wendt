"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "gradient" | "solid";
  color?: "purple" | "green" | "blue" | "red";
  animated?: boolean;
}

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  variant = "gradient",
  color = "purple",
  animated = true,
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    purple:
      variant === "gradient"
        ? "bg-gradient-to-r from-purple-500 to-pink-500"
        : "bg-purple-500",
    green:
      variant === "gradient"
        ? "bg-gradient-to-r from-green-500 to-emerald-500"
        : "bg-green-500",
    blue:
      variant === "gradient"
        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
        : "bg-blue-500",
    red:
      variant === "gradient"
        ? "bg-gradient-to-r from-red-500 to-orange-500"
        : "bg-red-500",
  };

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-white/80">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-white">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={`w-full ${sizes[size]} bg-white/10 rounded-full overflow-hidden`}>
        {/* Progress Fill */}
        <motion.div
          className={`h-full ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: "easeOut",
          }}
        >
          {/* Shimmer Effect */}
          {animated && clampedValue > 0 && clampedValue < 100 && (
            <div className="w-full h-full overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
