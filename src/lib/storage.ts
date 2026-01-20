import type { Workspace } from "@/lib/validators";
import { WorkspaceSchema } from "@/lib/validators";

const KEY = "saas_deal_calc_workspace_v1";

export function loadWorkspace(): Workspace {
  if (typeof window === "undefined") {
    return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });
  }
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });

  try {
    const parsed = JSON.parse(raw);
    return WorkspaceSchema.parse(parsed);
  } catch {
    return WorkspaceSchema.parse({ version: 1, selectedDealId: null, deals: [] });
  }
}

// Debounce helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

// Immediate save (not debounced)
function saveWorkspaceImmediate(ws: Workspace): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ws));
}

// Debounced save for performance during rapid updates (300ms delay)
const debouncedSave = debounce(saveWorkspaceImmediate, 300);

export function saveWorkspace(ws: Workspace): void {
  debouncedSave(ws);
}
