# Web App Template

**A production-ready Next.js template designed to be built on, not thrown away.**

This isn't just a starter — it's a reference implementation. Every screen, interaction, and integration is designed to be copied, modified, and extended. Use it as a foundation for serious products.

## 🏗️ The Nexus Architecture

This template now features **The Nexus** - a modular, vertical slice architecture that enables "New App in a Day" development:

- **📦 Modular Design** - Each feature is a self-contained module you can toggle on/off
- **⚙️ Master Toggle** - Control all features from a single config file (`src/config/site-config.ts`)
- **📚 Catalog Mode** - Optional sidebar showing all 60+ modules grouped by category
- **🎯 Feature Flags** - Conditionally render features based on configuration
- **🚀 Rapid Prototyping** - Enable/disable features instantly without touching code

**[📖 Read the full Nexus documentation →](NEXUS.md)**

### Quick Example

```typescript
// src/config/site-config.ts
export const siteConfig = {
  name: "Your App Name",
  activeFeatures: [
    "landing",      // ✅ Enabled
    "auth",         // ✅ Enabled
    "billing",      // ✅ Enabled
    // "ai-studio", // ❌ Disabled - uncomment to enable
  ],
  isCatalog: true,  // Show module catalog sidebar
};
```

That's it! Features toggle on/off, catalog mode shows/hides - all from one file.

## Why This Template?

Most starters give you the bare minimum and leave you to figure out the hard parts. This template shows you how experienced teams actually build SaaS products:

- **Real authentication flows** - OAuth, sessions, protected routes, user management
- **Actual payment integration** - Subscriptions, webhooks, customer portal, not just mocked buttons
- **Production database patterns** - Migrations, relations, type-safe queries that scale beyond v1
- **Battle-tested architecture** - Organized for clarity and long-term velocity

## Stack

Chosen for clarity, safety, and long-term velocity — not hype:

- **Next.js 15** - App Router, server actions, streaming
- **React 19** - Modern UI patterns
- **TypeScript** - Strict, end-to-end type safety
- **Tailwind CSS** - Consistent, scalable styling
- **Prisma** - Type-safe ORM
- **Auth.js (NextAuth.js)** - Authentication & sessions
- **Stripe** - Billing & subscriptions
- **Neon** - Serverless Postgres

## Features

✅ **Authentication**
- Google OAuth (easily add more providers)
- Protected routes with middleware
- Session management
- User profiles

✅ **Payments**
- Stripe Checkout integration
- Subscription management
- Webhook handling
- Customer billing portal
- Pro/Free tier logic

✅ **Database**
- Prisma ORM with PostgreSQL
- Type-safe queries
- Migration system
- Relations and indexes

✅ **Navigation & UX**
- Sticky navbar with desktop navigation
- Mobile hamburger menu with slide-out panel
- Breadcrumb navigation
- Back-to-top floating button
- Sidebar component for dashboards
- Pagination with smart ellipsis
- Infinite scroll with intersection observer
- Smooth scrolling for anchor links

✅ **UI Components**
- Pre-built component library
- Animated buttons and cards (Framer Motion)
- Responsive design
- Accessible patterns
- Consistent styling
- Micro-interactions throughout

✅ **Input & Interactive Components**
- Form inputs with validation states and icons
- Textarea with character counter
- Checkbox and radio buttons with animations
- Toggle switch (multiple sizes)
- SearchBar with autocomplete and keyboard navigation
- Carousel with auto-play and swipe gestures
- Range slider for numeric values
- DatePicker with visual calendar
- File upload with drag-and-drop
- Multi-step form wizard with progress indicator

✅ **Feedback & Information Display**
- Modal dialogs with backdrop and escape key support
- Tooltips with configurable delay and positioning
- Accordions with single/multiple open support
- Tabs with underline and pill variants
- Progress bars with animations and color variants
- Toast notifications with auto-dismiss
- Skeleton loaders for loading states
- Badges with dots, pills, and notification variants

