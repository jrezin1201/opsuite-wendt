"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  animated = true,
}: SkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const getWidth = () => {
    if (width) {
      return typeof width === "number" ? `${width}px` : width;
    }
    return variant === "circular" ? "40px" : "100%";
  };

  const getHeight = () => {
    if (height) {
      return typeof height === "number" ? `${height}px` : height;
    }
    return variant === "circular" ? "40px" : variant === "text" ? "16px" : "200px";
  };

  return (
    <div
      className={`
        ${variants[variant]}
        bg-white/10 relative overflow-hidden
        ${className}
      `}
      style={{
        width: getWidth(),
        height: getHeight(),
      }}
    >
      {/* Shimmer Animation */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}

// Pre-built skeleton patterns
export function SkeletonCard({ animated = true }: { animated?: boolean }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
      <Skeleton variant="rectangular" height={200} animated={animated} />
      <Skeleton variant="text" width="60%" animated={animated} />
      <Skeleton variant="text" width="80%" animated={animated} />
      <Skeleton variant="text" width="40%" animated={animated} />
    </div>
  );
}

export function SkeletonAvatar({ animated = true }: { animated?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} animated={animated} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" animated={animated} />
        <Skeleton variant="text" width="60%" animated={animated} />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 5,
  animated = true,
}: {
  count?: number;
  animated?: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
        >
          <Skeleton variant="circular" width={40} height={40} animated={animated} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" animated={animated} />
            <Skeleton variant="text" width="50%" animated={animated} />
          </div>
          <Skeleton variant="rectangular" width={80} height={32} animated={animated} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  animated = true,
}: {
  rows?: number;
  columns?: number;
  animated?: boolean;
}) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid gap-4 p-3 bg-white/10 border border-white/10 rounded-lg" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="80%" animated={animated} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-3 bg-white/5 border border-white/10 rounded-lg"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="90%" animated={animated} />
          ))}
        </div>
      ))}
    </div>
  );
}
