<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useJourneyStore } from '../stores/journey';
import { WAYPOINTS, type Waypoint } from '../config';
import mapImg from '../assets/images/JourneyToHighCrown.png';
import tokenImg from '../assets/images/HiQToken.png';
import adventurersImg from '../assets/images/HiQAdventurers.png';
import TheLore from './TheLore.vue';
import { milestoneComponents } from './milestones';
const { tokenPosition, progress } = useJourneyStore();

const milestones = computed(() => WAYPOINTS.filter((w) => w.milestone));

const selectedMilestoneComponent = computed(
  () => (selectedMilestone.value ? milestoneComponents[selectedMilestone.value.name] : null),
);

const pathD = computed(() => {
  if (WAYPOINTS.length < 2) return '';
  return WAYPOINTS.map((w, i) => `${i === 0 ? 'M' : 'L'} ${w.x} ${w.y}`).join(' ');
});

const tokenStyle = computed(() => ({
  left: `${tokenPosition.value.x}%`,
  top: `${tokenPosition.value.y}%`,
}));

const showAdventurers = ref(false);
const openAdventurers = () => { showAdventurers.value = true; };
const closeAdventurers = () => { showAdventurers.value = false; };

const showLore = ref(false);
const openLore = () => { showLore.value = true; };
const closeLore = () => { showLore.value = false; };

const selectedMilestone = ref<Waypoint | null>(null);
const openMilestone = (w: Waypoint) => { selectedMilestone.value = w; };
const closeMilestone = () => { selectedMilestone.value = null; };

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAdventurers();
    closeLore();
    closeMilestone();
  }
};
watch(showAdventurers, (open) => {
  if (open) window.addEventListener('keydown', onKeydown);
  else window.removeEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div class="map-wrap">
    <img :src="mapImg" alt="Journey to Highcrown map" class="map-img" />

    <!-- Path overlay drawn in the map's % coordinate space -->
    <svg class="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path :d="pathD" class="path-stroke" />
    </svg>

    <!-- Milestone buttons -->
    <button
      v-for="(w, i) in milestones"
      :key="w.name + i"
      type="button"
      class="milestone-btn"
      :style="{ left: w.x + '%', top: w.y + '%' }"
      :aria-label="`Open milestone: ${w.name}`"
      :title="w.name"
      @click="openMilestone(w)"
    />

    <!-- Token -->
    <button
      type="button"
      class="token-btn"
      :style="tokenStyle"
      aria-label="Show adventurers"
      @click="openAdventurers"
    >
      <img :src="tokenImg" alt="Adventurer token" class="token" />
    </button>

    <!-- Adventurers modal -->
    <div
      v-if="showAdventurers"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Adventurers"
      @click.self="closeAdventurers"
    >
      <div class="modal-content">
        <button
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="closeAdventurers"
        >×</button>
        <div class="modal-body">
          <img :src="adventurersImg" alt="Adventurers" class="modal-img" />
        </div>
      </div>
    </div>
    <div
      v-if="showLore"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Lore"
      @click.self="closeLore"
    >
      <div class="modal-content">
        <button
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="closeLore"
        >×</button>
        <div class="modal-body">
          <TheLore />
        </div>
      </div>
    </div>

    <div
      v-if="selectedMilestone"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="selectedMilestone.name"
      @click.self="closeMilestone"
    >
      <div class="modal-content">
        <button
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="closeMilestone"
        >×</button>
        <div class="modal-body">
          <h2 class="milestone-title">{{ selectedMilestone.name }}</h2>
          <component :is="selectedMilestoneComponent" v-if="selectedMilestoneComponent" />
          <p v-else class="milestone-empty">No tale has been written for this place yet.</p>
        </div>
      </div>
    </div>

    <!-- Progress label -->
    <div class="overlay-info progress">
      <strong>{{ Math.round(progress * 100) }}%</strong>
      <span>{{ tokenPosition.name }}</span>
    </div>
    <div class="overlay-info lore" @click="openLore">
      <span>Lore</span>
    </div>
  </div>
</template>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
}

.map-img {
  display: block;
  width: 100%;
  height: auto;
}

.path-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.path-stroke {
  fill: none;
  stroke: rgba(255, 200, 80, 0.85);
  stroke-width: 0.4;
  stroke-dasharray: 1.2 0.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.waypoint {
  fill: #ffd76b;
  stroke: #1a1a1a;
  stroke-width: 0.15;
}

.milestone-btn {
  position: absolute;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  background: #ffd76b;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.milestone-btn:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 10px rgba(255, 215, 107, 0.9);
}

.milestone-btn:focus-visible {
  outline: 2px solid #ffd76b;
  outline-offset: 3px;
}

.milestone-title {
  margin: 0 0 10px;
  color: #ffd76b;
}

.milestone-empty {
  color: #888;
  font-style: italic;
}

.token-btn {
  position: absolute;
  width: 200px;
  min-width: 36px;
  max-width: 102px;
  transform: translate(-50%, -75%);
  transition: left 600ms ease, top 600ms ease, transform 150ms ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6));
  border: 3px solid rgba(215, 178, 14, 0.9);
  box-shadow: 0 0 8px rgba(125, 115, 207, 0.7);
  border-radius: 50%;
  padding: 10px;
  background: transparent;
  cursor: pointer;
  display: block;
}

.token-btn:hover {
  transform: translate(-50%, -75%) scale(1.05);
}

.token-btn:focus-visible {
  outline: 2px solid #ffd76b;
  outline-offset: 2px;
}

.token {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
}

.modal-body {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
  border-radius: 8px;
}

.modal-img {
  display: block;
  max-width: 100%;
  max-height: calc(90vh - 20px);
  height: auto;
  width: auto;
  border-radius: 4px;
}

.modal-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #2a2a2a;
  background: #1a1a1a;
  color: #ffd76b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #2a2a2a;
}

.overlay-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffd76b;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  gap: 10px;
  align-items: center;

  &.lore {
    top: 10px;
    right: 10px;
    left: auto;
    bottom: auto;
    cursor: pointer;
  }
}
</style>
