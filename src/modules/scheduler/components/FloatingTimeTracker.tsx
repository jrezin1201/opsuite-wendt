"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Simple state-based time tracker (Zustand pattern without dependency)
export function FloatingTimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [entries, setEntries] = useState<
    Array<{ id: string; task: string; duration: number; date: Date }>
  >([]);

  // Timer effect
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!currentTask.trim()) {
      alert("Please enter a task name");
      return;
    }
    setIsTracking(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    if (elapsedTime > 0) {
      const entry = {
        id: crypto.randomUUID(),
        task: currentTask,
        duration: elapsedTime,
        date: new Date(),
      };
      setEntries((prev) => [entry, ...prev]);
    }
    setIsTracking(false);
    setCurrentTask("");
    setElapsedTime(0);
  };

  const getTotalToday = () => {
    const today = new Date().toDateString();
    return entries
      .filter((e) => e.date.toDateString() === today)
      .reduce((sum, e) => sum + e.duration, 0);
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isExpanded ? (
          // Compact View
          <div onClick={() => setIsExpanded(true)} className="cursor-pointer">
            <Card glow="purple">
              <div className="p-4 flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isTracking ? "bg-green-500 animate-pulse" : "bg-gray-500"
                  }`}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">
                    {formatTime(elapsedTime)}
                  </p>
                  <p className="text-white/60 text-xs">
                    {isTracking ? currentTask || "Tracking..." : "Time Tracker"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Expanded View
          <Card className="w-96">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Time Tracker</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/60 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Timer Display */}
              <div className="text-center mb-6">
                <p className="text-4xl font-mono font-bold text-white mb-2">
                  {formatTime(elapsedTime)}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                    isTracking
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isTracking ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs font-medium">
                    {isTracking ? "Tracking" : "Idle"}
                  </span>
                </div>
              </div>

              {/* Task Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  placeholder="What are you working on?"
                  disabled={isTracking}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2 mb-6">
                {!isTracking ? (
                  <Button onClick={handleStart} className="flex-1">
                    Start Timer
                  </Button>
                ) : (
                  <Button onClick={handleStop} variant="secondary" className="flex-1">
                    Stop & Save
                  </Button>
                )}
              </div>

              {/* Today Summary */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white/60">Today&apos;s Total</p>
                  <p className="text-sm font-semibold text-white">
                    {formatTime(getTotalToday())}
                  </p>
                </div>

                {/* Recent Entries */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {entries.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {entry.task}
                        </p>
                        <p className="text-xs text-white/40">
                          {entry.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm font-mono text-white/60 ml-2">
                        {formatTime(entry.duration)}
                      </p>
                    </div>
                  ))}
                  {entries.length === 0 && (
                    <p className="text-xs text-white/40 text-center py-4">
                      No entries yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
