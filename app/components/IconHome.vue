<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    :stroke="active ? '#2D5A43' : 'currentColor'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    class="transition-colors duration-300">
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M15 21v-8a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v8" />
  </svg>
</template>
<script setup lang="ts">
defineProps<{ active?: boolean }>()
</script>
