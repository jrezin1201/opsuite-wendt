/**
 * Module Registry
 *
 * Central registry of all modules for the "Sales Catalog" view.
 * Maps module IDs to their metadata (name, description, icon, category, route).
 */

import { type FeatureId } from "./site-config";

export interface ModuleMetadata {
  id: FeatureId;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: ModuleCategory;
  route: string;
  tags?: string[];
  isNew?: boolean;
  isPro?: boolean;
}

export type ModuleCategory =
  | "Marketing"
  | "User Management"
  | "Commerce"
  | "AI Intelligence"
  | "UI Components"
  | "Admin"
  | "Professional Services"
  | "Education"
  | "Fintech"
  | "Creative"
  | "Collaboration"
  | "Analytics"
  | "Automation"
  | "Developer Tools"
  | "Business Tools";

export const moduleRegistry: Record<FeatureId, ModuleMetadata> = {
  landing: {
    id: "landing",
    name: "Landing Pages",
    description:
      "Hero pages, marketing content, and interactive component showcase with 60+ production-ready components",
    icon: "🏠",
    category: "Marketing",
    route: "/",
    tags: ["hero", "marketing", "showcase"],
  },

  auth: {
    id: "auth",
    name: "User & Security",
    description:
      "Complete authentication system with NextAuth.js, OAuth providers, session management, and role-based access control",
    icon: "🔐",
    category: "User Management",
    route: "/auth/signin",
    tags: ["authentication", "oauth", "security"],
  },

  billing: {
    id: "billing",
    name: "SaaS Pricing",
    description:
      "Stripe integration with subscription management, webhook handling, pricing tables, checkout flows, and customer portal",
    icon: "💳",
    category: "Commerce",
    route: "/billing",
    tags: ["stripe", "payments", "subscriptions"],
    isPro: true,
  },

  "component-lib": {
    id: "component-lib",
    name: "Component Library",
    description:
      "60+ production-ready UI components including forms, navigation, feedback, and animations. Built with TypeScript, Framer Motion, and Tailwind CSS",
    icon: "🎨",
    category: "UI Components",
    route: "/#showroom",
    tags: ["ui", "components", "design-system"],
  },

  "ai-studio": {
    id: "ai-studio",
    name: "AI Intelligence",
    description:
      "Streaming chat interface with Anthropic Claude and OpenAI integration. Real-time responses, conversation history, and context management",
    icon: "🤖",
    category: "AI Intelligence",
    route: "/ai-studio",
    tags: ["ai", "chat", "streaming"],
    isNew: true,
    isPro: true,
  },

  admin: {
    id: "admin",
    name: "Admin Panel",
    description:
      "Hidden admin interface for managing users, viewing analytics, and controlling feature flags in real-time",
    icon: "⚙️",
    category: "Admin",
    route: "/admin",
    tags: ["admin", "management", "analytics"],
    isPro: true,
  },

  // Professional Services & CRM
  crm: {
    id: "crm",
    name: "CRM & Client Portal",
    description:
      "Client relationship management with Kanban pipeline, lead tracking, and filtered client portals for customer data access",
    icon: "👥",
    category: "Professional Services",
    route: "/crm",
    tags: ["crm", "clients", "kanban", "pipeline"],
    isNew: true,
    isPro: true,
  },

  scheduler: {
    id: "scheduler",
    name: "Meeting Scheduler",
    description:
      "Cal.com-style meeting scheduler with time slot grid, availability management, and floating time tracker with Zustand state",
    icon: "📅",
    category: "Professional Services",
    route: "/scheduler",
    tags: ["calendar", "meetings", "booking", "time-tracking"],
    isNew: true,
    isPro: true,
  },

  // Marketing & Social Proof
  "marketing-tools": {
    id: "marketing-tools",
    name: "Marketing Toolkit",
    description:
      "Interactive ROI calculator, infinite logo cloud, countdown banners with persistence, and exit-intent popups for lead capture",
    icon: "📈",
    category: "Marketing",
    route: "/marketing-tools",
    tags: ["roi", "calculator", "countdown", "exit-intent"],
    isNew: true,
  },

  // Education & Community
  lms: {
    id: "lms",
    name: "Learning Platform",
    description:
      "Complete LMS with course player, video lessons, quiz system with progress tracking, and final score summaries",
    icon: "🎓",
    category: "Education",
    route: "/lms",
    tags: ["courses", "education", "video", "quiz"],
    isNew: true,
    isPro: true,
  },

  community: {
    id: "community",
    name: "Community Hub",
    description:
      "Member directory with search and filters, nested comment system, and community forum for user engagement",
    icon: "💬",
    category: "Education",
    route: "/community",
    tags: ["forum", "members", "comments", "community"],
    isNew: true,
  },

  // Advanced Admin & Operations
  "admin-ops": {
    id: "admin-ops",
    name: "Operations Center",
    description:
      "System health monitoring, public roadmap with upvoting, changelog timeline, and support ticket management",
    icon: "🔧",
    category: "Admin",
    route: "/admin-ops",
    tags: ["health", "roadmap", "changelog", "support"],
    isNew: true,
    isPro: true,
  },

  // Fintech & Data Visualization
  fintech: {
    id: "fintech",
    name: "Financial Analytics",
    description:
      "P&L statements with actuals vs goals, burn rate gauge, cap table visualizer, and automated tax estimator calculations",
    icon: "💰",
    category: "Fintech",
    route: "/fintech",
    tags: ["finance", "analytics", "charts", "tax"],
    isNew: true,
    isPro: true,
  },

  // Creative & Interactive
  effects: {
    id: "effects",
    name: "Interactive Effects",
    description:
      "Typewriter animations, confetti triggers, image hotspots with popovers, and progress circles for profile completion tracking",
    icon: "✨",
    category: "Creative",
    route: "/effects",
    tags: ["animations", "effects", "interactive", "polish"],
    isNew: true,
  },

  // NEW: Priority Showcase Modules
  canvas: {
    id: "canvas",
    name: "Collaboration Canvas",
    description:
      "Figma/Miro-style infinite whiteboard with real-time collaboration simulation, pan & zoom, sticky notes, and presence indicators",
    icon: "🎨",
    category: "Collaboration",
    route: "/canvas",
    tags: ["whiteboard", "collaboration", "canvas", "real-time"],
    isNew: true,
    isPro: true,
  },

  "dashboard-builder": {
    id: "dashboard-builder",
    name: "Dashboard Builder",
    description:
      "Drag-and-drop analytics dashboard creator with customizable widgets, charts, KPIs, and fullscreen presentation mode",
    icon: "📊",
    category: "Analytics",
    route: "/dashboard-builder",
    tags: ["dashboard", "analytics", "charts", "widgets"],
    isNew: true,
    isPro: true,
  },

  workflows: {
    id: "workflows",
    name: "Workflow Automation",
    description:
      "Visual node-based automation builder like Zapier with triggers, conditions, actions, and live execution simulation",
    icon: "⚙️",
    category: "Automation",
    route: "/workflows",
    tags: ["automation", "workflows", "zapier", "nodes"],
    isNew: true,
    isPro: true,
  },

  "api-playground": {
    id: "api-playground",
    name: "API Playground",
    description:
      "Interactive API documentation and testing tool with request builder, response viewer, and multi-language code generation",
    icon: "🔌",
    category: "Developer Tools",
    route: "/api-playground",
    tags: ["api", "documentation", "testing", "developer"],
    isNew: true,
    isPro: true,
  },

  estimator: {
    id: "estimator",
    name: "App Estimator",
    description:
      "Multi-step wizard for estimating development costs with feature selection, hourly rate calculator, and lead capture form",
    icon: "💰",
    category: "Business Tools",
    route: "/estimator",
    tags: ["estimator", "calculator", "sales", "pricing"],
    isNew: true,
  },
  "audit-log": {
    id: "audit-log",
    name: "Audit Log Viewer",
    description:
      "Comprehensive audit trail with advanced filtering, timeline view, event details inspection, and export capabilities",
    icon: "📜",
    category: "Admin",
    route: "/audit-log",
    tags: ["audit", "logs", "security", "compliance", "tracking"],
    isNew: true,
  },
  "2fa-setup": {
    id: "2fa-setup",
    name: "Two-Factor Authentication",
    description:
      "Step-by-step 2FA setup wizard with authenticator apps, SMS verification, QR codes, and backup recovery codes",
    icon: "🔐",
    category: "User Management",
    route: "/2fa-setup",
    tags: ["security", "authentication", "2fa", "totp", "sms"],
    isNew: true,
  },
  notifications: {
    id: "notifications",
    name: "Notification Center",
    description:
      "Real-time notification feed with type-based filtering, read/unread status, bulk actions, and actionable alerts",
    icon: "🔔",
    category: "User Management",
    route: "/notifications",
    tags: ["notifications", "alerts", "real-time", "feed"],
    isNew: true,
  },
  "export-studio": {
    id: "export-studio",
    name: "Data Export Studio",
    description:
      "Multi-format data export tool with CSV, JSON, Excel, PDF support, field customization, and export history tracking",
    icon: "📤",
    category: "Business Tools",
    route: "/export-studio",
    tags: ["export", "data", "csv", "excel", "pdf", "reports"],
    isNew: true,
  },
  documents: {
    id: "documents",
    name: "Document Generator",
    description:
      "Create professional documents from templates with variable filling, PDF export, and instant download for invoices, contracts, and proposals",
    icon: "📄",
    category: "Business Tools",
    route: "/documents",
    tags: ["documents", "templates", "pdf", "generator", "invoices"],
    isNew: true,
  },
  activity: {
    id: "activity",
    name: "Activity Feed",
    description:
      "Real-time activity stream with filtering, smart grouping by time or type, and comprehensive activity tracking across the platform",
    icon: "📰",
    category: "User Management",
    route: "/activity",
    tags: ["activity", "feed", "timeline", "real-time", "tracking"],
    isNew: true,
  },
  gamification: {
    id: "gamification",
    name: "Gamification System",
    description:
      "Complete gamification platform with points, levels, badges, achievements, and leaderboards to drive user engagement",
    icon: "🎮",
    category: "User Management",
    route: "/gamification",
    tags: ["gamification", "points", "badges", "achievements", "leaderboard"],
    isNew: true,
  },
  affiliates: {
    id: "affiliates",
    name: "Affiliate Dashboard",
    description:
      "Comprehensive affiliate program management with referral tracking, commission calculation, payout scheduling, and performance analytics",
    icon: "🤝",
    category: "Business Tools",
    route: "/affiliates",
    tags: ["affiliates", "referrals", "commissions", "payouts", "tracking"],
    isNew: true,
  },
  // Batch 3: Final Modules
  configurator: {
    id: "configurator",
    name: "Product Configurator",
    description:
      "Interactive product customization with real-time pricing. Multi-step configuration with dynamic options and instant price updates",
    icon: "⚙️",
    category: "Commerce",
    route: "/configurator",
    tags: ["configurator", "customization", "pricing", "products"],
    isNew: true,
  },
  webhooks: {
    id: "webhooks",
    name: "Webhook Manager",
    description:
      "Manage webhook endpoints with event subscriptions, testing tools, and delivery tracking. Monitor success rates and debug failures",
    icon: "🔗",
    category: "Developer Tools",
    route: "/webhooks",
    tags: ["webhooks", "api", "events", "integration", "automation"],
    isNew: true,
  },
  editor: {
    id: "editor",
    name: "Rich Text Editor",
    description:
      "WYSIWYG rich text editor with formatting toolbar, media insertion, and real-time preview. Character and word count tracking",
    icon: "✍️",
    category: "UI Components",
    route: "/editor",
    tags: ["editor", "wysiwyg", "text", "formatting", "content"],
    isNew: true,
  },
  media: {
    id: "media",
    name: "Media Library",
    description:
      "Organize and manage media assets with grid/list views, type filtering, and metadata display. Upload and browse files efficiently",
    icon: "🖼️",
    category: "UI Components",
    route: "/media",
    tags: ["media", "library", "files", "upload", "assets"],
    isNew: true,
  },
  "product-tour": {
    id: "product-tour",
    name: "Product Tour",
    description:
      "Interactive guided tours for user onboarding. Step-by-step walkthroughs with progress tracking and customizable tour library",
    icon: "🎯",
    category: "User Management",
    route: "/product-tour",
    tags: ["tour", "onboarding", "guide", "walkthrough", "tutorial"],
    isNew: true,
  },
  "knowledge-base": {
    id: "knowledge-base",
    name: "Knowledge Base",
    description:
      "Comprehensive documentation system with search, categories, and article views. Track helpfulness ratings and view metrics",
    icon: "📚",
    category: "Business Tools",
    route: "/knowledge-base",
    tags: ["documentation", "knowledge", "articles", "help", "support"],
    isNew: true,
  },
  integrations: {
    id: "integrations",
    name: "Integration Marketplace",
    description:
      "Browse and install third-party integrations. Filter by category, search by name, and manage installed integrations",
    icon: "🔌",
    category: "Developer Tools",
    route: "/integrations",
    tags: ["integrations", "marketplace", "apps", "plugins", "connections"],
    isNew: true,
  },
  templates: {
    id: "templates",
    name: "Template Gallery",
    description:
      "Professional templates for projects, documents, and designs. Browse by category, sort by popularity, and preview before use",
    icon: "📋",
    category: "Business Tools",
    route: "/templates",
    tags: ["templates", "gallery", "designs", "layouts", "starter"],
    isNew: true,
  },
  paintbid: {
    id: "paintbid",
    name: "PaintBid POC",
    description:
      "Local-only painting bid standardizer with pricebook management, takeoff import, complexity adjustments, and proposal generation. All data stored in browser.",
    icon: "🎨",
    category: "Business Tools",
    route: "/paintbid",
    tags: ["estimating", "painting", "bids", "proposals", "pricebook"],
    isNew: true,
  },
};

