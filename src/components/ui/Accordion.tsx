"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpen);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const isOpen = prev.includes(index);

      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== index) : [...prev, index];
      } else {
        return isOpen ? [] : [index];
      }
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <motion.button
              type="button"
              onClick={() => toggleItem(index)}
              className="
                w-full px-4 py-3 flex items-center justify-between
                text-left text-white hover:bg-white/5 transition-colors
              "
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-purple-400">{item.icon}</span>
                )}
                <span className="font-medium">{item.title}</span>
              </div>

              {/* Chevron */}
              <motion.svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-white/80 text-sm border-t border-white/10">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
