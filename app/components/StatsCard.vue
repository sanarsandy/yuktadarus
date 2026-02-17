<template>
  <div class="card-neu-sm flex flex-col items-center gap-2 py-5 transition-all duration-300 hover:scale-[1.02]" :id="`stat-${label.toLowerCase().replace(/\s/g, '-')}`">
    <div class="text-emerald-500">
      <slot name="icon">
        <span class="text-2xl">{{ icon }}</span>
      </slot>
    </div>
    <span class="text-3xl font-bold text-gradient-emerald">{{ displayValue }}</span>
    <span class="text-xs text-cream-400 font-medium tracking-wide uppercase">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string
  value: number | string
  label: string
  suffix?: string
}>()

const displayValue = computed(() => {
  return props.suffix ? `${props.value}${props.suffix}` : String(props.value)
})
</script>
