# The Nexus - Vertical Slice Architecture Boilerplate

## Overview

The Nexus is a **modular, vertical slice architecture** built on Next.js 15+ that enables rapid "New App in a Day" development. Each feature is a self-contained module that can be toggled on/off with a single configuration change.

## 🏗️ Architecture

### Vertical Slice Philosophy

Each module contains **everything** it needs:
- UI components
- Business logic
- Types
- API routes (if needed)
- Tests

**Benefits:**
- Feature isolation - changes don't ripple across the codebase
- Easy to add/remove features
- Clear ownership boundaries
- Scales to large teams

### Directory Structure

```
src/
├── modules/                    # All feature modules (vertical slices)
│   ├── landing/               # Marketing & showcase
│   ├── auth/                  # User authentication
│   ├── billing/               # Stripe payments
│   ├── component-lib/         # UI component showcase
│   ├── ai-studio/             # AI chat interface
│   └── admin/                 # Admin panel
├── config/
│   ├── site-config.ts         # ⚙️  Master toggle - controls everything
│   └── registry.ts            # Module metadata for catalog
├── components/
│   ├── catalog/               # Catalog Mode UI (sidebar)
│   ├── FeatureGate.tsx        # Conditional rendering wrapper
│   └── ui/                    # Shared UI primitives
└── app/                       # Next.js routes (thin wrappers)
```

## 🎮 Quick Start

### 1. Toggle Features On/Off

Edit `src/config/site-config.ts`:

```typescript
export const siteConfig: SiteConfig = {
  name: "Your App Name",
  description: "Your app description",

  // 🎯 Toggle features here - just add/remove from array
  activeFeatures: [
    "landing",      // ✅ Active
    "auth",         // ✅ Active
    "billing",      // ✅ Active
    "component-lib" // ✅ Active
    // "ai-studio", // ❌ Disabled - uncomment to enable
    // "admin",     // ❌ Disabled - uncomment to enable
  ],

  // UI Configuration
  theme: "purple",
  isCatalog: true,  // 📚 Show catalog sidebar
  showAdmin: false,
};
```

### 2. Enable Catalog Mode

Set `isCatalog: true` to see the module sidebar:

- **Catalog Mode ON**: Shows sidebar with all modules grouped by category
- **Catalog Mode OFF**: Normal app layout (production mode)

### 3. Add New Modules

```bash
# 1. Create module directory
mkdir -p src/modules/my-feature/components

# 2. Add to FeatureId type in site-config.ts
export type FeatureId =
  | "landing"
  | "auth"
  | "my-feature"  // ← Add here
  // ...

# 3. Add to registry.ts
export const moduleRegistry: Record<FeatureId, ModuleMetadata> = {
  "my-feature": {
    id: "my-feature",
    name: "My Feature",
    description: "What this feature does",
    icon: "🚀",
    category: "Marketing",
    route: "/my-feature",
    tags: ["cool", "feature"],
    isNew: true,
  },
  // ...
}

# 4. Create module index
echo 'export { MyFeature } from "./components/MyFeature";' > src/modules/my-feature/index.ts

# 5. Add to activeFeatures when ready
```

## 🔧 Key Concepts

### Feature Gating

Use `FeatureGate` to conditionally render features:

```tsx
import { FeatureGate } from "@/components/FeatureGate";

// Show only if feature is active
<FeatureGate featureId="billing">
  <PricingTable />
</FeatureGate>

// Or use the hook
import { useFeature } from "@/components/FeatureGate";

function MyComponent() {
  const hasBilling = useFeature("billing");

  return (
    <div>
      {hasBilling && <UpgradeButton />}
    </div>
  );
}
```

### Module Structure

Each module follows this pattern:

```
modules/my-feature/
├── components/          # UI components
│   ├── FeatureMain.tsx
│   └── FeatureCard.tsx
├── hooks/              # Custom hooks (optional)
│   └── useFeatureLogic.ts
├── lib/                # Business logic
│   └── calculations.ts
├── types/              # TypeScript types (optional)
│   └── index.ts
└── index.ts            # Public API - only export what's needed
```

**Public API Example:**

```typescript
// modules/my-feature/index.ts
export { MyFeature } from "./components/MyFeature";
export { useFeatureData } from "./hooks/useFeatureData";
// Don't export internal implementation details
```

