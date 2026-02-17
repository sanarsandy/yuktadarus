<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    :stroke="active ? '#2D5A43' : 'currentColor'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    class="transition-colors duration-300">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
</template>
<script setup lang="ts">
defineProps<{ active?: boolean }>()
</script>
