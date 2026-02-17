<template>
  <div
    class="card-neu-sm flex flex-col items-center justify-center p-4 text-center transition-all duration-300"
    :class="earned ? 'opacity-100' : 'opacity-50'"
    :id="`badge-${badge.id}`"
  >
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
      :class="earned ? 'bg-cream-200 shadow-neu-sm text-emerald-500' : 'bg-cream-200 text-cream-400'"
    >
      <slot name="icon">
        <span class="text-2xl">{{ badge.icon }}</span>
      </slot>
    </div>
    <h4 class="font-semibold text-sm" :class="earned ? 'text-emerald-700' : 'text-cream-400'">
      {{ badge.name }}
    </h4>
    <p class="text-xs mt-1" :class="earned ? 'text-emerald-400' : 'text-cream-300'">
      {{ earned ? 'Earned' : badge.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '~/stores/badges'

defineProps<{
  badge: Badge
  earned: boolean
}>()
</script>
