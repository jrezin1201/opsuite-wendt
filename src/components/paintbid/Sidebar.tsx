"use client";

import React from "react";

interface SidebarProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  tabs: Array<{
    label: string;
    icon: string;
    description?: string;
  }>;
}

export function Sidebar({ activeTab, onTabChange, tabs }: SidebarProps) {
  return (
    <div className="w-72 bg-gradient-to-b from-brand-navy to-brand-navy2 border-r-4 border-brand-gold flex flex-col h-full">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-brand-gold/20">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/logo_circle.png"
            alt="RC Wendt Painting Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h2 className="text-white font-bold text-lg">OpSuite</h2>
            <p className="text-white/60 text-xs">R.C. Wendt Painting</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-200 group ${
                activeTab === index
                  ? "bg-brand-gold text-brand-navy shadow-lg transform scale-105"
                  : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                  {tab.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div
                      className={`font-bold text-base ${
                        activeTab === index ? "text-brand-navy" : "text-white"
                      }`}
                    >
                      {tab.label}
                    </div>
                    <kbd
                      className={`text-xs px-2 py-0.5 rounded font-mono ${
                        activeTab === index
                          ? "bg-brand-navy/10 text-brand-navy"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      ⌘{index + 1}
                    </kbd>
                  </div>
                  {tab.description && (
                    <div
                      className={`text-xs mt-1 line-clamp-2 ${
                        activeTab === index
                          ? "text-brand-navy/70"
                          : "text-white/60"
                      }`}
                    >
                      {tab.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-brand-gold/20">
        <div className="text-white/60 text-xs space-y-1">
          <p className="font-semibold text-white/80">Local-Only App</p>
          <p>No data leaves your browser</p>
          <p>Auto-saves every 5 seconds</p>
        </div>
      </div>
    </div>
  );
}
