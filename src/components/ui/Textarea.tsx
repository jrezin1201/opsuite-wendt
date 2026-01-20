"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxCharCount?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount,
      maxCharCount,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const currentLength = (props.value as string)?.length || 0;
    const showCount = showCharCount || maxCharCount;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-2">
            {label}
            {props.required && <span className="text-pink-400 ml-1">*</span>}
          </label>
        )}

        {/* Textarea Field */}
        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white/5 border transition-all
            text-white placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-offset-0
            resize-none
            ${
              hasError
                ? "border-red-500 focus:ring-red-500/50"
                : "border-white/20 focus:border-purple-500 focus:ring-purple-500/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Footer: Error/Helper Text + Character Count */}
        <div className="flex items-center justify-between mt-1.5">
          {/* Error or Helper Text */}
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm ${
                hasError ? "text-red-400" : "text-white/60"
              }`}
            >
              {error || helperText}
            </motion.p>
          )}

          {/* Character Count */}
          {showCount && (
            <span
              className={`text-xs ${
                maxCharCount && currentLength > maxCharCount
                  ? "text-red-400"
                  : "text-white/50"
              }`}
            >
              {currentLength}
              {maxCharCount && ` / ${maxCharCount}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
