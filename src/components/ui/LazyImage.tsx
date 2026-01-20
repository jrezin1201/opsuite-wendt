"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  threshold?: number;
  blur?: boolean;
  fadeIn?: boolean;
}

export function LazyImage({
  src,
  alt,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3C/svg%3E",
  className = "",
  threshold = 0.1,
  blur = true,
  fadeIn = true,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${
            blur ? "blur-sm" : ""
          }`}
          aria-hidden="true"
        />
      )}

      {/* Actual Image */}
      <motion.img
        ref={imgRef}
        src={isInView ? src : placeholder}
        alt={alt}
        className={`w-full h-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        initial={fadeIn ? { opacity: 0 } : {}}
        animate={fadeIn && isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      />

      {/* Loading Spinner */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Background lazy loading
interface LazyBackgroundProps {
  src: string;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

export function LazyBackground({
  src,
  children,
  className = "",
  overlay = true,
}: LazyBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: isLoaded ? `url(${src})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: isLoaded ? "transparent" : "#374151",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50 -z-10" aria-hidden="true" />
      )}

      {/* Loading state */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <motion.div
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
