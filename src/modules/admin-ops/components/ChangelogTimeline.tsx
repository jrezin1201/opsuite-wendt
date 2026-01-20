"use client";

import { Card } from "@/components/ui/Card";

export interface ChangelogEntry {
  id: string;
  version: string;
  date: Date;
  title: string;
  changes: {
    type: "feature" | "improvement" | "bugfix" | "breaking";
    description: string;
  }[];
}

interface ChangelogTimelineProps {
  entries: ChangelogEntry[];
}

export function ChangelogTimeline({ entries }: ChangelogTimelineProps) {
  const getChangeTypeIcon = (
    type: "feature" | "improvement" | "bugfix" | "breaking"
  ) => {
    switch (type) {
      case "feature":
        return (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold">NEW</span>
          </div>
        );
      case "improvement":
        return (
          <div className="flex items-center gap-2 text-blue-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="text-xs font-semibold">IMPROVED</span>
          </div>
        );
      case "bugfix":
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
            </svg>
            <span className="text-xs font-semibold">FIXED</span>
          </div>
        );
      case "breaking":
        return (
          <div className="flex items-center gap-2 text-red-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold">BREAKING</span>
          </div>
        );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Changelog</h3>
          <p className="text-sm text-white/60">
            Product updates and improvements
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

          {/* Entries */}
          <div className="space-y-8">
            {entries.map((entry) => (
              <div key={entry.id} className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center border-4 border-black">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm font-bold">
                        v{entry.version}
                      </span>
                      <h4 className="text-lg font-semibold text-white">
                        {entry.title}
                      </h4>
                    </div>
                    <time className="text-sm text-white/60">
                      {formatDate(entry.date)}
                    </time>
                  </div>

                  {/* Changes */}
                  <div className="space-y-3">
                    {entry.changes.map((change, changeIndex) => (
                      <div
                        key={changeIndex}
                        className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getChangeTypeIcon(change.type)}
                        </div>
                        <p className="text-sm text-white/80 flex-1">
                          {change.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No changelog entries yet.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
