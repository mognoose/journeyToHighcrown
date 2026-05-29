// Persistence service abstraction.
// Two implementations are provided:
//  - `localStepService`  → browser localStorage (offline / dev fallback)
//  - `firestoreStepService` → Firebase Firestore (shared across devices)
// The exported `stepService` is selected via the VITE_STEP_BACKEND env var
// ("firebase" by default, "local" to force localStorage).

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

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

const COLLECTION = 'stepEntries';

export const firestoreStepService: StepService = {
  async load() {
    const db = getDb();
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as {
        contributor?: string;
        steps?: number;
        createdAt?: Timestamp | null;
      };
      return {
        id: d.id,
        contributor: data.contributor ?? 'Anonymous',
        steps: Number(data.steps ?? 0),
        // `serverTimestamp()` is null for an instant after write; fall back to now.
        createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
      } satisfies StepEntry;
    });
  },
  async add({ contributor, steps }) {
    const db = getDb();
    const payload = {
      contributor: contributor.trim() || 'Anonymous',
      steps: Math.max(0, Math.floor(steps)),
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, COLLECTION), payload);
    return {
      id: ref.id,
      contributor: payload.contributor,
      steps: payload.steps,
      createdAt: Date.now(),
    };
  },
  async remove(id) {
    const db = getDb();
    await deleteDoc(doc(db, COLLECTION, id));
  },
  async clear() {
    const db = getDb();
    const snap = await getDocs(collection(db, COLLECTION));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  },
};

// Single export point so callers don't care about the implementation.
const backend = (import.meta.env.VITE_STEP_BACKEND ?? 'firebase').toLowerCase();
export const stepService: StepService =
  backend === 'local' ? localStepService : firestoreStepService;
