// Persistence service abstraction.
// Today: localStorage. Tomorrow: swap implementation for Firestore / your API
// without touching the rest of the app.

export interface StepEntry {
  id: string;
  contributor: string;
  steps: number;
  createdAt: number; // epoch ms
}

export interface StepService {
  load(): Promise<StepEntry[]>;
  add(entry: Omit<StepEntry, 'id' | 'createdAt'>): Promise<StepEntry>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = 'journey-to-highcrown:entries:v1';

function readAll(): StepEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: StepEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const localStepService: StepService = {
  async load() {
    return readAll().sort((a, b) => b.createdAt - a.createdAt);
  },
  async add({ contributor, steps }) {
    const entry: StepEntry = {
      id: uid(),
      contributor: contributor.trim() || 'Anonymous',
      steps: Math.max(0, Math.floor(steps)),
      createdAt: Date.now(),
    };
    const all = readAll();
    all.push(entry);
    writeAll(all);
    return entry;
  },
  async remove(id) {
    writeAll(readAll().filter((e) => e.id !== id));
  },
  async clear() {
    writeAll([]);
  },
};

// Single export point so callers don't care about the implementation.
export const stepService: StepService = localStepService;
