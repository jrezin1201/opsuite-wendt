"use client";

import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, className = "", children, ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs text-white/70">{label}</span> : null}
      <div className="relative">
        <select
          className={[
            "w-full px-3 py-2 pr-10 min-h-[44px] md:min-h-0 rounded-xl border-2 border-white/10 bg-white/5 text-sm text-white",
            "backdrop-blur-xl appearance-none cursor-pointer",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:bg-white/8",
            "hover:border-white/20 hover:bg-white/7",
            props.disabled ? "opacity-50 cursor-not-allowed" : "",
            className
          ].join(" ")}
          {...props}
        >
          {children}
        </select>
        {/* Custom arrow icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200">
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}
