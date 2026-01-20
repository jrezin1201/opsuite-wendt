"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = "", disabled, ...props }, ref) => {
    return (
      <label
        className={`
          flex items-start gap-3 cursor-pointer group
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          {/* Hidden native checkbox */}
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          {/* Custom checkbox */}
          <motion.div
            className={`
              w-5 h-5 rounded border-2 transition-colors
              flex items-center justify-center
              peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-pink-500
              peer-checked:border-purple-400
              ${
                disabled
                  ? "border-white/10 bg-white/5"
                  : "border-white/30 bg-white/5 group-hover:border-white/50"
              }
            `}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            {/* Checkmark */}
            <motion.svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: props.checked ? 1 : 0,
                scale: props.checked ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Label and Description */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span className="text-sm text-white/90 block">{label}</span>
            )}
            {description && (
              <span className="text-xs text-white/60 block mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
