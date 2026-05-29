import { reactive, computed } from 'vue';
import { stepService, type StepEntry } from '../services/stepService';
import { STEPS_PER_UNIT, TOTAL_STEPS, WAYPOINTS, type Waypoint } from '../config';

interface State {
  entries: StepEntry[];
  loading: boolean;
  error: string | null;
}

const state = reactive<State>({
  entries: [],
  loading: false,
  error: null,
});

async function init() {
  state.loading = true;
  state.error = null;
  try {
    state.entries = await stepService.load();
  } catch (e) {
    state.error = e instanceof Error ? e.message : String(e);
  } finally {
    state.loading = false;
  }
}

async function addSteps(contributor: string, steps: number) {
  const entry = await stepService.add({ contributor, steps });
  state.entries = [entry, ...state.entries];
}

async function removeEntry(id: string) {
  await stepService.remove(id);
  state.entries = state.entries.filter((e) => e.id !== id);
}

async function clearAll() {
  await stepService.clear();
  state.entries = [];
}

const totalSteps = computed(() =>
  state.entries.reduce((sum, e) => sum + e.steps, 0)
);

const totalUnits = computed(() => totalSteps.value / STEPS_PER_UNIT);

const progress = computed(() =>
  Math.min(1, totalSteps.value / TOTAL_STEPS)
);

// Compute current position along the polyline of WAYPOINTS.
// Walks waypoint-to-waypoint by segment length so the token moves at
// constant speed regardless of segment spacing.
const tokenPosition = computed<Waypoint>(() => {
  if (WAYPOINTS.length === 0) return { name: '', x: 0, y: 0, milestone: false };
  if (WAYPOINTS.length === 1 || progress.value <= 0) return WAYPOINTS[0];
  if (progress.value >= 1) return WAYPOINTS[WAYPOINTS.length - 1];

  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segLens.push(d);
    total += d;
  }

  let target = progress.value * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      const t = segLens[i] === 0 ? 0 : target / segLens[i];
      const a = WAYPOINTS[i];
      const b = WAYPOINTS[i + 1];
      return {
        name: `${a.name} → ${b.name}`,
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        milestone: false,
      };
    }
    target -= segLens[i];
  }
  return WAYPOINTS[WAYPOINTS.length - 1];
});

const nextWaypoint = computed<Waypoint | null>(() => {
  if (progress.value >= 1) return null;
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segLens.push(d);
    total += d;
  }
  let target = progress.value * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      // Return the next *milestone* waypoint at or after index i + 1.
      for (let j = i + 1; j < WAYPOINTS.length; j++) {
        if (WAYPOINTS[j].milestone) return WAYPOINTS[j];
      }
      return null;
    }
    target -= segLens[i];
  }
  return WAYPOINTS[WAYPOINTS.length - 1].milestone
    ? WAYPOINTS[WAYPOINTS.length - 1]
    : null;
});

export function useJourneyStore() {
  return {
    state,
    totalSteps,
    totalUnits,
    progress,
    tokenPosition,
    nextWaypoint,
    init,
    addSteps,
    removeEntry,
    clearAll,
  };
}
