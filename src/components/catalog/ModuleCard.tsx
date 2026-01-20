/**
 * ModuleCard Component
 *
 * Displays a single module with icon, name, description, and metadata
 */

import Link from "next/link";
import { ModuleMetadata } from "@/config/registry";

interface ModuleCardProps {
  module: ModuleMetadata;
  isActive: boolean;
}

export function ModuleCard({ module, isActive }: ModuleCardProps) {
  return (
    <Link
      href={module.route}
      className={`
        block p-4 rounded-lg border transition-all duration-200
        ${
          isActive
            ? "border-purple-500/50 bg-purple-500/5 hover:border-purple-500 hover:bg-purple-500/10"
            : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60 hover:opacity-100"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{module.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {module.name}
            </h3>
            {module.isNew && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-500 text-white rounded">
                NEW
              </span>
            )}
            {module.isPro && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-500 text-white rounded">
                PRO
              </span>
            )}
            {!isActive && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-500 text-white rounded">
                OFF
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {module.description}
          </p>
          {module.tags && module.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {module.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
