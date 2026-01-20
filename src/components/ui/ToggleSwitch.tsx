"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ToggleSwitch({
  enabled,
  onChange,
  label,
  disabled = false,
  size = "md",
}: ToggleSwitchProps) {
  const sizes = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: 16,
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: 20,
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: 28,
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex items-center gap-3 cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Track */}
      <motion.div
        className={`
          ${currentSize.track}
          rounded-full transition-colors
          ${enabled
            ? "bg-gradient-to-r from-purple-500 to-pink-500"
            : "bg-white/20"
          }
          ${disabled ? "" : "hover:opacity-80"}
        `}
        animate={{
          backgroundColor: enabled
            ? undefined
            : "rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Thumb */}
        <motion.div
          className={`
            ${currentSize.thumb}
            bg-white rounded-full shadow-lg
            absolute top-0.5 left-0.5
          `}
          animate={{
            x: enabled ? currentSize.translate : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.div>

      {/* Label */}
      {label && (
        <span className="text-sm text-white/80 select-none">{label}</span>
      )}
    </button>
  );
}
