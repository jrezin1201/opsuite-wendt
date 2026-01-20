"use client";

import React, { useEffect } from "react";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
};

export function Drawer({ isOpen, onClose, children, title, side = "left" }: DrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 ${side === "left" ? "left-0" : "right-0"} bottom-0 z-50
          w-80 max-w-[85vw] bg-[#070A12] border-${side === "left" ? "r" : "l"} border-white/10
          shadow-2xl overflow-y-auto
          ${side === "left" ? "animate-slideInLeft" : "animate-slideInRight"}
        `}
      >
        {title && (
          <div className="sticky top-0 z-10 bg-[#070A12]/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}
