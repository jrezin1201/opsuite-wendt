/**
 * CatalogLayout Component
 *
 * Conditional layout wrapper that shows ModuleSidebar when catalog mode is enabled
 * Usage: Wrap app content in layout.tsx with this component
 */

"use client";

import { siteConfig } from "@/config/site-config";
import { ModuleSidebar } from "./ModuleSidebar";

interface CatalogLayoutProps {
  children: React.ReactNode;
}

export function CatalogLayout({ children }: CatalogLayoutProps) {
  if (!siteConfig.isCatalog) {
    // Normal mode - no sidebar
    return <>{children}</>;
  }

  // Catalog mode - show sidebar + content
  return (
    <div className="flex min-h-screen">
      <ModuleSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
