"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

export function Button({ variant = "primary", size = "md", className = "", asChild, children, onClick, disabled, type = "button" }: Props) {
  const sizeStyles = {
    sm: "px-2 py-1 text-xs min-h-[36px] md:min-h-0",
    md: "px-3 py-2 text-sm min-h-[44px] md:min-h-0",
    lg: "px-6 py-3 text-base min-h-[52px] md:min-h-0"
  };

  const base =
    `${sizeStyles[size]} rounded-xl font-medium border transition-all duration-200 ` +
    "focus:outline-none focus:ring-2 focus:ring-white/10 flex items-center justify-center " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-brand-gold text-brand-navy border-brand-gold hover:bg-brand-gold2 hover:shadow-lg font-bold"
      : variant === "danger"
      ? "bg-red-600 border-red-600 hover:bg-red-700 hover:shadow-lg text-white font-semibold"
      : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 hover:shadow-md font-semibold";

  // Support asChild pattern for Next.js Link components
  if (asChild) {
    return <>{children}</>;
  }

  return (
    <motion.button
      className={`${base} ${styles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
        y: 0,
      }}
      transition={{
        type: "spring" as const,
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
    </motion.button>
  );
}
