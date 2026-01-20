"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
};

export function Tooltip({ content, children, side = "top", className = "", delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xl
              border border-white/20 max-w-xs whitespace-pre-line pointer-events-none
              ${positionClasses[side]}
            `}
            role="tooltip"
          >
            {content}
            {/* Arrow */}
            <div
              className={`
                absolute w-0 h-0 border-4 border-gray-900
                ${arrowClasses[side]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type InfoTooltipProps = {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function InfoTooltip({ content, side = "top" }: InfoTooltipProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="More information"
      >
        <svg
          className="w-3 h-3 text-white/60"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </Tooltip>
  );
}
