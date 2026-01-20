"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: number;
  onChange?: (index: number) => void;
  variant?: "underline" | "pills";
}

export function Tabs({
  items,
  defaultTab = 0,
  onChange,
  variant = "underline",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div
        className={`
          flex gap-2
          ${
            variant === "underline"
              ? "border-b border-white/10"
              : "bg-white/5 p-1 rounded-lg"
          }
        `}
      >
        {items.map((item, index) => {
          const isActive = activeTab === index;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleTabChange(index)}
              className={`
                relative px-4 py-2 font-medium text-sm
                transition-colors flex items-center gap-2
                ${
                  variant === "underline"
                    ? isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/80"
                    : isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }
                ${variant === "pills" && isActive ? "rounded-lg" : ""}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              {item.icon && <span>{item.icon}</span>}

              {/* Label */}
              <span>{item.label}</span>

              {/* Badge */}
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-purple-500 text-white rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && variant === "underline" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Pills Background */}
              {isActive && variant === "pills" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {items[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
