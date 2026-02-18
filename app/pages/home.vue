<template>
  <div class="max-w-md mx-auto px-5 pt-5 pb-24 space-y-4">
    <!-- Confetti burst when completing -->
    <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div v-for="i in 40" :key="i"
        class="absolute"
        :style="{
          left: `${40 + Math.random() * 20}%`,
          top: '40%',
          width: `${5 + Math.random() * 7}px`,
          height: `${5 + Math.random() * 7}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          backgroundColor: confettiColors[i % confettiColors.length],
          animation: `confettiBurst ${1 + Math.random() * 1.5}s ease-out forwards`,
          animationDelay: `${Math.random() * 0.3}s`,
          '--tx': `${(Math.random() - 0.5) * 400}px`,
          '--ty': `${-200 - Math.random() * 300}px`,
        }"
      ></div>
    </div>

    <!-- ═══════════ HEADER ═══════════ -->
    <div class="flex items-center justify-between animate-fade-down">
      <div>
        <h1 class="text-lg font-bold text-emerald-800 leading-snug">
          Ahlan, <span class="text-emerald-600">{{ userStore.name || 'Sahabat' }}</span>
        </h1>
        <p class="text-[10px] text-cream-400 mt-0.5">{{ tilawah.goalDescription }}</p>
      </div>
      <button @click="handleLogout"
        class="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-cream-400 hover:text-red-400 hover:bg-red-50 transition-all"
        title="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>

    <!-- ═══════════ DATE + PRAYER BANNER ═══════════ -->
    <div class="rounded-2xl bg-emerald-700 p-4 animate-fade-up" id="prayer-banner">
      <!-- Date + Clock -->
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-[11px] text-emerald-200">{{ prayer.gregorianFormatted || '...' }}</p>
          <p class="text-sm font-semibold text-white">{{ prayer.hijriDate || '...' }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-extrabold text-white tabular-nums leading-none">{{ currentTime }}</p>
          <p class="text-[8px] text-emerald-300 uppercase tracking-[0.2em] mt-0.5">WIB</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-emerald-600 mb-3"></div>

      <!-- Prayer times -->
      <div class="flex items-center justify-between">
        <div class="text-center flex-1">
          <p class="text-[9px] text-emerald-300 uppercase tracking-wider mb-0.5">Imsak</p>
          <p class="text-sm font-bold text-white tabular-nums">{{ prayer.imsak }}</p>
        </div>
        <div class="w-px h-6 bg-emerald-600"></div>
        <div class="text-center flex-1">
          <p class="text-[9px] text-emerald-300 uppercase tracking-wider mb-0.5">Subuh</p>
          <p class="text-sm font-bold text-white tabular-nums">{{ prayer.subuh }}</p>
        </div>
        <div class="w-px h-6 bg-emerald-600"></div>
        <div class="text-center flex-1">
          <p class="text-[9px] text-emerald-300 uppercase tracking-wider mb-0.5">Maghrib</p>
          <p class="text-sm font-bold text-white tabular-nums">{{ prayer.maghrib }}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════ CONTINUE READING ═══════════ -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.04s" id="continue-reading-card">
      <!-- Last read position -->
      <div v-if="tilawah.lastRead" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold bg-emerald-100 text-emerald-700">
            {{ tilawah.lastRead.juz }}
          </div>
          <div>
            <p class="text-sm font-bold text-emerald-800">Juz {{ tilawah.lastRead.juz }}</p>
            <p class="text-[10px] text-cream-400">
              {{ tilawah.lastRead.surah }} · Ayah {{ tilawah.lastRead.ayah }}
            </p>
          </div>
        </div>
        <NuxtLink
          :to="`/read/${tilawah.lastRead.juz}`"
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Lanjut
        </NuxtLink>
      </div>

      <!-- No reading history -->
      <div v-else class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold bg-emerald-100 text-emerald-700">
            1
          </div>
          <div>
            <p class="text-sm font-bold text-emerald-800">Mulai Membaca</p>
            <p class="text-[10px] text-cream-400">Juz 1 · Al-Fatihah</p>
          </div>
        </div>
        <NuxtLink
          to="/read/1"
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Mulai
        </NuxtLink>
      </div>

      <!-- Today's target -->
      <div v-if="tilawah.goal.type !== 'free'" class="flex items-center justify-between mt-3 pt-3 border-t border-cream-100">
        <span class="text-[11px] text-cream-400">
          Target: <strong class="text-emerald-700">{{ dailyTargetLabel }}</strong>
        </span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
          :class="isCompletedToday ? 'bg-emerald-100 text-emerald-600' : 'bg-cream-100 text-cream-400'">
          {{ isCompletedToday ? '✓ Tercapai' : 'Belum' }}
        </span>
      </div>

      <!-- Mark complete -->
      <button v-if="tilawah.goal.type !== 'free' && !isCompletedToday"
        @click="markComplete"
        class="w-full mt-3 text-xs flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cream-100 text-emerald-700 hover:bg-cream-200 transition-all font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        Tandai Selesai
      </button>
    </div>

    <!-- ═══════════ AYAT HARI INI ═══════════ -->
    <div class="animate-fade-up" style="animation-delay: 0.08s">
      <DailyVerseCard v-if="currentVerse" :verse="currentVerse" />
    </div>

    <!-- ═══════════ PROGRESS ═══════════ -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.12s" id="progress-card">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-emerald-800">Progress Khatam</h3>
        <span class="text-[11px] font-bold text-emerald-600">{{ tilawah.totalJuzDone }}/30</span>
      </div>
      
      <div class="h-2 bg-cream-200 rounded-full overflow-hidden mb-4">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
          :style="{ width: `${tilawah.completionPercentage}%` }">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="bg-cream-100 rounded-xl p-2.5 text-center">
          <div class="flex items-center justify-center gap-1">
            <IconFlame class="w-3.5 h-3.5 text-amber-500" />
            <span class="text-base font-extrabold text-emerald-700">{{ tilawah.currentStreak }}</span>
          </div>
          <p class="text-[8px] font-semibold text-cream-400 uppercase mt-0.5">Streak</p>
        </div>
        <div class="bg-cream-100 rounded-xl p-2.5 text-center">
          <div class="flex items-center justify-center gap-1">
            <IconBook class="w-3.5 h-3.5 text-emerald-500" />
            <span class="text-base font-extrabold text-emerald-700">{{ tilawah.totalJuzDone }}</span>
          </div>
          <p class="text-[8px] font-semibold text-cream-400 uppercase mt-0.5">Juz</p>
        </div>
        <div class="bg-cream-100 rounded-xl p-2.5 text-center">
          <span class="text-base font-extrabold text-emerald-700">{{ Math.round(tilawah.completionPercentage) }}%</span>
          <p class="text-[8px] font-semibold text-cream-400 uppercase mt-0.5">Total</p>
        </div>
      </div>
    </div>

    <!-- ═══════════ PENCAPAIAN TERBARU ═══════════ -->
    <div v-if="latestBadge" class="card-neu animate-fade-up flex items-center gap-3" style="animation-delay: 0.16s" id="latest-badge-card">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0">
        <BadgeIcon :name="latestBadge.icon" :size="20" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Pencapaian</p>
        <h4 class="font-bold text-emerald-800 text-sm leading-tight">{{ latestBadge.name }}</h4>
      </div>
      <NuxtLink to="/profile" class="text-cream-300 hover:text-emerald-600 transition-colors shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </NuxtLink>
    </div>

    <!-- Badge Celebration Overlay -->
    <BadgeCelebration
      :badge="celebrationBadge"
      :visible="showCelebration"
      @dismiss="showCelebration = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useTilawahStore } from '~/stores/tilawah'
import { useUserStore } from '~/stores/user'
import { useBadgesStore } from '~/stores/badges'
import { useDailyVerse } from '~/composables/useDailyVerse'
import { usePrayerTimes } from '~/composables/usePrayerTimes'
import IconFlame from '~/components/IconFlame.vue'
import IconBook from '~/components/IconBook.vue'
import BadgeIcon from '~/components/BadgeIcon.vue'
import type { Badge } from '~/stores/badges'

const tilawah = useTilawahStore()
const userStore = useUserStore()
const badgesStore = useBadgesStore()
const router = useRouter()
const dailyVerse = useDailyVerse()
const prayer = usePrayerTimes()

// Live clock
const currentTime = ref('')
let clockInterval: ReturnType<typeof setInterval>

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
})

// Daily verse
const currentVerse = computed(() => {
  try {
    return dailyVerse.todayVerse.value || dailyVerse.getVerseForDay(1)
  } catch {
    return dailyVerse.getVerseForDay(1)
  }
})

const showConfetti = ref(false)
const showCelebration = ref(false)
const celebrationBadge = ref<Badge | null>(null)

const confettiColors = ['#2D5A43', '#478767', '#C4A962', '#E5D59B', '#75A58D', '#D8C069']

function handleLogout() {
  userStore.logout()
  router.push('/')
}

const isCompletedToday = computed(() => tilawah.isJuzCompletedToday)

const latestBadge = computed(() => {
  const earned = badgesStore.earnedBadges
  return earned.length > 0 ? earned[earned.length - 1] : null
})

const dailyTargetLabel = computed(() => {
  switch (tilawah.goal.type) {
    case 'khatam_30': return `Juz ${tilawah.currentJuzNumber}`
    case 'khatam_60': return `½ Juz ${tilawah.currentJuzNumber}`
    case 'ayat': return `${tilawah.goal.target} ayat`
    case 'custom': return `${tilawah.goal.target} juz`
    default: return ''
  }
})

async function markComplete() {
  const badgeCountBefore = badgesStore.earnedCount
  await tilawah.markJuzComplete(tilawah.currentJuzNumber)

  showConfetti.value = true
  setTimeout(() => { showConfetti.value = false }, 2500)
  nextTick(() => {
    const badgeCountAfter = badgesStore.earnedCount
    if (badgeCountAfter > badgeCountBefore) {
      const newBadges = badgesStore.earnedBadges
      celebrationBadge.value = newBadges[newBadges.length - 1]
      setTimeout(() => { showCelebration.value = true }, 800)
    }
  })
}
</script>

<style scoped>
@keyframes confettiBurst {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) rotate(720deg) scale(0.5);
    opacity: 0;
  }
}

.animate-fade-down {
  animation: fadeDown 0.6s ease-out;
}

@keyframes fadeDown {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
