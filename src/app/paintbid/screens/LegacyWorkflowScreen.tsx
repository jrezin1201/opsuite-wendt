"use client";

import React from "react";
import { PricebookScreen } from "./PricebookScreen";
import { ImportScreen } from "./ImportScreen";
import { MappingScreen } from "./MappingScreen";
import { BidScreen } from "./BidScreen";
import { ProposalScreen } from "./ProposalScreen";
import { ExportScreen } from "./ExportScreen";

/**
 * Legacy Workflow - Original POC screens
 * All old workflow screens grouped under one tab
 */
export function LegacyWorkflowScreen() {
  const [activeTab, setActiveTab] = React.useState(0);

  const legacyTabs = [
    {
      label: "Pricebook",
      icon: "📖",
      content: <PricebookScreen />,
    },
    {
      label: "Import",
      icon: "📥",
      content: <ImportScreen />,
    },
    {
      label: "Map",
      icon: "🗺️",
      content: <MappingScreen />,
    },
    {
      label: "Bid",
      icon: "💰",
      content: <BidScreen />,
    },
    {
      label: "Proposal",
      icon: "📄",
      content: <ProposalScreen />,
    },
    {
      label: "Export",
      icon: "📤",
      content: <ExportScreen />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">🕰️ Legacy Workflow</p>
        <p>
          This is the original POC workflow. The new streamlined workflow (Import → Bid Form → Proposal) is recommended for faster bidding.
        </p>
      </div>

      {/* Legacy Tabs */}
      <div className="bg-white border border-brand-line rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-brand-line bg-gray-50 overflow-x-auto">
          {legacyTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === index
                  ? "text-brand-navy bg-white border-b-2 border-brand-gold"
                  : "text-brand-ink/60 hover:text-brand-ink/80 hover:bg-white/50"
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {legacyTabs[activeTab].content}
        </div>
      </div>
    </div>
  );
}
