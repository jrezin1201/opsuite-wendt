"use client";

import { motion } from "framer-motion";

interface HoverCardProps {
  children: React.ReactNode;
  effect?: "lift" | "scale" | "glow" | "tilt" | "border";
  className?: string;
}

export function HoverCard({
  children,
  effect = "lift",
  className = "",
}: HoverCardProps) {
  const effects = {
    lift: {
      whileHover: { y: -8, scale: 1.02 },
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
    scale: {
      whileHover: { scale: 1.05 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 },
    },
    glow: {
      whileHover: { boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" },
      transition: { duration: 0.3 },
    },
    tilt: {
      whileHover: { rotateX: 5, rotateY: 5 },
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
    border: {
      whileHover: { borderColor: "rgba(168, 85, 247, 0.8)" },
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      {...effects[effect]}
    >
      {children}
    </motion.div>
  );
}

// Interactive button with multiple hover effects
interface HoverButtonProps {
  children: React.ReactNode;
  variant?: "default" | "gradient" | "outline" | "ghost";
  onClick?: () => void;
  className?: string;
}

export function HoverButton({
  children,
  variant = "default",
  onClick,
  className = "",
}: HoverButtonProps) {
  const variants = {
    default:
      "bg-white/10 border border-white/20 text-white hover:bg-white/20",
    gradient:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none",
    outline: "bg-transparent border-2 border-purple-500 text-purple-300",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg font-semibold
        transition-all relative overflow-hidden
        ${variants[variant]} ${className}
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Image with hover zoom effect
interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function HoverImage({
  src,
  alt,
  className = "",
  overlay = true,
}: HoverImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Overlay on hover */}
      {overlay && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white font-semibold">{alt}</p>
        </motion.div>
      )}
    </div>
  );
}

// Icon with bounce effect
interface HoverIconProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function HoverIcon({
  children,
  size = "md",
  color = "text-purple-400",
}: HoverIconProps) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <motion.div
      className={`${sizes[size]} ${color} flex items-center justify-center cursor-pointer`}
      whileHover={{
        scale: 1.2,
        rotate: 5,
      }}
      whileTap={{
        scale: 0.9,
        rotate: -5,
      }}
      transition={{
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      }}
    >
      {children}
    </motion.div>
  );
}
