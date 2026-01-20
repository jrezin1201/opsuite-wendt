"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 min-h-screen p-4">
      <nav className="space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-purple-500/20 text-white border border-purple-400/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Optional: Add footer section */}
      <div className="mt-8 pt-4 border-t border-white/10">
        <div className="text-xs text-white/40 px-4">
          <p>Dashboard Navigation</p>
        </div>
      </div>
    </aside>
  );
}
