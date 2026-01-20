# Modules Directory

This directory contains all feature modules following the **Vertical Slice Architecture** pattern.

## Architecture Philosophy

Each module is a **self-contained vertical slice** that includes:

- UI components specific to the feature
- Business logic and state management
- API routes (if needed)
- Types and interfaces
- Tests
- Documentation

## Module Structure

Each module should follow this structure:

```
modules/
└── {feature-name}/
    ├── components/          # UI components for this feature
    │   └── FeatureComponent.tsx
    ├── hooks/              # Custom hooks (optional)
    │   └── useFeatureLogic.ts
    ├── lib/                # Business logic, utilities
    │   └── calculations.ts
    ├── types/              # TypeScript interfaces (optional)
    │   └── index.ts
    ├── api/                # API route handlers (optional)
    │   └── route.ts
    └── index.ts            # Public exports
```

## Current Modules

| Module ID | Name | Category | Status |
|-----------|------|----------|--------|
| `landing` | Landing Pages | Marketing | 🚧 Migrating |
| `auth` | User & Security | User Management | ⏳ Planned |
| `billing` | SaaS Pricing | Commerce | ⏳ Planned |
| `component-lib` | Component Library | UI Components | ⏳ Planned |
| `ai-studio` | AI Intelligence | AI Intelligence | 💡 Future |
| `admin` | Admin Panel | Admin | 💡 Future |

## Feature Gating

All modules are controlled via `src/config/site-config.ts`:

```typescript
// Turn modules on/off by editing this array
activeFeatures: [
  "landing",
  "auth",
  "billing",
  "component-lib"
]
```

## Usage

Import from modules using path aliases:

```typescript
// ✅ Good - import from module index
import { LandingHero } from "@/modules/landing";

// ❌ Bad - don't reach into internal structure
import { LandingHero } from "@/modules/landing/components/Hero";
```

## Adding a New Module

1. Create directory: `src/modules/{module-name}/`
2. Add to `site-config.ts` FeatureId type
3. Add to `registry.ts` with metadata
4. Create index.ts with public exports
5. Add to activeFeatures array when ready
