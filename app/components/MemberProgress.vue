<template>
  <div class="flex items-center gap-3 py-2.5">
    <!-- Avatar Initial -->
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
      :class="member.total_juz_done && member.total_juz_done >= 30
        ? 'bg-emerald-500 text-white'
        : 'bg-cream-200 text-emerald-600'"
    >
      {{ initial }}
    </div>

    <!-- Name + Progress -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-emerald-800 truncate">
        {{ member.user?.name || 'Unknown' }}
        <span v-if="member.role === 'admin'" class="text-[9px] text-emerald-400 ml-1 font-normal">Admin</span>
      </p>
      <!-- Progress bar -->
      <div class="flex items-center gap-2 mt-1">
        <div class="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${progressPct}%` }"
          ></div>
        </div>
        <span class="text-[10px] text-cream-400 font-semibold shrink-0 w-8 text-right">{{ member.total_juz_done || 0 }}/30</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CircleMember } from '~/stores/circle'

const props = defineProps<{
  member: CircleMember
}>()

const initial = computed(() => {
  const name = props.member.user?.name || '?'
  return name.charAt(0).toUpperCase()
})

const progressPct = computed(() => {
  const done = props.member.total_juz_done || 0
  return Math.round((done / 30) * 100)
})
</script>
