<template>
  <div class="max-w-md mx-auto px-5 pt-5 pb-24">
    <!-- Header -->
    <div class="mb-4 animate-fade-down">
      <h1 class="text-lg font-bold text-emerald-800">Al-Qur'an</h1>
      <p class="text-[10px] text-cream-400">114 Surah · 30 Juz · 6,236 Ayat</p>
    </div>

    <!-- Search -->
    <div class="relative mb-4 animate-fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="absolute left-3 top-1/2 -translate-y-1/2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari surah, juz, atau ayat (cth: 2:255)"
        class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream-100 text-sm text-emerald-800 placeholder-cream-300 outline-none border border-cream-200 focus:border-emerald-300 transition-colors"
        id="quran-search"
      />
      <button v-if="searchQuery" @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-cream-300 hover:text-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Search hints (when empty) -->
    <div v-if="!searchQuery && activeTab === 'surah'" class="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
      <button v-for="hint in searchHints" :key="hint"
        @click="searchQuery = hint"
        class="text-[10px] px-2.5 py-1 rounded-full bg-cream-100 text-cream-400 hover:bg-emerald-100 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
        {{ hint }}
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-4 bg-cream-100 rounded-xl p-1 animate-fade-up" style="animation-delay: 0.03s">
      <button
        v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 text-xs font-semibold py-2 rounded-lg transition-all"
        :class="activeTab === tab.key
          ? 'bg-white text-emerald-700 shadow-sm'
          : 'text-cream-400 hover:text-emerald-600'"
      >{{ tab.label }}</button>
    </div>

    <!-- Surah List View -->
    <div v-if="activeTab === 'surah'" class="space-y-0.5 animate-fade-up" style="animation-delay: 0.06s">
      <div v-if="searchResults.length === 0" class="text-center py-10">
        <p class="text-sm text-cream-400">Tidak ditemukan</p>
        <p class="text-[10px] text-cream-300 mt-1">Coba: "Al-Baqarah", "juz 30", "2:255"</p>
      </div>

      <NuxtLink
        v-for="result in searchResults" :key="result.surah.number"
        :to="resultLink(result)"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-100 transition-colors group"
        :id="`surah-${result.surah.number}`"
      >
        <!-- Number -->
        <div class="w-8 h-8 rounded-lg bg-cream-100 group-hover:bg-emerald-100 flex items-center justify-center text-[11px] font-bold text-emerald-700 transition-colors shrink-0">
          {{ result.surah.number }}
        </div>

        <!-- Name & details -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-emerald-800 leading-tight">{{ result.surah.name }}</p>
          <p class="text-[10px] text-cream-400">
            <template v-if="result.ayah">
              <span class="text-emerald-600 font-medium">Ayat {{ result.ayah }}</span> · {{ result.surah.ayahs }} ayat
            </template>
            <template v-else>
              {{ result.surah.meaning }} · {{ result.surah.ayahs }} ayat
            </template>
          </p>
        </div>

        <!-- Arabic name & badge -->
        <div class="text-right shrink-0">
          <p class="text-base font-bold text-emerald-600 leading-tight" style="font-family: 'Scheherazade New', serif; direction: rtl;">{{ result.surah.nameAr }}</p>
          <p v-if="result.ayah" class="text-[9px] font-medium text-emerald-500">→ Ayat {{ result.ayah }}</p>
          <p v-else class="text-[9px] text-cream-300">{{ result.surah.type }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Juz Grid View -->
    <div v-if="activeTab === 'juz'" class="animate-fade-up" style="animation-delay: 0.06s">
      <div class="grid grid-cols-5 gap-2">
        <NuxtLink
          v-for="j in 30" :key="j"
          :to="`/read/${j}`"
          class="flex flex-col items-center justify-center py-3 rounded-xl bg-cream-100 hover:bg-emerald-100 transition-colors group"
          :class="isJuzDone(j) ? 'ring-1 ring-emerald-200' : ''"
          :id="`juz-${j}`"
        >
          <span class="text-sm font-bold text-emerald-700 group-hover:text-emerald-800">{{ j }}</span>
          <span class="text-[8px] text-cream-400 mt-0.5">Juz</span>
          <svg v-if="isJuzDone(j)" xmlns="http://www.w3.org/2000/svg" width="10" height="10"
            viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" class="mt-0.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Bookmarks View -->
    <div v-if="activeTab === 'bookmark'" class="animate-fade-up" style="animation-delay: 0.06s">
      <div v-if="!tilawah.lastRead" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#d1d5db" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
        <p class="text-sm text-cream-400">Belum ada riwayat baca</p>
      </div>
      <div v-else class="card-neu">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-sm font-extrabold text-emerald-700">
            {{ tilawah.lastRead.juz }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-emerald-800">Juz {{ tilawah.lastRead.juz }}</p>
            <p class="text-[10px] text-cream-400">{{ tilawah.lastRead.surah }} · Ayah {{ tilawah.lastRead.ayah }}</p>
          </div>
          <NuxtLink :to="`/read/${tilawah.lastRead.juz}`"
            class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">
            Lanjut
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuranData, type SearchResult } from '~/composables/useQuranData'
import { useTilawahStore } from '~/stores/tilawah'

const { searchSurahs } = useQuranData()
const tilawah = useTilawahStore()

const searchQuery = ref('')
const activeTab = ref<'surah' | 'juz' | 'bookmark'>('surah')

const searchHints = ['juz 30', '2:255', 'Yasin', 'Al-Kahfi', 'Ar-Rahman']

const tabs = [
  { key: 'surah' as const, label: 'Surah' },
  { key: 'juz' as const, label: 'Juz' },
  { key: 'bookmark' as const, label: 'Terakhir' },
]

const searchResults = computed(() => {
  return searchSurahs(searchQuery.value)
})

function resultLink(result: SearchResult) {
  // For ayah-specific search, figure out which juz contains this ayah
  // For simplicity, use the first juz (most surahs are in 1 juz)
  // For multi-juz surahs the API data will place it correctly
  const juz = result.surah.juz[0]
  if (result.ayah) {
    return `/read/${juz}?surah=${result.surah.number}&ayah=${result.ayah}`
  }
  return `/read/${juz}`
}

function isJuzDone(juz: number): boolean {
  return tilawah.progress?.[juz - 1]?.status === 'done'
}
</script>

<style scoped>
.animate-fade-down {
  animation: fadeDown 0.5s ease-out;
}

@keyframes fadeDown {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
