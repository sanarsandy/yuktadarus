<template>
  <div class="card-neu" id="juz-calendar-grid">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-emerald-800">30-Day Calendar</h3>
      <span class="text-xs font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
        {{ completedCount }}/30
      </span>
    </div>

    <div class="grid grid-cols-6 gap-3">
      <button
        v-for="juz in 30"
        :key="juz"
        :id="`juz-cell-${juz}`"
        class="aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 relative"
        :class="getJuzClass(juz - 1)"
        @click="$emit('select', juz)"
      >
        <!-- Checkmark for completed -->
        <span v-if="tilawah.completedJuz[juz - 1]" class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span class="text-[10px] leading-none">{{ juz }}</span>
        </span>
        <span v-else>{{ juz }}</span>

        <!-- Glow pulse for today -->
        <span
          v-if="tilawah.getJuzStatus(juz - 1) === 'today'"
          class="absolute inset-0 rounded-xl border-2 border-gold-400 animate-pulse-soft"
        ></span>
      </button>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-5 mt-5">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
        <span class="text-xs text-cream-400">Done</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full border-2 border-gold-400 bg-gold-50 animate-pulse-soft"></div>
        <span class="text-xs text-cream-400">Today</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-cream-300"></div>
        <span class="text-xs text-cream-400">Upcoming</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTilawahStore } from '~/stores/tilawah'

defineEmits<{
  select: [juz: number]
}>()

const tilawah = useTilawahStore()

const completedCount = computed(() => tilawah.totalJuzDone)

function getJuzClass(index: number): string {
  const status = tilawah.getJuzStatus(index)
  switch (status) {
    case 'done': {
      // Intensity based on how recently completed
      const dateStr = tilawah.completionDates[index]
      if (dateStr) {
        const daysAgo = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
        if (daysAgo <= 1) return 'bg-emerald-400 text-white shadow-md shadow-emerald-200 scale-[1.02]'
        if (daysAgo <= 3) return 'bg-emerald-500 text-white shadow-md'
        return 'bg-emerald-600 text-white/90 shadow-sm'
      }
      return 'bg-emerald-500 text-white shadow-md'
    }
    case 'today':
      return 'card-neu-sm border-2 border-gold-400 text-emerald-700 bg-gold-50'
    default:
      return 'card-neu-sm text-cream-400'
  }
}
</script>
