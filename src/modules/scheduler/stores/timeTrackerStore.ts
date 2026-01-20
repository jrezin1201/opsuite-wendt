/**
 * Time Tracker Store
 *
 * Persistent state management for the floating time tracker
 *
 * TO USE WITH ZUSTAND (RECOMMENDED):
 * 1. Install: npm install zustand
 * 2. Uncomment the Zustand implementation below
 * 3. Comment out the React hooks implementation
 */

export interface TimeEntry {
  id: string;
  task: string;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  project?: string;
}

export interface TimeTrackerState {
  isTracking: boolean;
  currentTask: string;
  startTime: number | null;
  elapsedTime: number;
  entries: TimeEntry[];

  // Actions
  startTimer: (task: string, project?: string) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateElapsed: () => void;
  deleteEntry: (id: string) => void;
}

// ZUSTAND IMPLEMENTATION (Uncomment when zustand is installed)
/*
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTimeTracker = create<TimeTrackerState>()(
  persist(
    (set, get) => ({
      isTracking: false,
      currentTask: "",
      startTime: null,
      elapsedTime: 0,
      entries: [],

      startTimer: (task: string, project?: string) => {
        const now = Date.now();
        set({
          isTracking: true,
          currentTask: task,
          startTime: now,
          elapsedTime: 0,
        });
      },

      stopTimer: () => {
        const state = get();
        if (!state.isTracking || !state.startTime) return;

        const endTime = Date.now();
        const duration = Math.floor((endTime - state.startTime) / 1000);

        const entry: TimeEntry = {
          id: crypto.randomUUID(),
          task: state.currentTask,
          startTime: state.startTime,
          endTime,
          duration,
        };

        set({
          isTracking: false,
          currentTask: "",
          startTime: null,
          elapsedTime: 0,
          entries: [entry, ...state.entries],
        });
      },

      resetTimer: () => {
        set({
          isTracking: false,
          currentTask: "",
          startTime: null,
          elapsedTime: 0,
        });
      },

      updateElapsed: () => {
        const state = get();
        if (!state.isTracking || !state.startTime) return;

        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        set({ elapsedTime: elapsed });
      },

      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
    }),
    {
      name: "time-tracker-storage",
    }
  )
);
*/
