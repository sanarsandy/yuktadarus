<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-4 space-y-5">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-3xl font-extrabold text-emerald-800">Progress</h1>
      <p class="text-cream-400 text-sm mt-1">Your Ramadan Quran journey</p>
    </div>

    <!-- Milestone Progress Bar -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.05s" id="milestone-bar">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-bold text-emerald-800">Khatam Milestones</h3>
        <span class="text-xs text-emerald-500 font-semibold">{{ tilawah.completionPercentage }}%</span>
      </div>
      <!-- Progress Track -->
      <div class="mb-2">
        <div class="h-3 bg-cream-300 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-gold-400 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${tilawah.completionPercentage}%` }"
          ></div>
        </div>
        <!-- Milestone Markers -->
        <div class="flex justify-between mt-3 px-1">
          <div
            v-for="m in milestones"
            :key="m.juz"
            class="flex flex-col items-center gap-1"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all duration-300"
              :class="tilawah.totalJuzDone >= m.juz
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm'
                : 'bg-cream-100 border-cream-300 text-cream-400'"
            >
              {{ m.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 30-Day Calendar -->
    <div class="animate-fade-up" style="animation-delay: 0.1s">
      <JuzCalendarGrid @select="onJuzSelect" />
    </div>

    <!-- Selected Juz Detail Panel -->
    <Transition name="slide-detail">
      <div v-if="selectedJuz" class="card-neu animate-fade-up border-2" 
        :class="isSelectedDone ? 'border-emerald-200' : 'border-cream-300'"
        id="juz-detail-panel">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-2xl font-extrabold text-emerald-800">Juz {{ selectedJuz }}</span>
              <span v-if="isSelectedDone" class="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                ✓ Done
              </span>
              <span v-else class="text-xs bg-cream-200 text-cream-400 px-2 py-0.5 rounded-full font-semibold">
                Pending
              </span>
            </div>
            <p v-if="selectedCompletionDate" class="text-xs text-emerald-500">
              Completed: {{ formatDate(selectedCompletionDate) }}
            </p>
          </div>
          <button @click="selectedJuz = null" class="text-cream-400 hover:text-emerald-600 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="flex gap-2 mt-4">
          <NuxtLink
            :to="`/read/${selectedJuz}`"
            class="flex-1 bg-emerald-600 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Baca
          </NuxtLink>
          <button
            @click="toggleSelectedJuz"
            class="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            :class="isSelectedDone
              ? 'bg-cream-200 text-cream-400 hover:bg-red-50 hover:text-red-400'
              : 'bg-gold-100 text-gold-600 hover:bg-gold-200'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            {{ isSelectedDone ? 'Batalkan' : 'Tandai Selesai' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-3 animate-fade-up" style="animation-delay: 0.2s">
      <StatsCard :value="tilawah.currentStreak" label="Streak">
        <template #icon><IconFlame class="w-5 h-5" /></template>
      </StatsCard>
      <StatsCard :value="tilawah.totalJuzDone" label="Juz Done">
        <template #icon><IconBook class="w-5 h-5" /></template>
      </StatsCard>
      <StatsCard :value="tilawah.completionPercentage" label="Complete" suffix="%">
        <template #icon><IconChart class="w-5 h-5" /></template>
      </StatsCard>
    </div>

    <!-- Weekly Summary -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.3s" id="weekly-summary">
      <h3 class="text-sm font-bold text-emerald-800 mb-3">Weekly Summary</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="card-neu-inset p-4 text-center">
          <p class="text-2xl font-extrabold text-emerald-600">{{ weeklySummary.thisWeek }}</p>
          <p class="text-xs text-cream-400 mt-1">This Week</p>
        </div>
        <div class="card-neu-inset p-4 text-center">
          <p class="text-2xl font-extrabold" :class="weeklySummary.thisWeek >= weeklySummary.lastWeek ? 'text-emerald-500' : 'text-gold-500'">
            {{ weeklySummary.lastWeek }}
          </p>
          <p class="text-xs text-cream-400 mt-1">Last Week</p>
        </div>
      </div>
      <div v-if="weeklySummary.thisWeek > weeklySummary.lastWeek" class="text-center mt-3">
        <span class="text-xs text-emerald-500 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
          🔥 +{{ weeklySummary.thisWeek - weeklySummary.lastWeek }} more than last week!
        </span>
      </div>
      <div v-else-if="weeklySummary.thisWeek === weeklySummary.lastWeek && weeklySummary.thisWeek > 0" class="text-center mt-3">
        <span class="text-xs text-gold-500 font-semibold bg-gold-50 px-3 py-1 rounded-full">
          ⚡ Same pace - keep it up!
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTilawahStore } from '~/stores/tilawah'
import IconFlame from '~/components/IconFlame.vue'
import IconBook from '~/components/IconBook.vue'
import IconChart from '~/components/IconChart.vue'

const tilawah = useTilawahStore()

const selectedJuz = ref<number | null>(null)

const milestones = [
  { juz: 5, label: '5' },
  { juz: 10, label: '10' },
  { juz: 15, label: '½' },
  { juz: 20, label: '20' },
  { juz: 25, label: '25' },
  { juz: 30, label: '30' },
]

const isSelectedDone = computed(() => {
  if (!selectedJuz.value) return false
  return tilawah.completedJuz[selectedJuz.value - 1]
})

const selectedCompletionDate = computed(() => {
  if (!selectedJuz.value) return null
  return tilawah.completionDates[selectedJuz.value - 1]
})

const weeklySummary = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon...

  // Start of this week (Monday)
  const startOfThisWeek = new Date(today)
  startOfThisWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  // Start of last week
  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

  let thisWeek = 0
  let lastWeek = 0

  tilawah.completionDates.forEach(d => {
    if (!d) return
    const date = new Date(d)
    date.setHours(0, 0, 0, 0)
    if (date >= startOfThisWeek) {
      thisWeek++
    } else if (date >= startOfLastWeek && date < startOfThisWeek) {
      lastWeek++
    }
  })

  return { thisWeek, lastWeek }
})

function onJuzSelect(juz: number) {
  selectedJuz.value = selectedJuz.value === juz ? null : juz
}

function toggleSelectedJuz() {
  if (selectedJuz.value) {
    tilawah.toggleJuz(selectedJuz.value)
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.slide-detail-enter-active {
  transition: all 0.3s ease-out;
}
.slide-detail-leave-active {
  transition: all 0.2s ease-in;
}
.slide-detail-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-detail-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
