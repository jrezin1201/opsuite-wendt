/**
 * Site Configuration - The Master Toggle
 *
 * This file controls which features are visible/active in the app.
 * Edit this file to turn features on/off without touching code.
 */

export type Theme = "purple" | "blue" | "green" | "orange" | "pink" | "monochrome";

export type FeatureId =
  | "landing"
  | "auth"
  | "billing"
  | "component-lib"
  | "ai-studio"
  | "admin"
  // Professional Services & CRM
  | "crm"
  | "scheduler"
  // Marketing & Social Proof
  | "marketing-tools"
  // Education & Community
  | "lms"
  | "community"
  // Advanced Admin & Operations
  | "admin-ops"
  // Fintech & Data Visualization
  | "fintech"
  // Creative & Interactive
  | "effects"
  // NEW: Priority Showcase Modules
  | "canvas"
  | "dashboard-builder"
  | "workflows"
  | "api-playground"
  | "estimator"
  // Batch 1: Additional Modules
  | "audit-log"
  | "2fa-setup"
  | "notifications"
  | "export-studio"
  // Batch 2: More Modules
  | "documents"
  | "activity"
  | "gamification"
  | "affiliates"
  // Batch 3: Final Modules
  | "configurator"
  | "webhooks"
  | "editor"
  | "media"
  | "product-tour"
  | "knowledge-base"
  | "integrations"
  | "templates"
  | "paintbid";

export interface SiteConfig {
  // App Metadata
  name: string;
  description: string;
  url: string;

  // Feature Flags - Turn modules on/off
  activeFeatures: FeatureId[];

  // UI Configuration
  theme: Theme;
  isCatalog: boolean;  // Show sidebar catalog of all modules
  showAdmin: boolean;  // Hidden admin panel toggle

  // Social & SEO
  links: {
    twitter?: string;
    github?: string;
    docs?: string;
  };
}

export const siteConfig: SiteConfig = {
  // App Metadata
  name: "OpSuite",
  description: "R.C. Wendt Painting - Local-only estimating tool",
  url: "https://opsuite.example.com",

  // Feature Flags
  // Add/remove features from this array to enable/disable them
  activeFeatures: [
    "paintbid"        // PaintBid POC - Main app
    // All template features disabled - uncomment below to show template demos
    // "landing",      // Hero pages & marketing
    // "auth",         // User authentication
    // "billing",      // Stripe payments
    // "component-lib", // UI component showcase
    // "canvas",       // Collaboration canvas
    // "dashboard-builder", // Dashboard builder
    // "workflows",    // Workflow automation
    // "api-playground", // API playground
    // "estimator",     // App estimator
    // "audit-log",    // Audit log viewer
    // "2fa-setup",    // Two-factor authentication
    // "notifications", // Notification center
    // "export-studio", // Data export studio
    // "documents",    // Document generator
    // "activity",     // Activity feed
    // "gamification", // Gamification system
    // "affiliates",   // Affiliate dashboard
    // "configurator",   // Product configurator
    // "webhooks",       // Webhook manager
    // "editor",         // Rich text editor
    // "media",          // Media library
    // "product-tour",   // Product tour
    // "knowledge-base", // Knowledge base
    // "integrations",   // Integration marketplace
    // "templates",      // Template gallery
  ],

  // UI Configuration
  theme: "purple",           // Default color scheme
  isCatalog: false,          // Disabled - OpSuite is the main app now
  showAdmin: false,          // Toggle admin features on/off

  // Social & SEO
  links: {
    github: "https://github.com/yourusername/opsuite",
    docs: "https://docs.opsuite.example.com",
  },
};

/**
 * Helper function to check if a feature is active
 */
export function isFeatureActive(featureId: FeatureId): boolean {
  return siteConfig.activeFeatures.includes(featureId);
}

/**
 * Get all active features
 */
export function getActiveFeatures(): FeatureId[] {
  return siteConfig.activeFeatures;
}

/**
 * Get current theme
 */
export function getCurrentTheme(): Theme {
  return siteConfig.theme;
}
