<template>
  <div class="card-neu-sm flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1">
    <div class="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center flex-shrink-0 shadow-neu-inset text-emerald-600">
      <slot name="icon">
        <span class="text-xl">{{ icon }}</span>
      </slot>
    </div>
    <div>
      <h4 class="font-bold text-emerald-800 text-sm mb-1">{{ title }}</h4>
      <p class="text-xs text-cream-400 leading-relaxed font-medium">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description: string
}>()
</script>
