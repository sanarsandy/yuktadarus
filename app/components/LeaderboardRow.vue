<template>
  <div class="flex items-center gap-3 py-3" :class="rank <= 3 ? '' : 'opacity-80'">
    <!-- Rank -->
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
      :class="rankClass"
    >
      {{ rank }}
    </div>

    <!-- Name -->
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-sm truncate" :class="rank === 1 ? 'text-emerald-800' : 'text-emerald-700'">
        {{ name }}
        <span v-if="isYou" class="text-[10px] text-emerald-400 font-normal ml-1">(You)</span>
      </p>
      <p v-if="role === 'admin'" class="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Admin</p>
    </div>

    <!-- Juz Count -->
    <div class="text-right shrink-0">
      <span class="text-sm font-bold" :class="rank === 1 ? 'text-emerald-600' : 'text-emerald-500'">{{ juzDone }}</span>
      <span class="text-xs text-cream-400">/30</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rank: number
  name: string
  juzDone: number
  role: string
  isYou: boolean
}>()

const rankClass = computed(() => {
  switch (props.rank) {
    case 1: return 'bg-emerald-500 text-white shadow-sm'
    case 2: return 'bg-emerald-100 text-emerald-600'
    case 3: return 'bg-cream-200 text-emerald-500'
    default: return 'bg-cream-100 text-cream-400'
  }
})
</script>
