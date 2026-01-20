"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number; // 0.1 to 1, lower = slower
  direction?: "up" | "down";
  className?: string;
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up"
      ? [100 * speed, -100 * speed]
      : [-100 * speed, 100 * speed]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

// Parallax background image
interface ParallaxBackgroundProps {
  src: string;
  speed?: number;
  overlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ParallaxBackground({
  src,
  speed = 0.5,
  overlay = true,
  className = "",
  children,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          y,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50 -z-10" aria-hidden="true" />
      )}

      {/* Content */}
      {children}
    </div>
  );
}

// Parallax layers
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
}
