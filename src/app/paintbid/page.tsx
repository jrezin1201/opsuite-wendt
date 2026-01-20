"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/paintbid/Sidebar";
import { usePaintBidStore } from "@/lib/paintbid/store";
import { NewImportScreen } from "./screens/NewImportScreen";
import { NewBidFormScreen } from "./screens/NewBidFormScreen";
import { NewProposalScreen } from "./screens/NewProposalScreen";
import { NewExportScreen } from "./screens/NewExportScreen";
import { InstructionsScreen } from "./screens/InstructionsScreen";
import { LegacyWorkflowScreen } from "./screens/LegacyWorkflowScreen";

export default function PaintBidPage() {
  const initialize = usePaintBidStore((state) => state.initialize);
  const initialized = usePaintBidStore((state) => state.initialized);
  const lastSavedAt = usePaintBidStore((state) => state.lastSavedAt);
  const [activeTab, setActiveTab] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const tabs = [
    {
      label: "Instructions",
      icon: "📖",
      description: "Complete guide & help",
      content: <InstructionsScreen />,
    },
    {
      label: "Import",
      icon: "📥",
      description: "Upload File 2 Excel",
      content: <NewImportScreen />,
    },
    {
      label: "Bid Form",
      icon: "💰",
      description: "Set difficulty & pricing",
      content: <NewBidFormScreen />,
    },
    {
      label: "Proposal",
      icon: "📄",
      description: "Generate & print",
      content: <NewProposalScreen />,
    },
    {
      label: "Export",
      icon: "📤",
      description: "Download & backup",
      content: <NewExportScreen />,
    },
    {
      label: "Legacy Workflow",
      icon: "🕰️",
      description: "Original POC screens",
      content: <LegacyWorkflowScreen />,
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + number for tab switching
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "6") {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (tabIndex < tabs.length) {
          setActiveTab(tabIndex);
        }
      }
      // Cmd/Ctrl + / for shortcuts help
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
      // Escape to close shortcuts modal
      if (e.key === "Escape" && showShortcuts) {
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcuts, tabs.length]);

  if (!initialized) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-xl font-semibold text-brand-navy">Loading PaintBid...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 paintbid-app">
      {/* Sidebar Navigation */}
      <div className="paintbid-sidebar print:hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden paintbid-main">
        {/* Header */}
        <div className="bg-white border-b-2 border-brand-gold shadow-sm px-8 py-4 paintbid-header print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">{tabs[activeTab].label}</h1>
              {tabs[activeTab].description && (
                <p className="text-sm text-gray-600 mt-1">{tabs[activeTab].description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowShortcuts(true)}
                className="text-sm text-gray-600 hover:text-brand-navy font-semibold flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Keyboard shortcuts"
              >
                <span>⌨️</span>
                <span>Shortcuts</span>
              </button>
              {lastSavedAt && (
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">Last saved:</span>{" "}
                  {new Date(lastSavedAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 paintbid-content">
          <div className="max-w-7xl mx-auto print:max-w-none">{tabs[activeTab].content}</div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navy2 px-6 py-5 border-b-4 border-brand-gold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⌨️</span>
                  <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  title="Close (Esc)"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Navigation */}
              <div>
                <h3 className="text-lg font-bold text-brand-navy mb-3">Navigation</h3>
                <div className="space-y-2">
                  <ShortcutRow
                    keys={["Cmd", "1"]}
                    description="Go to Instructions tab"
                  />
                  <ShortcutRow
                    keys={["Cmd", "2"]}
                    description="Go to Import tab"
                  />
                  <ShortcutRow
                    keys={["Cmd", "3"]}
                    description="Go to Bid Form tab"
                  />
                  <ShortcutRow
                    keys={["Cmd", "4"]}
                    description="Go to Proposal tab"
                  />
                  <ShortcutRow
                    keys={["Cmd", "5"]}
                    description="Go to Export tab"
                  />
                  <ShortcutRow
                    keys={["Cmd", "6"]}
                    description="Go to Legacy Workflow tab"
                  />
                </div>
              </div>

              {/* General */}
              <div>
                <h3 className="text-lg font-bold text-brand-navy mb-3">General</h3>
                <div className="space-y-2">
                  <ShortcutRow
                    keys={["Cmd", "/"]}
                    description="Show/hide this shortcuts panel"
                  />
                  <ShortcutRow
                    keys={["Cmd", "P"]}
                    description="Print current proposal (on Proposal tab)"
                  />
                  <ShortcutRow
                    keys={["Esc"]}
                    description="Close modal or dialog"
                  />
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-2">Tip</h4>
                    <p className="text-sm text-gray-700">
                      On Windows, use <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl</kbd> instead of{" "}
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Cmd</kbd>.
                      All shortcuts work the same way!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Keyboard shortcut row component
function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
      <span className="text-gray-700 text-sm">{description}</span>
      <div className="flex items-center gap-2">
        {keys.map((key, idx) => (
          <span key={idx}>
            <kbd className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-700 shadow-sm">
              {key}
            </kbd>
            {idx < keys.length - 1 && (
              <span className="text-gray-400 mx-1">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
