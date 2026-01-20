"use client";

import { useState } from "react";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  helperText?: string;
  color?: "blue" | "green" | "purple" | "orange";
};

export function Toggle({ label, checked, onChange, disabled, helperText, color = "blue" }: ToggleProps) {
  const [isPressed, setIsPressed] = useState(false);

  const colorClasses = {
    blue: "bg-blue-500 peer-focus:ring-blue-400",
    green: "bg-green-500 peer-focus:ring-green-400",
    purple: "bg-purple-500 peer-focus:ring-purple-400",
    orange: "bg-orange-500 peer-focus:ring-orange-400",
  };

  return (
    <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer group">
      <div className="flex-1">
        <span className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-white/90"}`}>
          {label}
        </span>
        {helperText && (
          <p className="text-xs text-white/60 mt-0.5">{helperText}</p>
        )}
      </div>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full relative
            transition-all duration-250
            ${checked
              ? colorClasses[color]
              : "bg-white/20"
            }
            ${disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:opacity-90"
            }
            peer-focus:ring-2 ${checked ? colorClasses[color].split(' ')[1] : "peer-focus:ring-white/30"}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full
              bg-white shadow-md
              transition-all duration-250
              ${checked ? "translate-x-5" : "translate-x-0"}
              ${isPressed ? "scale-95" : "scale-100"}
            `}
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      </div>
    </label>
  );
}
