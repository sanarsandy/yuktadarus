<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- Background ring -->
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <!-- Progress ring -->
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease-out' }"
      />
    </svg>
    <!-- Center text -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="font-extrabold text-emerald-800" :style="{ fontSize: `${size * 0.22}px` }">{{ percentage }}%</span>
      <span class="text-cream-400 font-medium" :style="{ fontSize: `${size * 0.1}px` }">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
}>(), {
  size: 120,
  strokeWidth: 8,
  color: '#10b981',
  bgColor: '#f0ede6',
  label: 'Selesai',
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - Math.min(props.percentage, 100) / 100))
</script>