/**
 * Get all modules grouped by category
 */
export function getModulesByCategory(): Record<
  ModuleCategory,
  ModuleMetadata[]
> {
  const grouped: Record<ModuleCategory, ModuleMetadata[]> = {
    Marketing: [],
    "User Management": [],
    Commerce: [],
    "AI Intelligence": [],
    "UI Components": [],
    Admin: [],
    "Professional Services": [],
    Education: [],
    Fintech: [],
    Creative: [],
    Collaboration: [],
    Analytics: [],
    Automation: [],
    "Developer Tools": [],
    "Business Tools": [],
  };

  Object.values(moduleRegistry).forEach((module) => {
    grouped[module.category].push(module);
  });

  return grouped;
}

/**
 * Get module by ID
 */
export function getModule(id: FeatureId): ModuleMetadata | undefined {
  return moduleRegistry[id];
}

/**
 * Get all modules as array
 */
export function getAllModules(): ModuleMetadata[] {
  return Object.values(moduleRegistry);
}

/**
 * Search modules by name, description, or tags
 */
export function searchModules(query: string): ModuleMetadata[] {
  const lowerQuery = query.toLowerCase();

  return getAllModules().filter((module) => {
    const matchesName = module.name.toLowerCase().includes(lowerQuery);
    const matchesDescription = module.description
      .toLowerCase()
      .includes(lowerQuery);
    const matchesTags = module.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return matchesName || matchesDescription || matchesTags;
  });
}
