"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
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
          {/* Hidden native radio */}
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          {/* Custom radio button */}
          <motion.div
            className={`
              w-5 h-5 rounded-full border-2 transition-colors
              flex items-center justify-center
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
            {/* Inner dot */}
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
              initial={{ scale: 0 }}
              animate={{ scale: props.checked ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            />
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

RadioButton.displayName = "RadioButton";