### Importing from Modules

```typescript
// ✅ Good - import from module public API
import { MyFeature } from "@/modules/my-feature";

// ❌ Bad - don't reach into internal structure
import { MyFeature } from "@/modules/my-feature/components/MyFeature";
```

## 📚 Catalog Mode

When `isCatalog: true`, the app shows a sidebar with:

- All modules grouped by category
- Search functionality
- Visual indicators (NEW, PRO, OFF)
- Quick navigation between modules

**Perfect for:**
- Demonstrating capabilities to clients
- Internal documentation
- Development reference
- "Sales catalog" showing all available features

## 🎨 Module Categories

Modules are grouped into categories in the registry:

- **Marketing** - Landing pages, public content
- **User Management** - Auth, profiles, settings
- **Commerce** - Billing, subscriptions, payments
- **AI Intelligence** - Chat, AI features
- **UI Components** - Component libraries
- **Admin** - Admin panels, analytics

## 🚀 Deployment

### Production Mode

For production, typically:

```typescript
// site-config.ts
{
  isCatalog: false,        // Hide catalog sidebar
  activeFeatures: [        // Only production-ready features
    "landing",
    "auth",
    "billing",
  ],
}
```

### Development Mode

For development/demos:

```typescript
// site-config.ts
{
  isCatalog: true,         // Show catalog sidebar
  activeFeatures: [        // All features for testing
    "landing",
    "auth",
    "billing",
    "component-lib",
    "ai-studio",
    "admin",
  ],
}
```

## 📖 Best Practices

### 1. **Keep Modules Independent**
- Avoid cross-module imports
- Share code via `/components/ui` or `/lib`
- Each module should work standalone

### 2. **Use Feature Gates**
- Wrap premium/conditional features in `<FeatureGate>`
- Check features at runtime with `useFeature()`
- Never assume a feature is active

### 3. **Public API Only**
- Only export what's needed from module index
- Keep implementation details private
- Makes refactoring easier

### 4. **Follow Module Template**
```
modules/{feature}/
├── components/  # UI layer
├── hooks/       # React hooks
├── lib/         # Business logic
├── types/       # TypeScript types
└── index.ts     # Public exports
```

### 5. **Document in Registry**
- Clear, descriptive names
- Helpful descriptions
- Relevant tags for search
- Accurate category

## 🔍 FAQ

**Q: How do I disable a feature?**
A: Remove it from `activeFeatures` array in `site-config.ts`

**Q: Can I have features depend on other features?**
A: Yes, use `MultiFeatureGate` with `requireAll={true}`:
```tsx
<MultiFeatureGate featureIds={["auth", "billing"]} requireAll={true}>
  <PremiumFeature />
</MultiFeatureGate>
```

**Q: How do I share code between modules?**
A: Use shared directories:
- `/components/ui` - Shared UI components
- `/lib` - Shared utilities
- `/hooks` - Shared React hooks

**Q: What about API routes in modules?**
A: Create them in the module, then reference from `/app/api`:
```typescript
// app/api/my-feature/route.ts
export { POST } from "@/modules/my-feature/api/route";
```

**Q: Can I have multiple themes?**
A: Yes! Edit `theme` in site-config.ts:
```typescript
theme: "purple" | "blue" | "green" | "orange" | "pink" | "monochrome"
```

## 📝 Next Steps

1. **Review CLAUDE.md** - Persistent memory for AI assistant
2. **Explore modules/** - See example vertical slices
3. **Toggle features** - Try enabling/disabling in site-config.ts
4. **Enable Catalog Mode** - Set `isCatalog: true` to see sidebar
5. **Create your first module** - Follow the template above

## 🎯 Vision

The Nexus enables:
- **"New App in a Day"** - Clone, configure, ship
- **Rapid prototyping** - Toggle features on/off instantly
- **Client demos** - Show all capabilities via Catalog Mode
- **Team collaboration** - Clear module boundaries
- **Long-term maintainability** - Modules don't tangle

Built with production-ready patterns, not shortcuts.

---

**Built with:** Next.js 15 • React 19 • TypeScript • Tailwind CSS • Prisma • NextAuth • Stripe
