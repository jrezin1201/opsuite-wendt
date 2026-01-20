"use client";

import { useEffect, useState } from "react";

interface ProgressCircleProps {
  percentage: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressCircle({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#8b5cf6", // purple-500
  backgroundColor = "#e5e7eb", // gray-200
  showPercentage = true,
  label,
  animated = true,
}: ProgressCircleProps) {
  const [displayPercentage, setDisplayPercentage] = useState(percentage);

  useEffect(() => {
    if (!animated) {
      queueMicrotask(() => {
        setDisplayPercentage(percentage);
      });
      return;
    }

    let currentValue = displayPercentage;
    const increment = percentage > currentValue ? 1 : -1;
    const target = Math.min(100, Math.max(0, percentage));

    const timer = setInterval(() => {
      currentValue += increment;

      if (
        (increment > 0 && currentValue >= target) ||
        (increment < 0 && currentValue <= target)
      ) {
        currentValue = target;
        clearInterval(timer);
      }

      setDisplayPercentage(currentValue);
    }, 10);

    return () => clearInterval(timer);
  }, [percentage, animated, displayPercentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayPercentage / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold"
              style={{ fontSize: size * 0.2, color }}
            >
              {Math.round(displayPercentage)}%
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
}

// Variant with multiple segments
interface ProgressSegment {
  label: string;
  percentage: number;
  color: string;
}

interface MultiSegmentCircleProps {
  segments: ProgressSegment[];
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
}

export function MultiSegmentCircle({
  segments,
  size = 120,
  strokeWidth = 8,
  backgroundColor = "#e5e7eb",
}: MultiSegmentCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative offsets upfront
  const segmentData = segments.map((segment, index) => {
    const cumulativePercentage = segments
      .slice(0, index)
      .reduce((sum, s) => sum + s.percentage, 0);

    return {
      ...segment,
      offset: circumference - (cumulativePercentage / 100) * circumference,
      dashArray: `${(segment.percentage / 100) * circumference} ${circumference}`,
    };
  });

  const totalPercentage = segments.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Segment circles */}
          {segmentData.map((data, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={data.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={data.dashArray}
              strokeDashoffset={data.offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {/* Total percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-2xl text-gray-900">
            {Math.round(totalPercentage)}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-gray-600">
              {segment.label}: {segment.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile completion example component
interface ProfileTask {
  id: string;
  label: string;
  completed: boolean;
}

interface ProfileCompletionProps {
  tasks: ProfileTask[];
  size?: number;
}

export function ProfileCompletion({ tasks, size }: ProfileCompletionProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = (completedCount / tasks.length) * 100;

  return (
    <div className="inline-flex flex-col items-center gap-4">
      <ProgressCircle
        percentage={percentage}
        size={size}
        color="#10b981" // green-500
        label="Profile Complete"
      />

      <div className="w-full max-w-xs space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2 text-sm ${
              task.completed ? "text-green-600" : "text-gray-500"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                task.completed
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            >
              {task.completed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span>{task.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
