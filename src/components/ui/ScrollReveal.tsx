"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom" | "flip";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const controls = useAnimation();

  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-down": {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    flip: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0 },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children reveal
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  once?: boolean;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  once = true,
  className = "",
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Progressive reveal (reveals in sequence based on scroll)
interface ProgressiveRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function ProgressiveReveal({
  children,
  threshold = 0.5,
  className = "",
}: ProgressiveRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={
        isInView
          ? { clipPath: "inset(0 0 0 0)" }
          : { clipPath: "inset(0 100% 0 0)" }
      }
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Count-up number animation
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    const stepTime = (duration * 1000) / (end - start);
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (nextCount >= end) {
          clearInterval(timer);
          return end;
        }
        return nextCount;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, start, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {count}{suffix}
    </motion.span>
  );
}
