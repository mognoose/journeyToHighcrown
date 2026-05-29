<script setup lang="ts">
import { ref } from 'vue';
import { useJourneyStore } from '../stores/journey';

const { addSteps } = useJourneyStore();

const contributor = ref('');
const steps = ref<number | null>(null);
const submitting = ref(false);
const error = ref<string | null>(null);

async function submit() {
  error.value = null;
  if (steps.value === null || isNaN(steps.value) || steps.value <= 0) {
    error.value = 'Enter a positive number of steps.';
    return;
  }
  submitting.value = true;
  try {
    await addSteps(contributor.value, steps.value);
    steps.value = null;
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="step-form" @submit.prevent="submit">
    <div class="row">
      <label>
        Name
        <input
          v-model="contributor"
          type="text"
          placeholder="Anonymous"
          maxlength="40"
        />
      </label>
      <label>
        Steps
        <input
          v-model.number="steps"
          type="number"
          min="1"
          step="1"
          placeholder="e.g. 4200"
          required
        />
      </label>
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Adding…' : 'Add steps' }}
      </button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<style scoped>
.step-form {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px 14px;
}
.row {
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #aaa;
  gap: 4px;
}
input {
  background: #0f0f0f;
  color: #f1f1f1;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  min-width: 160px;
}
button {
  background: #ffd76b;
  color: #1a1a1a;
  border: 0;
  border-radius: 6px;
  padding: 9px 16px;
  font-weight: 600;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #ff6b6b;
  margin: 8px 0 0;
  font-size: 13px;
}
</style>
