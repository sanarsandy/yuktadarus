<template>
  <div
    class="card-neu-sm flex flex-col items-center justify-center p-4 text-center transition-all duration-300"
    :class="earned ? 'opacity-100' : 'opacity-40'"
    :id="`badge-${badge.id}`"
  >
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
      :class="earned ? 'bg-emerald-50 text-emerald-600' : 'bg-cream-200 text-cream-400'"
    >
      <BadgeIcon v-if="earned" :name="badge.icon" :size="22" />
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
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
import BadgeIcon from '~/components/BadgeIcon.vue'

defineProps<{
  badge: Badge
  earned: boolean
}>()
</script>
