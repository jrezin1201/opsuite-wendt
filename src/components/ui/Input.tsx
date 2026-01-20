"use client";

import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, className = "", error, success, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const [shake, setShake] = useState(false);

    // Auto-select all text on focus for number inputs (common UX pattern)
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (props.type === "number") {
        e.target.select();
      }
      // Call user-provided onFocus if exists
      props.onFocus?.(e);
    };

    // Trigger shake animation when error appears
    React.useEffect(() => {
      if (error) {
        setShake(true);
        const timer = setTimeout(() => setShake(false), 400);
        return () => clearTimeout(timer);
      }
    }, [error]);

    return (
      <label className="block space-y-1">
        {label ? (
          <span className="text-xs text-white/70">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </span>
        ) : null}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={[
              "w-full px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl border-2 bg-white/5 text-sm text-white",
              "placeholder:text-white/30 backdrop-blur-xl",
              "transition-all duration-200",
              leftIcon ? "pl-10" : "",
              rightIcon || success ? "pr-10" : "",
              error
                ? "border-red-500/50 focus:border-red-500/70 focus:ring-2 focus:ring-red-400/30 focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                : success
                ? "border-green-500/50 focus:border-green-500/70 focus:ring-2 focus:ring-green-400/30 focus:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:bg-white/8",
              props.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/20 hover:bg-white/7",
              shake ? "animate-shake" : "",
              className
            ].join(" ")}
            {...props}
            onFocus={handleFocus}
          />

          {/* Right Icon or Success Checkmark */}
          {rightIcon && !success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {rightIcon}
            </div>
          )}
          {success && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-400 mt-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
        {!error && helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/60 mt-1"
          >
            {helperText}
          </motion.p>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";
