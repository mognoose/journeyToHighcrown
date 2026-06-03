<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useJourneyStore } from '../stores/journey';

const { state, removeEntry, clearAll } = useJourneyStore();

const DELETE_WINDOW_MS = 10 * 60 * 1000;

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('fi-FI', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function canDelete(createdAt: number): boolean {
  return now.value - createdAt < DELETE_WINDOW_MS;
}

async function confirmClear() {
  if (confirm('Clear all step entries? This cannot be undone.')) {
    await clearAll();
  }
}
</script>

<template>
  <section class="entries">
    <header>
      <h3>Contributions</h3>
      <button
        v-if="state.entries.length"
        class="clear"
        type="button"
        @click="confirmClear"
      >
        Clear all
      </button>
    </header>
    <p v-if="!state.entries.length" class="empty">
      No steps yet. Be the first to contribute.
    </p>
    <ul v-else>
      <li v-for="entry in state.entries" :key="entry.id">
        <div class="meta">
          <strong>{{ entry.contributor }}</strong>
          <span>{{ formatDate(entry.createdAt) }}</span>
        </div>
        <div class="value">
          {{ entry.steps.toLocaleString() }} steps
        </div>
        <button
          v-if="canDelete(entry.createdAt)"
          class="remove"
          type="button"
          @click="removeEntry(entry.id)"
          aria-label="Remove entry"
        >
          ×
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.entries {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px 14px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
h3 {
  margin: 0;
  font-size: 16px;
  color: #ffd76b;
}
.clear {
  display: none;
  background: transparent;
  color: #ff8a8a;
  border: 1px solid #553;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
}
.empty {
  color: #888;
  font-size: 14px;
  margin: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 320px;
  overflow-y: auto;
}
li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  background: #0f0f0f;
  border: 1px solid #262626;
  border-radius: 6px;
  padding: 8px 10px;
}
.meta {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.meta span {
  color: #888;
  font-size: 11px;
}
.value {
  font-weight: 600;
  color: #ffd76b;
}
.remove {
  background: transparent;
  color: #888;
  border: 0;
  font-size: 18px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}
.remove:hover {
  color: #fff;
  background: #2a2a2a;
}
</style>
