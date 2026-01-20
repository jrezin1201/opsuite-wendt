"use client";

import React, { useState } from "react";

type NumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  error?: string;
};

export function NumberInput({
  label,
  className = "",
  value,
  onChange,
  min,
  max,
  step = 1,
  showControls = true,
  error,
  ...props
}: NumberInputProps) {
  const [showButtons, setShowButtons] = useState(false);

  const handleIncrement = () => {
    const newValue = Number(value) + step;
    if (max === undefined || newValue <= max) {
      const event = {
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const handleDecrement = () => {
    const newValue = Number(value) - step;
    if (min === undefined || newValue >= min) {
      const event = {
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  // Auto-select all text on focus for number inputs
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    setShowButtons(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowButtons(false);
    props.onBlur?.(e);
  };

  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs text-white/70">{label}</span> : null}
      <div
        className="relative"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => !document.activeElement?.id.includes(props.id || "") && setShowButtons(false)}
      >
        <input
          type="number"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={[
            "w-full px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl border-2 border-white/10 bg-white/5 text-sm text-white",
            "placeholder:text-white/30 backdrop-blur-xl",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:bg-white/8",
            props.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/20 hover:bg-white/7",
            error ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-400/30" : "",
            showControls ? "pr-20" : "",
            className
          ].join(" ")}
          {...props}
        />

        {/* Increment/Decrement Controls */}
        {showControls && (
          <div
            className={`
              absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5
              transition-opacity duration-200
              ${showButtons ? "opacity-100" : "opacity-0"}
            `}
          >
            <button
              type="button"
              onClick={handleIncrement}
              disabled={props.disabled || (max !== undefined && Number(value) >= max)}
              className="w-8 h-4 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 group"
              aria-label="Increment"
            >
              <svg
                className="w-3 h-3 text-white/70 group-hover:text-cyan-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={props.disabled || (min !== undefined && Number(value) <= min)}
              className="w-8 h-4 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 group"
              aria-label="Decrement"
            >
              <svg
                className="w-3 h-3 text-white/70 group-hover:text-cyan-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1 animate-slideInTop">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </label>
  );
}
