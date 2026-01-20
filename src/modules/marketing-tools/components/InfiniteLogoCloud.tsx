"use client";

import { motion } from "framer-motion";

interface Logo {
  name: string;
  url: string; // URL to logo image
}

interface InfiniteLogoCloudProps {
  logos?: Logo[];
  speed?: number; // seconds for one complete loop
  direction?: "left" | "right";
}

const DEFAULT_LOGOS: Logo[] = [
  { name: "Company A", url: "https://via.placeholder.com/150x60/333/999?text=Company+A" },
  { name: "Company B", url: "https://via.placeholder.com/150x60/333/999?text=Company+B" },
  { name: "Company C", url: "https://via.placeholder.com/150x60/333/999?text=Company+C" },
  { name: "Company D", url: "https://via.placeholder.com/150x60/333/999?text=Company+D" },
  { name: "Company E", url: "https://via.placeholder.com/150x60/333/999?text=Company+E" },
  { name: "Company F", url: "https://via.placeholder.com/150x60/333/999?text=Company+F" },
  { name: "Company G", url: "https://via.placeholder.com/150x60/333/999?text=Company+G" },
  { name: "Company H", url: "https://via.placeholder.com/150x60/333/999?text=Company+H" },
];

export function InfiniteLogoCloud({
  logos = DEFAULT_LOGOS,
  speed = 30,
  direction = "left",
}: InfiniteLogoCloudProps) {
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: direction === "left" ? [0, "-50%"] : ["-50%", 0],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 w-40 h-20 flex items-center justify-center bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-white/40 text-sm">
          Trusted by leading companies worldwide
        </p>
      </div>
    </div>
  );
}
