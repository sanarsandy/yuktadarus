<template>
  <div class="card-neu text-center" id="daily-verse-card">
    <p class="text-arabic text-emerald-800 mb-4 leading-relaxed" dir="rtl">
      {{ verse.arabic }}
    </p>
    <p class="text-cream-400 italic text-sm mb-2">
      "{{ verse.translation }}"
    </p>
    <p class="text-xs text-cream-300 font-medium">
      {{ verse.reference }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  verse: {
    arabic: string
    translation: string
    reference: string
  }
}>()
</script>
