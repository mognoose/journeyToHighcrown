<script setup lang="ts">
import { computed } from 'vue';
import { useJourneyStore } from '../stores/journey';
import { STEPS_PER_UNIT, TOTAL_STEPS, TOTAL_UNITS } from '../config';

const { totalSteps, totalUnits, progress, nextWaypoint, contributorCount, topContributor } = useJourneyStore();

const remaining = computed(() => Math.max(0, TOTAL_STEPS - totalSteps.value));
</script>

<template>
  <section class="stats">
    <div class="stat">
      <span class="label">Total steps</span>
      <span class="value">{{ totalSteps.toLocaleString() }}</span>
    </div>
    <div class="stat">
      <span class="label">Units travelled</span>
      <span class="value">
        {{ totalUnits.toFixed(2) }} / {{ TOTAL_UNITS }}
      </span>
    </div>
    <div class="stat">
      <span class="label">Progress</span>
      <span class="value">{{ (progress * 100).toFixed(1) }}%</span>
    </div>
    <div class="stat">
      <span class="label">Steps to go</span>
      <span class="value">{{ remaining.toLocaleString() }}</span>
    </div>
    <div class="stat">
      <span class="label">Individual contributors</span>
      <span class="value">{{ contributorCount }}</span>
    </div>
    <div class="stat">
      <span class="label">Top contributor</span>
      <span class="value">
        <template v-if="topContributor">
          {{ topContributor.name }} ({{ topContributor.steps.toLocaleString() }})
        </template>
        <template v-else>—</template>
      </span>
    </div>
    <div class="stat">
      <span class="label">Next waypoint</span>
      <span class="value">{{ nextWaypoint?.name ?? 'Arrived!' }}</span>
    </div>

    <div class="bar-wrap">
      <div class="bar">
        <div class="bar-fill" :style="{ width: `${progress * 100}%` }" />
      </div>
      <small>{{ STEPS_PER_UNIT.toLocaleString() }} steps = 1 unit</small>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px 14px;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.value {
  font-size: 18px;
  font-weight: 600;
  color: #ffd76b;
}
.bar-wrap {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bar {
  height: 10px;
  background: #0f0f0f;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd76b, #ff8a3d);
  transition: width 600ms ease;
}
small {
  color: #888;
  font-size: 11px;
}
</style>
