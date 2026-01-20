"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  showValue = true,
  formatValue = (val) => val.toString(),
  disabled = false,
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {/* Label and Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-white/80">{label}</label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-purple-400">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}

      {/* Slider Container */}
      <div className="relative pt-1">
        <div className="relative h-2">
          {/* Background Track */}
          <div className="absolute inset-0 bg-white/10 rounded-full" />

          {/* Filled Track */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -ml-2"
            style={{ left: `${percentage}%` }}
            animate={{ left: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className={`
                w-4 h-4 rounded-full bg-white shadow-lg
                ${disabled ? "cursor-not-allowed" : "cursor-grab"}
                ${isDragging ? "cursor-grabbing" : ""}
              `}
              whileHover={!disabled ? { scale: 1.2 } : {}}
              whileTap={!disabled ? { scale: 1.1 } : {}}
              onPointerDown={() => !disabled && setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              style={{
                boxShadow: isDragging
                  ? "0 0 0 4px rgba(168, 85, 247, 0.3)"
                  : undefined,
              }}
            />
          </motion.div>
        </div>

        {/* Hidden Native Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-white/50">{formatValue(min)}</span>
        <span className="text-xs text-white/50">{formatValue(max)}</span>
      </div>
    </div>
  );
}
