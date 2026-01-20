"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Theme = "purple" | "blue" | "green" | "orange" | "pink" | "monochrome";

interface ThemeConfig {
  name: string;
  gradient: string;
  accent: string;
  accentHover: string;
  icon: string;
}

const themes: Record<Theme, ThemeConfig> = {
  purple: {
    name: "Purple Dreams",
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    accent: "from-purple-500 to-pink-500",
    accentHover: "from-purple-400 to-pink-400",
    icon: "🟣",
  },
  blue: {
    name: "Ocean Blue",
    gradient: "from-slate-900 via-blue-900 to-slate-900",
    accent: "from-blue-500 to-cyan-500",
    accentHover: "from-blue-400 to-cyan-400",
    icon: "🔵",
  },
  green: {
    name: "Forest Green",
    gradient: "from-slate-900 via-green-900 to-slate-900",
    accent: "from-green-500 to-emerald-500",
    accentHover: "from-green-400 to-emerald-400",
    icon: "🟢",
  },
  orange: {
    name: "Sunset Orange",
    gradient: "from-slate-900 via-orange-900 to-slate-900",
    accent: "from-orange-500 to-red-500",
    accentHover: "from-orange-400 to-red-400",
    icon: "🟠",
  },
  pink: {
    name: "Rose Pink",
    gradient: "from-slate-900 via-pink-900 to-slate-900",
    accent: "from-pink-500 to-rose-500",
    accentHover: "from-pink-400 to-rose-400",
    icon: "🌸",
  },
  monochrome: {
    name: "Monochrome",
    gradient: "from-black via-gray-900 to-black",
    accent: "from-gray-500 to-slate-500",
    accentHover: "from-gray-400 to-slate-400",
    icon: "⚫",
  },
};

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      return saved && themes[saved] ? saved : "purple";
    }
    return "purple";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Apply theme on mount and when it changes
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Select theme"
      >
        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="text-xs text-white/50 px-3 py-2 font-semibold uppercase tracking-wider">
                  Color Scheme
                </p>
                {(Object.keys(themes) as Theme[]).map((themeKey) => {
                  const theme = themes[themeKey];
                  const isActive = currentTheme === themeKey;

                  return (
                    <motion.button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors text-left
                        ${isActive ? "bg-white/10" : "hover:bg-white/5"}
                      `}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      {/* Color Preview */}
                      <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${theme.accent} flex items-center justify-center text-lg`}>
                        {theme.icon}
                      </div>

                      {/* Theme Name */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {theme.name}
                        </p>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTheme"
                          className="w-2 h-2 rounded-full bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to get current theme config
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      return saved && themes[saved] ? saved : "purple";
    }
    return "purple";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem("theme") as Theme;
      if (newTheme && themes[newTheme]) {
        setTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return themes[theme];
}

export { themes };
