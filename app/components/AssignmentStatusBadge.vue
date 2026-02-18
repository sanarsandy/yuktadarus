<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
    :class="statusClass"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'in_progress' | 'completed'
}>()

const statusClass = computed(() => {
  switch (props.status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'in_progress': return 'bg-amber-100 text-amber-700'
    default: return 'bg-cream-200 text-cream-400'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'completed': return 'bg-emerald-500'
    case 'in_progress': return 'bg-amber-500 animate-pulse'
    default: return 'bg-cream-300'
  }
})

const statusLabel = computed(() => {
  switch (props.status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Dibaca'
    default: return 'Belum'
  }
})
</script>
