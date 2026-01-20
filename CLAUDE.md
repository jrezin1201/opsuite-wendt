# The Nexus - Product Studio Boilerplate

## Project Memory & Architectural Guidelines

This is **The Nexus**, a Next.js 15+ (App Router) boilerplate built for rapid product development using **Vertical Slice Architecture**.

## Core Architecture: Vertical Slice

**Philosophy:** Each feature is a self-contained module. Instead of organizing by technical layers (components, utils, api), we organize by business capability.

### Directory Structure

```
src/
├── modules/              # Each module = one feature slice
│   ├── landing/          # Marketing & hero pages
│   ├── auth/             # User & Security
│   ├── billing/          # SaaS Pricing & Stripe
│   ├── ai-studio/        # AI Sandbox (streaming chat)
│   ├── component-lib/    # UI Component showcase
│   └── [feature]/        # Future modules...
├── config/
│   └── site-config.ts    # Master toggle & app metadata
├── lib/                  # Shared utilities only
└── components/           # Global shared components (layout, nav)
```

### Module Structure (Vertical Slice)

Each module in `src/modules/{feature-name}/` contains:

```
{feature-name}/
├── components/       # Feature-specific UI components
├── api/              # API routes for this feature
├── lib/              # Feature-specific utilities
├── hooks/            # Feature-specific React hooks
├── types/            # TypeScript types for this feature
├── page.tsx          # Main route
└── README.md         # Feature documentation
```

## The Brain: CLAUDE.md (This File)

This file serves as Claude Code's persistent memory. Key information:

### Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui patterns
- **Database:** Prisma + PostgreSQL (Neon)
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **Animations:** Framer Motion
- **AI:** Anthropic/OpenAI streaming responses

### Code Standards
1. **Always use TypeScript** - No implicit any
2. **Follow Vertical Slice** - Keep feature code together
3. **shadcn/ui patterns** - Use existing component patterns
4. **Server Components first** - Use "use client" only when needed
5. **Feature Flags** - All new features behind FeatureGate

### Feature Flag System

All modules are controlled by `src/config/site-config.ts`:

```typescript
export const siteConfig = {
  name: "The Nexus",
  activeFeatures: ["auth", "billing", "ai-studio"],  // Turn features on/off
  theme: "purple",  // Color scheme
  // ... more config
}
```

Use the `<FeatureGate>` component to conditionally render:

```tsx
<FeatureGate featureId="ai-studio">
  <AIComponent />
</FeatureGate>
```

## The Registry: Module Catalog

`src/config/registry.ts` maps all modules for the "Sales Catalog" view:

```typescript
export const moduleRegistry = {
  "landing": {
    name: "Landing Pages",
    description: "Hero, marketing, and showcase",
    icon: "Home",
    category: "Marketing",
    route: "/"
  },
  // ... more modules
}
```

## Development Workflow

### Adding a New Feature Module

1. **Create the module folder:**
   ```
   src/modules/{feature-name}/
   ```

2. **Add to site-config.ts:**
   ```typescript
   activeFeatures: [..., "{feature-name}"]
   ```

3. **Register in registry.ts:**
   ```typescript
   "{feature-name}": {
     name: "Feature Name",
     description: "What it does",
     category: "Category",
     // ...
   }
   ```

4. **Build the feature** following vertical slice principles

### "New App in a Day" Usage

To create a new product:

1. Clone this repo
2. Edit `site-config.ts` - Set `activeFeatures` to only what you need
3. Prompt Claude: "Based on the {module} structure, create a {new-feature} module"
4. Claude will copy the pattern and create a self-contained feature

## Current Modules

### ✅ Implemented

- **landing** - Hero pages, component showcase, theme selector
- **auth** - NextAuth.js with OAuth, sessions, user management
- **billing** - Stripe integration, subscriptions, webhooks
- **component-lib** - 60+ production-ready UI components

### 🔄 Planned (from the plan)

- **ai-studio** - Streaming chat with Anthropic/OpenAI
- **admin** - Hidden admin panel (feature flag: showAdmin)

## Key Files to Remember

- **CLAUDE.md** (this file) - Project memory, always read first
- **src/config/site-config.ts** - Master toggle for all features
- **src/config/registry.ts** - Module metadata for catalog view
- **src/components/FeatureGate.tsx** - Conditional rendering component

## Catalog Mode

When `siteConfig.isCatalog = true`, the app shows a sidebar with all 60 modules grouped by category. Clicking a module navigates to a preview page. This is for showcasing capabilities to clients.

## Hidden Admin Toggle

Keep a `showAdmin` flag in site-config.ts. When talking to customers, you can toggle features on/off in real-time to show pre-built capabilities without revealing the full codebase structure.

## Important Patterns

### Database Queries
- Use Prisma ORM
- Keep queries in `{module}/lib/db.ts`
- Export typed functions, not raw Prisma calls

### API Routes
- Place in `{module}/api/route.ts`
- Use Next.js App Router conventions
- Return typed responses

### Styling
- Tailwind classes only
- Follow existing component patterns
- Mobile-first responsive design

## When Claude Code Starts a Session

1. **Read CLAUDE.md first** - This file contains the project's persistent memory
2. **Check site-config.ts** - See what features are active
3. **Follow Vertical Slice** - Keep all feature code in its module folder
4. **Use existing patterns** - Look at similar modules for guidance

## Quality Gates

Before completing any task:
- ✅ TypeScript compiles (`npm run build`)
- ✅ Linting passes (`npm run lint`)
- ✅ Feature is behind FeatureGate
- ✅ Module is registered in registry.ts
- ✅ Mobile-responsive
- ✅ README.md in module folder

---

**Last Updated:** 2026-01-02
**Current State:** Transforming web-app-template into The Nexus architecture
