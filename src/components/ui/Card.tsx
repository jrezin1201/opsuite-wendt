"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  glow?: "pink" | "cyan" | "purple" | "none";
  className?: string;
  hover?: boolean;
};

export function Card({ children, glow = "none", className = "", hover = true }: Props) {
  const glowClass =
    glow === "pink"
      ? "before:shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_0_40px_rgba(236,72,153,0.18)]"
      : glow === "cyan"
      ? "before:shadow-[0_0_0_1px_rgba(34,211,238,0.32),0_0_40px_rgba(34,211,238,0.16)]"
      : glow === "purple"
      ? "before:shadow-[0_0_0_1px_rgba(168,85,247,0.32),0_0_40px_rgba(168,85,247,0.16)]"
      : "";

  const baseClass = [
    "relative rounded-2xl",
    "bg-white/5 border border-white/10",
    "backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
    "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
    "transition-all duration-300",
    glowClass,
    className
  ].join(" ");

  if (!hover) {
    return <div className={baseClass}>{children}</div>;
  }

  return (
    <motion.div
      className={baseClass}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
}
