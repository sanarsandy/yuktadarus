<template>
  <div class="card-neu" id="juz-calendar-grid">
    <h3 class="text-lg font-bold text-emerald-800 mb-4">30-Day Calendar</h3>
    <div class="grid grid-cols-6 gap-3">
      <button
        v-for="juz in 30"
        :key="juz"
        :id="`juz-cell-${juz}`"
        class="aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300"
        :class="getJuzClass(juz - 1)"
        @click="$emit('select', juz)"
      >
        {{ juz }}
      </button>
    </div>
    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mt-5">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span class="text-xs text-cream-400">Done</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full border-2 border-gold-400 bg-transparent"></div>
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

function getJuzClass(index: number): string {
  const status = tilawah.getJuzStatus(index)
  switch (status) {
    case 'done':
      return 'bg-emerald-500 text-white shadow-md'
    case 'today':
      return 'card-neu-sm border-2 border-gold-400 text-emerald-700'
    default:
      return 'card-neu-sm text-cream-400'
  }
}
</script>
