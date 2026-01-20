"use client";

import React from "react";

type SkeletonProps = {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-white/10 animate-shimmer";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "text" ? "1rem" : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "70%" : "100%"}
        />
      ))}
    </div>
  );
}

type SkeletonCardProps = {
  className?: string;
};

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}
    >
      <div className="space-y-3">
        <Skeleton variant="rectangular" height={24} />
        <SkeletonText lines={2} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="50%" height={40} />
          <Skeleton variant="rectangular" width="50%" height={40} />
        </div>
      </div>
    </div>
  );
}
