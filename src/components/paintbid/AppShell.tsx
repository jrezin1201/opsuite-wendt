"use client";

import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  lastSaved?: number;
}

export function AppShell({ children, lastSaved }: AppShellProps) {
  const savedText = lastSaved
    ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
    : "Not saved";

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              {/* Logo placeholder - will be replaced with actual image */}
              <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold font-bold text-xl">
                RC
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  PaintBid POC
                </h1>
                <p className="text-xs text-white/60">
                  R.C. Wendt Painting — Local-only estimating prototype
                </p>
              </div>
            </div>

            {/* Right: Save Status */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-brand-gold/80">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{savedText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
