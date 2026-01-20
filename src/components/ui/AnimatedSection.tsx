"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: "fade-in" | "slide-up" | "scale-in" | "blur-in" | "rotate-in";
  className?: string;
}

export function AnimatedSection({
  children,
  variant = "fade-in",
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    "fade-in": {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 },
    },
    "scale-in": {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    "blur-in": {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
    "rotate-in": {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0 },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Parallax section
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <section ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </section>
  );
}

// Split text animation
interface SplitTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function SplitText({ text, delay = 0, className = "" }: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Animated gradient background
interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({
  children,
  className = "",
}: GradientBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(45deg, #8B5CF6, #EC4899)",
            "linear-gradient(90deg, #EC4899, #8B5CF6)",
            "linear-gradient(135deg, #8B5CF6, #EC4899)",
            "linear-gradient(180deg, #EC4899, #8B5CF6)",
            "linear-gradient(45deg, #8B5CF6, #EC4899)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children}
    </div>
  );
}

// Floating elements
interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  delay = 0,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Morphing shape
export function MorphingShape({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-full ${className}`}
      animate={{
        borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Pulse effect
interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function Pulse({
  children,
  scale = 1.05,
  duration = 2,
  className = "",
}: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
