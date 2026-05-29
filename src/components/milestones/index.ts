import type { Component } from 'vue';
import Start from './Start.vue';
import TheGuardian from './TheGuardian.vue';
import Riverwatch from './Riverwatch.vue';
import Thunderfalls from './Thunderfalls.vue';
import Silverhold from './Silverhold.vue';
import BridgeOfEchoes from './BridgeOfEchoes.vue';
import Highcrown from './Highcrown.vue';

// Map a milestone's `name` (from src/config.ts WAYPOINTS) to a Vue component.
// To add a new milestone description, create a .vue file in this folder and
// register it here under the exact milestone name.
export const milestoneComponents: Record<string, Component> = {
  'Start': Start,
  'The Guardian': TheGuardian,
  'Riverwatch': Riverwatch,
  'Thunderfalls': Thunderfalls,
  'Silverhold': Silverhold,
  'Bridge of Echoes': BridgeOfEchoes,
  'Highcrown': Highcrown,
};
