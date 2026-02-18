<template>
  <div v-if="verse && verse.arabic" class="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-300" id="daily-verse-card"
    style="background: linear-gradient(135deg, rgba(45,90,67,0.04) 0%, rgba(196,169,98,0.06) 100%);
           box-shadow: 8px 8px 16px #E6E1D6, -8px -8px 16px #ffffff;
           border: 1px solid rgba(255,255,255,0.6);">

    <!-- Subtle corner accents -->
    <div class="absolute top-0 left-0 w-20 h-20 opacity-[0.04]" style="background: radial-gradient(circle at 0% 0%, #2D5A43 0%, transparent 70%);"></div>
    <div class="absolute bottom-0 right-0 w-20 h-20 opacity-[0.04]" style="background: radial-gradient(circle at 100% 100%, #2D5A43 0%, transparent 70%);"></div>

    <!-- Top ornament line -->
    <div class="flex items-center justify-center gap-3 mb-5">
      <div class="h-px w-10 bg-gradient-to-r from-transparent to-emerald-200"></div>
      <div class="w-1 h-1 rounded-full bg-emerald-300"></div>
      <div class="h-px w-10 bg-gradient-to-l from-transparent to-emerald-200"></div>
    </div>

    <!-- Arabic Text -->
    <p class="font-arabic text-emerald-800 mb-5 leading-[2.2] text-[1.65rem] tracking-wide" dir="rtl">
      {{ verse.arabic }}
    </p>

    <!-- Divider -->
    <div class="flex items-center justify-center gap-2 mb-4">
      <div class="h-px w-6 bg-emerald-200/60"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-emerald-300">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <div class="h-px w-6 bg-emerald-200/60"></div>
    </div>

    <!-- Translation -->
    <p class="text-emerald-700/70 italic text-sm mb-3 leading-relaxed px-3">
      "{{ verse.translation }}"
    </p>

    <!-- Reference -->
    <span class="inline-block text-[11px] text-emerald-500/80 font-medium tracking-wide">
      — {{ verse.reference }}
    </span>

    <!-- Bottom ornament line -->
    <div class="flex items-center justify-center gap-3 mt-5">
      <div class="h-px w-10 bg-gradient-to-r from-transparent to-emerald-200"></div>
      <div class="w-1 h-1 rounded-full bg-emerald-300"></div>
      <div class="h-px w-10 bg-gradient-to-l from-transparent to-emerald-200"></div>
    </div>
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
