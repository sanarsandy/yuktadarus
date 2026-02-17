<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-4 space-y-5">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate-fade-down">
      <div>
        <h1 class="text-xl font-bold text-emerald-800">
          Ahlan wa Sahlan, <br />
          <span class="text-emerald-600">{{ userStore.name || 'Sahabat' }}</span>
        </h1>
      </div>
      <button 
        @click="handleLogout" 
        class="text-xs text-emerald-600 font-bold bg-cream-200 px-3 py-1.5 rounded-lg hover:bg-cream-300 transition-colors"
      >
        Logout
      </button>
    </div>

    <!-- Day Header Card -->
    <div class="card-neu text-center animate-fade-up" id="day-header-card">
      <p class="text-xs font-semibold text-cream-400 tracking-widest uppercase mb-1">
        Day {{ tilawah.dayOfRamadan }} of Ramadan
      </p>
      <h1 class="text-4xl font-extrabold text-emerald-800">
        Juz {{ tilawah.currentJuzNumber }}
      </h1>
    </div>

    <!-- Continue Reading Card -->
    <div v-if="tilawah.lastRead" class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-up">
        <div>
            <p class="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Continue Reading</p>
            <h3 class="font-bold text-emerald-900">{{ tilawah.lastRead.surah }}</h3>
            <p class="text-sm text-emerald-700">Ayah {{ tilawah.lastRead.ayah }} • Juz {{ tilawah.lastRead.juz }}</p>
        </div>
        <NuxtLink :to="`/read/${tilawah.lastRead.juz}`" class="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </NuxtLink>
    </div>

    <!-- Daily Verse -->
    <div class="animate-fade-up" style="animation-delay: 0.1s">
      <DailyVerseCard :verse="dailyVerse.getVerseForDay(tilawah.currentJuzNumber)" />
    </div>

    <!-- Daily Progress (Juz Tracking) -->
    <div class="card-neu animate-fade-up" id="daily-progress-card">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-bold text-emerald-800">Today's Goal: Juz {{ tilawah.currentJuzNumber }}</h3>
            <span class="text-xs font-semibold" :class="isCompletedToday ? 'text-emerald-600' : 'text-cream-400'">
                {{ isCompletedToday ? 'Completed' : 'In Progress' }}
            </span>
        </div>
        
        <!-- Last Read Info if In Progress -->
        <div v-if="!isCompletedToday && tilawah.lastRead && tilawah.lastRead.juz === tilawah.currentJuzNumber" class="text-xs text-emerald-600 mb-3 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
            <span class="font-bold">Last Read:</span> {{ tilawah.lastRead.surah }} : {{ tilawah.lastRead.ayah }}
        </div>

        <!-- Read Now Button -->
        <NuxtLink 
            v-if="!isCompletedToday"
            :to="`/read/${tilawah.currentJuzNumber}`" 
            class="block w-full text-center mb-3 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Mulai Baca Juz {{ tilawah.currentJuzNumber }}
        </NuxtLink>

        <button
            class="w-full text-sm flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-medium"
            :class="isCompletedToday ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-cream-200 text-emerald-800 hover:bg-cream-300'"
            :disabled="isCompletedToday"
            @click="markComplete"
        >
            <svg v-if="!isCompletedToday" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {{ isCompletedToday ? 'Juz Completed ✓' : 'Tandai Selesai' }}
        </button>
    </div>

    <!-- Overall Statistics (Khatam Tracker) -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.2s">
      <div class="flex justify-between text-xs text-cream-400 mb-2">
          <span>Khatam Progress</span>
          <span>{{ tilawah.totalJuzDone }}/30 Juz</span>
      </div>
      <div class="h-2 bg-cream-300 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${tilawah.completionPercentage}%` }"
          ></div>
      </div>
    </div>


    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-4 animate-fade-up" style="animation-delay: 0.3s">
      <StatsCard :value="tilawah.currentStreak" label="Day streak">
        <template #icon>
          <IconFlame class="w-6 h-6" />
        </template>
      </StatsCard>
      <StatsCard :value="`${tilawah.totalJuzDone}/30`" label="Juz completed">
        <template #icon>
          <IconBook class="w-6 h-6" />
        </template>
      </StatsCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTilawahStore } from '~/stores/tilawah'
import { useUserStore } from '~/stores/user'
import { useDailyVerse } from '~/composables/useDailyVerse'
import IconFlame from '~/components/IconFlame.vue'
import IconBook from '~/components/IconBook.vue'

const tilawah = useTilawahStore()
const userStore = useUserStore()
const router = useRouter()
const dailyVerse = useDailyVerse()

function handleLogout() {
  userStore.logout()
  router.push('/')
}

const isCompletedToday = computed(() => tilawah.isJuzCompletedToday)
const allComplete = computed(() => tilawah.totalJuzDone >= 30)

const buttonLabel = computed(() => {
  if (allComplete.value) return 'Khatam Complete! 🎉'
  if (isCompletedToday.value) return 'Completed Today ✓'
  return `Mark Juz ${tilawah.currentJuzNumber} Complete`
})

function markComplete() {
  tilawah.markJuzComplete(tilawah.currentJuzNumber)
}
</script>
