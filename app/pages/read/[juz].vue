<template>
  <div class="min-h-screen bg-cream-50 pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-md shadow-sm border-b border-cream-200 px-4 py-3 flex items-center justify-between">
      <button @click="router.back()" class="p-2 rounded-full hover:bg-cream-200 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-800">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="text-center">
        <h1 class="text-lg font-bold text-emerald-800">Juz {{ currentJuz }}</h1>
        <p class="text-xs text-emerald-600 font-medium" v-if="!quranStore.isLoading && quranStore.juzData.length > 0">
          {{ quranStore.juzData[0]?.surah.englishName }} - {{ quranStore.juzData[quranStore.juzData.length - 1]?.surah.englishName }}
        </p>
      </div>

      <div class="w-10"></div> <!-- Spacer for balance -->
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="quranStore.isLoading" class="flex flex-col items-center justify-center py-20 animate-pulse">
        <div class="w-16 h-16 rounded-full bg-cream-200 mb-4"></div>
        <div class="h-4 bg-cream-200 rounded w-48 mb-2"></div>
        <div class="h-3 bg-cream-200 rounded w-32"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="quranStore.error" class="text-center py-20 text-red-500">
        <p>{{ quranStore.error }}</p>
        <button @click="fetchData" class="mt-4 btn-primary px-4 py-2 text-sm">Retry</button>
      </div>

      <!-- Ayahs -->
      <div v-else class="space-y-8">
        <div 
            v-for="(ayah, index) in quranStore.juzData" 
            :key="ayah.number" 
            class="ayah-card animate-fade-up" 
            :style="{ animationDelay: `${Math.min(index * 0.05, 1)}s` }"
            :data-ayah="ayah.numberInSurah"
            :data-surah="ayah.surah.englishName"
            :data-surah-number="ayah.surah.number"
            :id="`ayah-${ayah.surah.number}-${ayah.numberInSurah}`"
        >
          
          <!-- Surah Header if ayah is start of Surah -->
          <div v-if="index === 0 || ayah.surah.number !== quranStore.juzData[index - 1].surah.number" class="text-center my-10 bg-cream-200 py-4 rounded-xl border border-cream-300">
             <h2 class="font-bold text-emerald-800 text-xl">{{ ayah.surah.name }}</h2>
             <p class="text-emerald-600 text-sm">{{ ayah.surah.englishName }} • {{ ayah.surah.revelationType }} • {{ ayah.surah.numberOfAyahs }} Ayahs</p>
             <div v-if="ayah.surah.number !== 1 && ayah.surah.number !== 9" class="mt-3 font-arabic text-2xl text-emerald-700">
               بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
             </div>
          </div>

          <!-- Ayah Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-cream-100 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-emerald-100">
            <!-- Ayah Number Badge -->
            <div class="absolute top-0 left-0 bg-cream-200 px-3 py-1 rounded-br-xl text-xs font-bold text-emerald-800 border-r border-b border-cream-300">
              {{ ayah.surah.number }}:{{ ayah.numberInSurah }}
            </div>

            <!-- Arabic Text -->
            <div class="text-right font-arabic text-3xl leading-[2.5] text-emerald-900 mb-4 pt-6" dir="rtl">
              {{ ayah.text }}
               <span class="text-xl text-emerald-500 font-sans mx-1">۝</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mark Complete Button (Sticky Bottom) -->
    <div class="fixed bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none">
      <button 
        @click="toggleComplete" 
        class="pointer-events-auto shadow-lg backdrop-blur-md border border-emerald-100 px-6 py-3 rounded-full flex items-center gap-2 font-bold transition-all transform active:scale-95"
        :class="isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/90 text-emerald-800 hover:bg-emerald-50'"
        v-if="!quranStore.isLoading"
      >
        <span v-if="isCompleted">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </span>
        {{ isCompleted ? 'Juz Completed' : 'Mark as Complete' }}
      </button>
    </div>

    <!-- Bottom Navigation for Juz -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 p-4 flex justify-between items-center z-30 max-w-md mx-auto w-full md:relative md:bg-transparent md:border-none md:max-w-3xl">
      <button 
        @click="goToJuz(currentJuz - 1)" 
        :disabled="currentJuz <= 1"
        class="flex items-center gap-2 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Prev Juz
      </button>

      <span class="font-bold text-emerald-900">Juz {{ currentJuz }}</span>

      <button 
        @click="goToJuz(currentJuz + 1)" 
        :disabled="currentJuz >= 30"
        class="flex items-center gap-2 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        Next Juz
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuranStore } from '~/stores/quran'
import { useTilawahStore } from '~/stores/tilawah'

