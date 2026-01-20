"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/UserMenu";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { BackToTop } from "@/components/ui/BackToTop";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { ParallaxScroll } from "@/components/ui/ParallaxScroll";
import { HoverCard } from "@/components/ui/HoverCard";
import { ScrollReveal, CountUp } from "@/components/ui/ScrollReveal";
import { ComponentShowcase } from "@/components/ComponentShowcase";
import { motion } from "framer-motion";
import { useEffect } from "react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export function LandingPage() {
  const { data: session, status } = useSession();
  const isPro = session?.user?.isPro || false;

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="min-h-screen theme-gradient transition-all duration-700">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <h1 className="text-xl font-bold text-white">Web App Template</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {session && (
                <>
                  <Link
                    href="/account"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/billing"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Billing
                  </Link>
                </>
              )}
              <a
                href="#showroom"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Features
              </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {status !== "loading" && isPro && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="hidden sm:block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400/20 to-yellow-400/20 border border-amber-400/30 rounded-full text-amber-300"
                >
                  PRO
                </motion.span>
              )}
              <ThemeSelector />
              <div className="hidden md:block">
                <UserMenu />
              </div>
              <MobileMenu />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20 relative">
        {/* Floating Elements for Visual Interest */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12 md:mb-20 relative z-10 px-4"
        >
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
          >
            Build real SaaS products —
            <motion.span
              variants={fadeInUp}
              className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              not demos
            </motion.span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-3 leading-relaxed px-4"
          >
            A production-ready Next.js template designed to be built on, not thrown away.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-6 md:mb-10 px-4"
          >
            This app doubles as a feature showroom, demonstrating real-world patterns, polish, and scale-ready architecture.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-sm text-white/50 mb-6 md:mb-8"
          >
            Built the way experienced teams build SaaS.
          </motion.p>
          <motion.div variants={fadeInUp}>
            {status === "unauthenticated" ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signin">Start with the template</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#showroom">View the showroom</Link>
                </Button>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/account">Go to Dashboard</Link>
                </Button>
                {!isPro && (
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/billing">Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Features Grid - Now with Scroll Reveal! */}
        <ScrollReveal animation="fade" className="mb-20">
          <motion.div
            id="showroom"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 scroll-mt-20"
          >
            <motion.div variants={scaleIn}>
              <Card glow="purple" hover={true}>
                <div className="p-8">
                  <motion.div
                    className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Authentication</h3>
                  <p className="text-white/70 leading-relaxed">
                    Production-grade auth flows with OAuth, sessions, and roles — already wired and extensible.
                  </p>
                  <p className="text-white/60 text-sm mt-3">
                    Designed for real users, real orgs, and real permissions.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card glow="pink" hover={true}>
                <div className="p-8">
                  <motion.div
                    className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6"
                    whileHover={{ rotate: -5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Payments</h3>
                  <p className="text-white/70 leading-relaxed">
                    Subscriptions, trials, webhooks, and customer billing — implemented the way SaaS apps actually run.
                  </p>
                  <p className="text-white/60 text-sm mt-3">
                    No mock flows. No shortcuts.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card glow="cyan" hover={true}>
                <div className="p-8">
                  <motion.div
                    className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Database</h3>
                  <p className="text-white/70 leading-relaxed">
                    Type-safe data access with Prisma and Postgres (Neon).
                  </p>
                  <p className="text-white/60 text-sm mt-3">
                    Schemas, migrations, and relationships built to scale beyond v1.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </ScrollReveal>

        {/* Statistics Section - Showcasing CountUp Animation */}
        <ScrollReveal animation="slide-up" className="mb-12 md:mb-20">
          <Card glow="purple">
            <div className="p-6 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-10 text-center">
                Built for Scale
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    <CountUp end={50} duration={2} suffix="+" />
                  </div>
                  <p className="text-white/60 text-sm md:text-base">Components</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    <CountUp end={99} duration={2.5} suffix="%" />
                  </div>
                  <p className="text-white/60 text-sm md:text-base">Type Safe</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    <CountUp end={100} duration={2} suffix="%" />
                  </div>
                  <p className="text-white/60 text-sm md:text-base">Production Ready</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                    <CountUp end={15} duration={1.5} suffix="+" />
                  </div>
                  <p className="text-white/60 text-sm md:text-base">Animations</p>
                </div>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Visual Components Showcase */}
        <ScrollReveal animation="zoom">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Rich Visual Components
              </span>
            </h3>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
              Every component is crafted with attention to detail — hover effects, smooth animations, and delightful interactions.
            </p>
          </div>
        </ScrollReveal>

        {/* Parallax Section - Needs its own space */}
        <div className="mb-12 min-h-[400px] md:min-h-[600px] relative">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Parallax Demo */}
            <div className="min-h-[400px]">
              <ParallaxScroll speed={0.5} direction="up">
                <Card glow="cyan" hover={true}>
                  <div className="p-8">
                    <div className="text-cyan-400 mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Parallax Scrolling</h4>
                    <p className="text-white/70 mb-4">
                      Scroll up and down to see this card move at a different speed than the page. Creates depth and visual interest.
                    </p>
                    <div className="text-cyan-400/50 text-sm">
                      ⬆️ Keep scrolling to see the effect ⬇️
                    </div>
                  </div>
                </Card>
              </ParallaxScroll>
            </div>

            {/* Hover Effects Demo */}
            <div className="space-y-4">
              <HoverCard effect="lift">
                <Card glow="purple" hover={false}>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">Lift Effect</h4>
                    <p className="text-white/70 text-sm">Hover over this card to see it lift up with a smooth spring animation</p>
                  </div>
                </Card>
              </HoverCard>
              <HoverCard effect="scale">
                <Card glow="pink" hover={false}>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">Scale Effect</h4>
                    <p className="text-white/70 text-sm">Hover over this card to see it grow smoothly</p>
                  </div>
                </Card>
              </HoverCard>
              <HoverCard effect="glow">
                <Card glow="cyan" hover={false}>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">Glow Effect</h4>
                    <p className="text-white/70 text-sm">Hover to see an enhanced glow effect</p>
                  </div>
                </Card>
              </HoverCard>
            </div>
          </div>
        </div>

        {/* Spacer for parallax */}
        <div className="mb-20" />

        {/* Full Component Gallery */}
        <ScrollReveal animation="fade" className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Complete Component Library
            </h3>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
              60+ production-ready components across inputs, feedback, navigation, and animations. All built with TypeScript, Framer Motion, and Tailwind CSS.
            </p>
          </div>
          <ComponentShowcase />
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal animation="fade" delay={0.2}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-20" hover={false}>
              <div className="p-10">
                <h3 className="text-3xl font-bold text-white mb-3 text-center">
                  Built with tools you&apos;d actually ship with
                </h3>
                <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">
                  This template uses a modern, opinionated stack — chosen for clarity, safety, and long-term velocity, not hype.
                </p>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                  {[
                    { name: "Next.js 15", desc: "App Router, server actions, streaming" },
                    { name: "React 19", desc: "Modern UI patterns" },
                    { name: "TypeScript", desc: "Strict, end-to-end type safety" },
                    { name: "Tailwind CSS", desc: "Consistent, scalable styling" },
                    { name: "Prisma", desc: "Type-safe ORM" },
                    { name: "Auth.js", desc: "Authentication & sessions" },
                    { name: "Stripe", desc: "Billing & subscriptions" },
                    { name: "Neon", desc: "Serverless Postgres" },
                  ].map((tech) => (
                    <motion.div
                      key={tech.name}
                      variants={fadeInUp}
                      className="text-center group cursor-default"
                    >
                      <motion.p
                        className="font-semibold text-white text-lg mb-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {tech.name}
                      </motion.p>
                      <p className="text-sm text-white/60">{tech.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </ScrollReveal>

        {/* Bottom CTA Section */}
        <ScrollReveal animation="slide-up" duration={0.8}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            <Card glow="purple" hover={true}>
              <div className="p-6 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 px-4">
                  This isn&apos;t just a starter — it&apos;s a reference implementation
                </h3>
                <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                  Clone the app, explore the patterns, and use it as a foundation for serious products.
                  Every screen, interaction, and integration is designed to be copied, modified, and extended.
                </p>
                {status === "unauthenticated" ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <Link href="/auth/signin">Start with the template</Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="#showroom">Explore the showroom</Link>
                    </Button>
                  </div>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="/account">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-white/40">
                Built with Next.js • Deployed on Vercel • Open Source
              </p>
            </div>
            <Link
              href="/account"
              className="text-sm text-white/60 hover:text-white/90 transition-colors flex items-center gap-2 group"
            >
              See how this app is structured
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
          </div>
        </div>
      </motion.footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
