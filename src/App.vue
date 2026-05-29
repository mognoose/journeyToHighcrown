<script setup lang="ts">
import { onMounted } from 'vue';
import JourneyMap from './components/JourneyMap.vue';
import JourneyStats from './components/JourneyStats.vue';
import StepForm from './components/StepForm.vue';
import EntriesList from './components/EntriesList.vue';
import { useJourneyStore } from './stores/journey';

const { init } = useJourneyStore();

onMounted(() => {
  init();
});
</script>

<template>
  <main class="app">
    <header class="app-header">
      <h1>Journey to Highcrown</h1>
      <p>Add your steps. Together we travel the road.</p>
    </header>

    <JourneyMap />

    <div class="grid">
      <div class="col">
        <JourneyStats />
        <StepForm />
      </div>
      <div class="col">
        <EntriesList />
      </div>
    </div>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Almendra&display=swap');

.app {
  font-family: 'Almendra', serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.app-header h1 {
  margin: 0;
  font-size: 28px;
  color: #ffd76b;
  letter-spacing: 0.02em;
}
.app-header p {
  margin: 4px 0 0;
  color: #aaa;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.milestone-content {
  color: rgb(177, 155, 95);
}
</style>
