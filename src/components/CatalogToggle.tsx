/**
 * CatalogToggle Component
 *
 * DEV ONLY: Helper button to show how to toggle Catalog Mode
 * Shows a floating button with instructions for toggling catalog sidebar
 *
 * To use: Add <CatalogToggle /> to your layout or page in development
 */

"use client";

import { siteConfig } from "@/config/site-config";

export function CatalogToggle() {
  // Only show in development
  const isDev = process.env.NODE_ENV !== "production";

  const handleToggle = () => {
    // This is a development helper - in production, users would edit site-config.ts
    alert(
      siteConfig.isCatalog
        ? "To disable Catalog Mode:\n\nEdit src/config/site-config.ts and set:\nisCatalog: false\n\nThen refresh the page."
        : "To enable Catalog Mode:\n\nEdit src/config/site-config.ts and set:\nisCatalog: true\n\nThen refresh the page."
    );
  };

  if (!isDev) return null;

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-24 right-4 z-50 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 border border-purple-400/30"
      title="Toggle Catalog Mode"
    >
      📚 Catalog {siteConfig.isCatalog ? "ON" : "OFF"}
    </button>
  );
}