✅ **Visuals & Animations**
- Parallax scrolling effects for backgrounds and sections
- Advanced hover effects (lift, scale, glow, tilt)
- Dark mode toggle with theme persistence
- Lazy loading for images and backgrounds
- Scroll-triggered reveal animations (fade, slide, zoom, flip)
- Staggered animations for lists and grids
- Count-up number animations
- Floating elements and morphing shapes
- Gradient backgrounds and pulse effects

✅ **Animations**
- Scroll-triggered effects
- Page load animations
- Button hover and tap feedback
- Card hover lifts
- Staggered content reveals
- Spring physics for natural movement

✅ **Developer Experience**
- Full TypeScript coverage
- ESLint configuration
- Hot reload
- Type-safe environment variables
- Organized component structure

## Quick Start

### Prerequisites

You'll need accounts for:
- [Neon](https://neon.tech) - PostgreSQL database (free tier available)
- [Google Cloud Console](https://console.cloud.google.com) - OAuth credentials
- [Stripe](https://stripe.com) - Payment processing (test mode)

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url>
cd web-app-template
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your credentials in .env.local

# 3. Initialize database
npm run db:migrate

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

**📖 Full setup guide:** See [SETUP.md](SETUP.md) for detailed step-by-step instructions.

## Project Structure

```
web-app-template/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── stripe/        # Stripe webhooks & checkout
│   │   │   └── feedback/      # User feedback
│   │   ├── account/           # User dashboard (with breadcrumbs)
│   │   ├── billing/           # Subscription management
│   │   ├── auth/              # Sign in pages
│   │   └── page.tsx           # Landing page (with animations)
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx     # Animated button
│   │   │   ├── Card.tsx       # Hover card
│   │   │   ├── Breadcrumbs.tsx # Navigation breadcrumbs
│   │   │   ├── MobileMenu.tsx # Hamburger menu
│   │   │   ├── Sidebar.tsx    # Dashboard sidebar
│   │   │   ├── Pagination.tsx # Page navigation
│   │   │   ├── InfiniteScroll.tsx # Infinite scroll container
│   │   │   ├── BackToTop.tsx  # Floating scroll button
│   │   │   ├── Input.tsx      # Form input with validation
│   │   │   ├── Textarea.tsx   # Multi-line input
│   │   │   ├── Checkbox.tsx   # Animated checkbox
│   │   │   ├── RadioButton.tsx # Animated radio button
│   │   │   ├── ToggleSwitch.tsx # On/off toggle
│   │   │   ├── SearchBar.tsx  # Search with autocomplete
│   │   │   ├── Carousel.tsx   # Image/content slider
│   │   │   ├── RangeSlider.tsx # Numeric range selector
│   │   │   ├── DatePicker.tsx # Calendar date picker
│   │   │   ├── FileUpload.tsx # Drag-and-drop file upload
│   │   │   ├── MultiStepForm.tsx # Wizard form with steps
│   │   │   ├── Modal.tsx      # Dialog/popup overlay
│   │   │   ├── Tooltip.tsx    # Hover tooltips
│   │   │   ├── Accordion.tsx  # Collapsible sections
│   │   │   ├── Tabs.tsx       # Tab navigation
│   │   │   ├── ProgressBar.tsx # Progress indicators
│   │   │   ├── Toast.tsx      # Notification toasts
│   │   │   ├── SkeletonLoader.tsx # Loading placeholders
│   │   │   ├── Badge.tsx      # Status badges
│   │   │   ├── ParallaxScroll.tsx # Parallax effects
│   │   │   ├── HoverCard.tsx  # Advanced hover effects
│   │   │   ├── DarkModeToggle.tsx # Theme switcher
│   │   │   ├── LazyImage.tsx  # Lazy loading images
│   │   │   ├── ScrollReveal.tsx # Scroll animations
│   │   │   └── AnimatedSection.tsx # Section animations
│   │   ├── providers/         # Context providers
│   │   ├── UserMenu.tsx       # User dropdown
│   │   └── FeedbackWidget.tsx # Feedback button
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Database client
│   │   ├── stripe.ts          # Stripe client
│   │   └── subscription.ts    # Subscription helpers
│   └── middleware.ts          # Auth middleware
└── public/                    # Static assets
```

## Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Create and apply migration
npm run db:deploy    # Deploy migrations (production)
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:reset     # Reset database (⚠️ deletes all data)
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (see [SETUP.md](SETUP.md#production-deployment-vercel))
4. Deploy

The build will automatically run migrations and optimize your app.

### Environment Variables for Production

Update these for production:
- `NEXTAUTH_URL` - Your production domain
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `STRIPE_SECRET_KEY` - Production Stripe key (not test)
- `STRIPE_WEBHOOK_SECRET` - From Stripe Dashboard → Webhooks
- `DATABASE_URL` - Production database connection

See [SETUP.md](SETUP.md) for detailed production setup.

## What Makes This Different

**This template is opinionated by design.** It shows you one clear, well-tested path instead of giving you 10 half-implemented options.

- **Real patterns, not demos** - Authentication actually works. Payments actually process. Database migrations actually run.
- **Production-ready from day one** - Middleware, error handling, webhooks, type safety — all wired correctly.
- **Built to be extended** - Clean architecture that scales. Add features without refactoring core patterns.
- **Reference implementation** - Study the code to learn how things should connect.

## Customization

### Update Branding

1. Change site metadata in `src/app/layout.tsx`
2. Replace logo/favicon in `/public`
3. Modify colors in `tailwind.config.ts`

### Add More Features

The template shows you patterns for:
- **Navigation**: Navbar, hamburger menu, breadcrumbs, sidebar
- **Animations**: Framer Motion for buttons, cards, scroll effects
- **Protected API routes**: Middleware-based auth
- **Webhook handling**: Stripe subscription events
- **User management**: Session handling, role-based features
- **Subscription logic**: Pro/Free tier gating
- **Database queries**: Type-safe Prisma operations
- **Responsive design**: Mobile-first approach

### Navigation Components

```typescript
// Breadcrumbs
<Breadcrumbs items={[
  { label: "Home", href: "/" },
  { label: "Account" }
]} />

// Mobile Menu (auto-included in navbar)
<MobileMenu />

// Back to Top Button
<BackToTop />

// Sidebar (for dashboards)
<Sidebar items={[
  { label: "Dashboard", href: "/dashboard", icon: <Icon /> },
  { label: "Settings", href: "/settings", icon: <Icon /> }
]} />

// Pagination
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  maxVisible={7}
/>

// Infinite Scroll
<InfiniteScroll
  onLoadMore={async () => {
    // Load more data
  }}
  hasMore={hasMore}
  loading={isLoading}
  threshold={100}
>
  {/* Your scrollable content */}
</InfiniteScroll>
```

### Input & Interactive Components

```typescript
// Form Input with validation
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
  required
/>

// Textarea with character counter
<Textarea
  label="Description"
  placeholder="Tell us about yourself"
  maxCharCount={500}
  showCharCount
  rows={4}
/>

// Checkbox
<Checkbox
  label="Remember me"
  description="Keep me signed in for 30 days"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>

// Radio Button
<RadioButton
  label="Monthly"
  description="$10/month"
  name="plan"
  value="monthly"
  checked={plan === "monthly"}
  onChange={(e) => setPlan(e.target.value)}
/>

// Toggle Switch
<ToggleSwitch
  label="Email notifications"
  enabled={notifications}
  onChange={setNotifications}
  size="md"
/>

// SearchBar with autocomplete
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  suggestions={["React", "Next.js", "TypeScript"]}
  placeholder="Search technologies..."
  isLoading={isSearching}
/>

// Carousel
<Carousel
  items={[
    <img src="/slide1.jpg" alt="Slide 1" />,
    <img src="/slide2.jpg" alt="Slide 2" />,
  ]}
  autoPlay
  interval={5000}
  showDots
  showArrows
/>

// Range Slider
<RangeSlider
  label="Price Range"
  min={0}
  max={1000}
  value={price}
  onChange={setPrice}
  formatValue={(val) => `$${val}`}
/>

// DatePicker
<DatePicker
  label="Select date"
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date()}
/>

// File Upload
<FileUpload
  label="Upload files"
  onFilesSelected={(files) => setFiles(files)}
  accept="image/*,.pdf"
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
/>

// Multi-Step Form
<MultiStepForm
  steps={[
    { title: "Account", content: <AccountForm /> },
    { title: "Profile", content: <ProfileForm /> },
    { title: "Review", content: <ReviewForm /> },
  ]}
  onSubmit={handleSubmit}
  showStepIndicator
/>
```

### Feedback & Information Display Components

```typescript
// Modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  closeOnBackdrop
  closeOnEscape
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-3 mt-6">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
  </div>
</Modal>

// Tooltip
<Tooltip content="This is a helpful tip" side="top" delay={200}>
  <button>Hover me</button>
</Tooltip>

// Accordion
<Accordion
  items={[
    { title: "Question 1", content: "Answer to question 1" },
    { title: "Question 2", content: "Answer to question 2" },
  ]}
  allowMultiple={false}
  defaultOpen={[0]}
/>

// Tabs
<Tabs
  items={[
    { label: "Overview", content: <Overview />, icon: <Icon /> },
    { label: "Settings", content: <Settings />, badge: 3 },
  ]}
  variant="underline"
  defaultTab={0}
/>

// Progress Bar
<ProgressBar
  value={75}
  label="Upload Progress"
  showPercentage
  variant="gradient"
  color="purple"
  animated
/>

// Toast Notifications
<ToastContainer
  toasts={toasts}
  onClose={(id) => removeToast(id)}
  position="top-right"
/>

// Skeleton Loaders
<SkeletonCard animated />
<SkeletonAvatar animated />
<SkeletonList count={5} animated />
<SkeletonTable rows={5} columns={4} animated />

// Badge
<Badge variant="success" size="md" pill>
  Active
</Badge>

<Badge variant="warning" dot pulse>
  Beta
</Badge>

// Notification Badge
<NotificationBadge count={12} max={99} position="top-right">
  <IconButton icon={<BellIcon />} />
</NotificationBadge>
```

### Visuals & Animations Components

```typescript
// Parallax Scroll
<ParallaxScroll speed={0.5} direction="up">
  <h1>This scrolls with parallax effect</h1>
</ParallaxScroll>

// Parallax Background
<ParallaxBackground src="/hero-bg.jpg" speed={0.3} overlay>
  <div className="py-20">
    <h1>Hero Section with Parallax Background</h1>
  </div>
</ParallaxBackground>

// Hover Card Effects
<HoverCard effect="lift">
  <Card>Content that lifts on hover</Card>
</HoverCard>

<HoverButton variant="gradient">
  Button with shimmer effect
</HoverButton>

<HoverImage src="/image.jpg" alt="Product" />

// Dark Mode Toggle
<DarkModeToggle />
<DarkModeIcon />

// Lazy Loading
<LazyImage
  src="/large-image.jpg"
  alt="Description"
  placeholder="/placeholder.jpg"
  blur
  fadeIn
/>

<LazyBackground src="/bg-image.jpg" overlay>
  <div className="py-20">Content loads when scrolled into view</div>
</LazyBackground>

// Scroll Reveal Animations
<ScrollReveal animation="slide-up" delay={0.2}>
  <div>Slides up when scrolled into view</div>
</ScrollReveal>

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem><Card /></StaggerItem>
  <StaggerItem><Card /></StaggerItem>
  <StaggerItem><Card /></StaggerItem>
</StaggerContainer>

<ProgressiveReveal>
  <div>Reveals progressively as you scroll</div>
</ProgressiveReveal>

<CountUp end={1000} duration={2} suffix="+" />

// Animated Sections
<AnimatedSection variant="fade-in">
  <div>Fades in when in viewport</div>
</AnimatedSection>

<SplitText text="This text animates word by word" />

<FloatingElement delay={0.5}>
  <Icon />
</FloatingElement>

<GradientBackground>
  <div>Animated gradient background</div>
</GradientBackground>

<Pulse scale={1.05} duration={2}>
  <Badge>New</Badge>
</Pulse>
```

Use these as a foundation to build your own features.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - Use this template for any project, commercial or personal.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/docs)
- [Stripe](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Ready to build?** [View setup guide →](SETUP.md)
