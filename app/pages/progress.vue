<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-4 space-y-5">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-3xl font-extrabold text-emerald-800">Progress</h1>
      <p class="text-cream-400 text-sm mt-1">Your Ramadan Quran journey</p>
    </div>

    <!-- 30-Day Calendar -->
    <div class="animate-fade-up" style="animation-delay: 0.1s">
      <JuzCalendarGrid @select="onJuzSelect" />
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-3 animate-fade-up" style="animation-delay: 0.2s">
      <StatsCard :value="tilawah.currentStreak" label="Streak">
        <template #icon><IconFlame class="w-5 h-5" /></template>
      </StatsCard>
      <StatsCard :value="tilawah.totalJuzDone" label="Juz Done">
        <template #icon><IconBook class="w-5 h-5" /></template>
      </StatsCard>
      <StatsCard :value="tilawah.completionPercentage" label="Complete" suffix="%">
        <template #icon><IconChart class="w-5 h-5" /></template>
      </StatsCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTilawahStore } from '~/stores/tilawah'
import IconFlame from '~/components/IconFlame.vue'
import IconBook from '~/components/IconBook.vue'
import IconChart from '~/components/IconChart.vue'

const tilawah = useTilawahStore()

function onJuzSelect(juz: number) {
  // Optional: could show juz details or mark complete
  console.log(`Selected Juz ${juz}`)
}
</script>
