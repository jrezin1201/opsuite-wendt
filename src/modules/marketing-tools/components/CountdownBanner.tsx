"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownBannerProps {
  endDate: Date;
  title?: string;
  message?: string;
  storageKey?: string;
  bgColor?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const calculateTime = (endDate: Date): TimeRemaining => {
  const now = new Date().getTime();
  const end = endDate.getTime();
  const distance = end - now;

  if (distance < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    expired: false,
  };
};

export function CountdownBanner({
  endDate,
  title = "Limited Time Offer",
  message = "Don't miss out!",
  storageKey = "countdown-banner-dismissed",
  bgColor = "bg-gradient-to-r from-purple-600 to-pink-600",
}: CountdownBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start true to avoid hydration mismatch
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTime(endDate)
  );
  const [isMounted, setIsMounted] = useState(false);
  const hasInitialized = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const dismissed = localStorage.getItem(storageKey) === "true";
      // Batch updates in a single microtask
      queueMicrotask(() => {
        setIsMounted(true);
        setIsDismissed(dismissed);
      });
    }
  }, [storageKey]);

  // Update countdown timer
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setTimeRemaining(calculateTime(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, isMounted]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setIsDismissed(true);
  };

  // Don't render on server or if dismissed or expired
  if (!isMounted || isDismissed || timeRemaining.expired) {
    return null;
  }

  return (
    <div className={`${bgColor} text-white py-3 px-4 sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div>
            <span className="font-bold text-lg">{title}</span>
            <span className="hidden sm:inline ml-2 text-white/90">— {message}</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 font-mono">
            <TimeUnit value={timeRemaining.days} label="d" />
            <span className="text-white/60">:</span>
            <TimeUnit value={timeRemaining.hours} label="h" />
            <span className="text-white/60">:</span>
            <TimeUnit value={timeRemaining.minutes} label="m" />
            <span className="text-white/60">:</span>
            <TimeUnit value={timeRemaining.seconds} label="s" />
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-xl font-bold">{value.toString().padStart(2, "0")}</span>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}