const route = useRoute()
const router = useRouter()
const quranStore = useQuranStore()
const tilawahStore = useTilawahStore()
const { success, info } = useToast()

const currentJuz = computed(() => Number(route.params.juz))
const isCompleted = computed(() => tilawahStore.completedJuz[currentJuz.value - 1])

let observer: IntersectionObserver | null = null
let debounceTimer: any = null

async function fetchData() {
  await quranStore.fetchJuz(currentJuz.value)
  
  // Wait for DOM update then setup observer & auto-scroll
  nextTick(() => {
     setTimeout(() => {
        setupObserver()
        scrollToTarget()
     }, 1000)
  })
}

function scrollToTarget() {
    // Priority 1: Query params (from search, e.g., ?surah=4&ayah=90)
    const qSurah = route.query.surah ? Number(route.query.surah) : null
    const qAyah = route.query.ayah ? Number(route.query.ayah) : null

    if (qSurah && qAyah) {
        const el = document.getElementById(`ayah-${qSurah}-${qAyah}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Highlight the target ayah briefly
            const card = el.querySelector('.bg-white') as HTMLElement
            if (card) {
                card.style.transition = 'box-shadow 0.3s, border-color 0.3s'
                card.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.3)'
                card.style.borderColor = '#059669'
                setTimeout(() => {
                    card.style.boxShadow = ''
                    card.style.borderColor = ''
                }, 3000)
            }
            return
        }
    }

    // Priority 2: Last read position
    if (tilawahStore.lastRead && tilawahStore.lastRead.juz === currentJuz.value) {
        const lastAyah = tilawahStore.lastRead.ayah
        // Try to find by surah name match too for accuracy
        const allCards = document.querySelectorAll('.ayah-card')
        for (const card of allCards) {
            const cardAyah = Number(card.getAttribute('data-ayah'))
            const cardSurah = card.getAttribute('data-surah')
            if (cardAyah === lastAyah && cardSurah === tilawahStore.lastRead.surah) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                info(`Melanjutkan dari ${tilawahStore.lastRead.surah}, Ayah ${lastAyah}`)
                return
            }
        }
    }
}

function setupObserver() {
    if (observer) observer.disconnect()
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLElement
                const ayah = Number(target.getAttribute('data-ayah'))
                const surah = target.getAttribute('data-surah')
                
                if (ayah && surah) {
                    savePosition(currentJuz.value, ayah, surah)
                }
            }
        })
    }, {
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    })

    // Observe all ayah cards
    document.querySelectorAll('.ayah-card').forEach(el => observer?.observe(el))
}

function savePosition(juz: number, ayah: number, surah: string) {
    // Debounce to avoid API spam
    if (debounceTimer) clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(() => {
        tilawahStore.updateLastRead(juz, ayah, surah)
    }, 2000) // Save every 2 seconds of settling
}

function toggleComplete() {
  tilawahStore.toggleJuz(currentJuz.value)
  if (isCompleted.value) {
    success(`Juz ${currentJuz.value} completed!`)
  } else {
    // Info without icon?
  }
}

function goToJuz(juz: number) {
  if (juz >= 1 && juz <= 30) {
    // Scroll to top
    window.scrollTo(0, 0)
    router.push(`/read/${juz}`)
  }
}

onMounted(() => {
    fetchData()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
    if (debounceTimer) clearTimeout(debounceTimer)
})

watch(() => route.params.juz, (newJuz) => {
  if (newJuz) {
    fetchData()
  }
})

definePageMeta({
  layout: 'blank'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.font-arabic {
  font-family: 'Amiri', serif;
}
</style>
