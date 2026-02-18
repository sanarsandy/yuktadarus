<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-24 space-y-5">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-2xl font-extrabold text-emerald-800">Profil</h1>
      <p class="text-cream-400 text-sm mt-1">Pengaturan & pencapaian</p>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <span class="text-sm font-semibold">{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- ═══════════ GOAL SETTING ═══════════ -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.05s" id="goal-setting-card">
      <div class="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <h3 class="text-sm font-bold text-emerald-800">Target Bacaan</h3>
      </div>

      <div class="space-y-2">
        <button
          v-for="option in goalOptions" :key="option.type"
          @click="selectGoal(option)"
          class="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200"
          :class="isSelectedGoal(option) ? 'border-emerald-500 bg-emerald-50' : 'border-cream-200 bg-cream-100 hover:border-cream-300'">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="isSelectedGoal(option) ? 'bg-emerald-500 text-white' : 'bg-cream-200 text-cream-400'">
              <!-- Bebas: feather icon -->
              <svg v-if="option.type === 'free'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
              <!-- Khatam 30: flame icon -->
              <svg v-else-if="option.type === 'khatam_30'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              <!-- Khatam 60: moon icon -->
              <svg v-else-if="option.type === 'khatam_60'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <!-- Ayat: book-open icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold" :class="isSelectedGoal(option) ? 'text-emerald-800' : 'text-emerald-700'">{{ option.label }}</p>
              <p class="text-[10px] text-cream-400">{{ option.desc }}</p>
            </div>
          </div>
          <div v-if="isSelectedGoal(option)" class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </button>
      </div>

      <!-- Custom target input -->
      <div v-if="selectedGoalType === 'ayat'" class="mt-3 flex items-center gap-2">
        <input v-model.number="customTarget" type="number" min="1" max="1000" placeholder="10"
          class="flex-1 px-3 py-2 rounded-lg bg-cream-100 border border-cream-200 text-sm text-emerald-800 focus:outline-none focus:border-emerald-400" />
        <span class="text-xs text-cream-400">ayat/hari</span>
        <button @click="saveCustomGoal" class="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">
          Simpan
        </button>
      </div>
    </div>

    <!-- ═══════════ BADGES ═══════════ -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.1s" id="badges-section">
      <h3 class="text-sm font-bold text-emerald-800 mb-4">Pencapaian</h3>
      <div class="grid grid-cols-3 gap-3">
        <BadgeCard
          v-for="badge in badges.badges"
          :key="badge.id"
          :badge="badge"
          :earned="badge.requirement()"
        />
      </div>
    </div>

    <!-- ═══════════ REFERRAL ═══════════ -->
    <div class="animate-fade-up" style="animation-delay: 0.2s">
      <ReferralCard :referral-code="userStore.referralCode" />
    </div>

    <!-- Reset (Dev Only) -->
    <div class="animate-fade-up text-center" style="animation-delay: 0.3s">
      <button
        class="text-xs text-cream-300 hover:text-red-400 transition-colors duration-300 underline"
        @click="resetProgress"
        id="reset-progress-btn"
      >
        Reset Progress (Dev)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBadgesStore } from '~/stores/badges'
import { useUserStore } from '~/stores/user'
import { useTilawahStore } from '~/stores/tilawah'

const badges = useBadgesStore()
const userStore = useUserStore()
const tilawah = useTilawahStore()

const selectedGoalType = ref(tilawah.goal.type || 'free')
const customTarget = ref(tilawah.goal.target || 10)
const showToast = ref(false)
const toastMessage = ref('')

const goalOptions = [
  { type: 'free', label: 'Bebas', desc: 'Baca kapan saja tanpa target', target: 0 },
  { type: 'khatam_30', label: '1 Juz / Hari', desc: 'Khatam dalam 30 hari', target: 1 },
  { type: 'khatam_60', label: '½ Juz / Hari', desc: 'Khatam dalam 60 hari', target: 0 },
  { type: 'ayat', label: 'Target Ayat', desc: 'Atur jumlah ayat per hari', target: 10 },
]

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2000)
}

function isSelectedGoal(option: typeof goalOptions[0]) {
  return selectedGoalType.value === option.type
}

async function selectGoal(option: typeof goalOptions[0]) {
  selectedGoalType.value = option.type
  if (option.type !== 'ayat') {
    await tilawah.setGoal(option.type, option.target)
    toast(`Target diubah: ${option.label}`)
  }
}

async function saveCustomGoal() {
  await tilawah.setGoal('ayat', customTarget.value)
  toast(`Target disimpan: ${customTarget.value} ayat/hari`)
}

function resetProgress() {
  if (confirm('Yakin ingin reset semua progress?')) {
    tilawah.resetProgress()
    toast('Progress direset')
  }
}
</script>

<style scoped>
.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}
.toast-leave-active {
  animation: toastOut 0.3s ease-in;
}
@keyframes toastIn {
  0% { opacity: 0; transform: translate(-50%, -20px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes toastOut {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -20px); }
}
</style>
