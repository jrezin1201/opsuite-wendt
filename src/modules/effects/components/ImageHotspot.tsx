"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  link?: string;
}

interface ImageHotspotProps {
  imageUrl: string;
  hotspots: Hotspot[];
  imageAlt?: string;
  pulseColor?: string;
  popoverBg?: string;
}

export function ImageHotspot({
  imageUrl,
  hotspots,
  imageAlt = "Interactive image",
  pulseColor = "bg-purple-500",
  popoverBg = "bg-gray-900",
}: ImageHotspotProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  return (
    <div className="relative inline-block max-w-full">
      {/* Image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-auto rounded-lg"
      />

      {/* Hotspots */}
      {hotspots.map((hotspot) => {
        const isActive = activeHotspot === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Pulse button */}
            <button
              onClick={() => handleHotspotClick(hotspot.id)}
              className="relative group"
              aria-label={hotspot.title}
            >
              {/* Outer pulse ring */}
              <span
                className={`absolute inset-0 ${pulseColor} rounded-full animate-ping opacity-75`}
              />

              {/* Inner dot */}
              <span
                className={`relative flex items-center justify-center w-8 h-8 ${pulseColor} rounded-full ${
                  isActive ? "ring-4 ring-white" : ""
                } transition-all`}
              >
                <span className="w-3 h-3 bg-white rounded-full" />
              </span>
            </button>

            {/* Popover */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 z-10 w-64 ${popoverBg} text-white rounded-lg shadow-xl p-4 pointer-events-auto`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Arrow */}
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 ${popoverBg} rotate-45`}
                  />

                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-bold text-lg mb-2">{hotspot.title}</h3>
                    <p className="text-sm text-white/80 mb-3">
                      {hotspot.description}
                    </p>

                    {hotspot.link && (
                      <a
                        href={hotspot.link}
                        className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Click outside to close */}
      {activeHotspot && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveHotspot(null)}
        />
      )}
    </div>
  );
}

// Variant with numbered hotspots
interface NumberedHotspotProps {
  imageUrl: string;
  hotspots: Hotspot[];
  imageAlt?: string;
}

export function NumberedHotspot({
  imageUrl,
  hotspots,
  imageAlt = "Interactive image",
}: NumberedHotspotProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative inline-block max-w-full">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-auto rounded-lg"
      />

      {hotspots.map((hotspot, index) => {
        const isActive = activeHotspot === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              onClick={() =>
                setActiveHotspot(isActive ? null : hotspot.id)
              }
              className={`relative flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all ${
                isActive
                  ? "bg-purple-500 text-white scale-110 ring-4 ring-purple-500/30"
                  : "bg-white text-gray-900 hover:bg-purple-100"
              } shadow-lg`}
            >
              {index + 1}
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-10 w-64 bg-white rounded-lg shadow-xl p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                  <div className="relative">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {hotspot.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {hotspot.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {activeHotspot && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveHotspot(null)}
        />
      )}
    </div>
  );
}
