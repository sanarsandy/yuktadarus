<template>
  <div
    class="card-neu p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
    :id="`circle-card-${circle.id}`"
    @click="$emit('select', circle)"
  >
    <!-- Avatar -->
    <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-emerald-800 text-sm truncate">{{ circle.name }}</h4>
      <p class="text-xs text-cream-400">{{ circle.members?.length || 0 }} anggota</p>
    </div>

    <!-- Chevron -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-cream-400 shrink-0">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Circle } from '~/stores/circle'

defineProps<{
  circle: Circle
}>()

defineEmits<{
  select: [circle: Circle]
}>()
</script>
