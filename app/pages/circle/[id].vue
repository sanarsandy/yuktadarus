<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-24 space-y-5">
    <!-- Loading -->
    <div v-if="circleStore.isLoading && !circleStore.activeCircle" class="text-center py-20">
      <div class="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
    </div>

    <template v-else-if="circleStore.activeCircle">
      <!-- Header -->
      <div class="animate-fade-up">
        <button @click="router.push('/circles')" class="text-emerald-500 text-sm font-medium flex items-center gap-1 mb-2 hover:text-emerald-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Kembali
        </button>
        <h1 class="text-2xl font-extrabold text-emerald-800">{{ circleStore.activeCircle.name }}</h1>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
            {{ SCHEME_LABELS[circleStore.activeCircle.scheme] || 'Khatam Bersama' }}
          </span>
          <span v-if="circleStore.activeCircle.description" class="text-cream-400 text-xs">{{ circleStore.activeCircle.description }}</span>
        </div>
      </div>

      <!-- Stats Overview Card -->
      <div class="card-neu animate-fade-up" style="animation-delay: 0.05s">
        <div class="flex items-center gap-4">
          <!-- Progress Ring -->
          <CircleProgressRing :percentage="circleStore.completionPct" :size="100" :stroke-width="7" />

          <!-- Stats Grid -->
          <div class="flex-1 grid grid-cols-2 gap-2">
            <div class="bg-cream-100 rounded-xl p-2.5 text-center">
              <p class="text-lg font-extrabold text-emerald-700">{{ circleStore.stats?.total_xp || 0 }}</p>
              <p class="text-[9px] font-semibold text-cream-400 uppercase">Total XP</p>
            </div>
            <div class="bg-cream-100 rounded-xl p-2.5 text-center">
              <p class="text-lg font-extrabold text-emerald-700">🔥 {{ circleStore.stats?.circle_streak || 0 }}</p>
              <p class="text-[9px] font-semibold text-cream-400 uppercase">Streak</p>
            </div>
            <div class="bg-cream-100 rounded-xl p-2.5 text-center">
              <p class="text-lg font-extrabold text-emerald-700">{{ circleStore.activeMembers.length }}</p>
              <p class="text-[9px] font-semibold text-cream-400 uppercase">Anggota</p>
            </div>
            <div class="bg-cream-100 rounded-xl p-2.5 text-center">
              <p class="text-lg font-extrabold text-emerald-700">{{ circleStore.stats?.khatam_count || 0 }}</p>
              <p class="text-[9px] font-semibold text-cream-400 uppercase">Khatam</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite Code Card -->
      <div class="card-neu flex items-center justify-between animate-fade-up" style="animation-delay: 0.08s" id="invite-code-card">
        <div>
          <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Kode Undangan</p>
          <p class="text-2xl font-mono font-extrabold text-emerald-800 tracking-[0.25em]">
            {{ circleStore.activeCircle.invite_code }}
          </p>
        </div>
        <button @click="copyInviteCode"
          class="p-3 rounded-xl bg-cream-200 hover:bg-cream-300 transition-colors text-emerald-600">
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>

      <!-- My Assignments Card (if has assignments) -->
      <div v-if="circleStore.myAssignments.length > 0" class="card-neu animate-fade-up" style="animation-delay: 0.1s">
        <h3 class="text-sm font-bold text-emerald-800 mb-3">Tugas Saya</h3>
        <div class="space-y-2">
          <div v-for="a in circleStore.myAssignments" :key="a.id"
            class="flex items-center justify-between p-3 rounded-xl bg-cream-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-700">
                {{ a.juz_number }}
              </div>
              <div>
                <p class="text-sm font-semibold text-emerald-800">Juz {{ a.juz_number }}</p>
                <AssignmentStatusBadge :status="a.status" />
              </div>
            </div>
            <!-- Status action buttons -->
            <div class="flex gap-1">
              <button v-if="a.status === 'pending'"
                @click="startReadingFromCircle(a)"
                class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Mulai Baca
              </button>
              <button v-if="a.status === 'in_progress'"
                @click="updateStatus(a.id, 'completed')"
                class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                Selesai ✓
              </button>
              <button v-if="a.status === 'completed'"
                class="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-semibold cursor-default">
                +10 XP
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scheme Admin Controls -->
      <div v-if="circleStore.isAdmin" class="card-neu animate-fade-up" style="animation-delay: 0.12s">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-emerald-800">Admin Panel</h3>
          <select v-model="selectedScheme" @change="handleSchemeChange"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cream-200 text-emerald-700 border-none focus:outline-none focus:ring-1 focus:ring-emerald-400">
            <option value="khatam_bersama">Khatam Bersama</option>
            <option value="tartil_harian">Tartil Harian</option>
            <option value="khatam_race">Khatam Race</option>
          </select>
        </div>
        <button v-if="circleStore.activeCircle.scheme === 'khatam_bersama'"
          @click="handleAutoAssign"
          :disabled="circleStore.isLoading"
          class="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          Auto Bagi Rata (30 Juz)
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex bg-cream-200 rounded-xl p-1 animate-fade-up" style="animation-delay: 0.15s">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
          :class="activeTab === tab.id
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'text-cream-400 hover:text-emerald-500'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Leaderboard -->
      <div v-if="activeTab === 'leaderboard'" class="card-neu animate-fade-up" style="animation-delay: 0.18s">
        <h3 class="text-sm font-bold text-emerald-800 mb-2">Leaderboard</h3>
        <div v-if="circleStore.leaderboard.length === 0" class="text-center py-6 text-cream-400 text-sm">Belum ada data</div>
        <div v-else class="divide-y divide-cream-200">
          <LeaderboardRow
            v-for="entry in circleStore.leaderboard"
            :key="entry.user_id"
            :rank="entry.rank"
            :name="entry.name"
            :juz-done="entry.total_juz_done"
            :role="entry.role"
            :is-you="entry.name === userStore.name"
          />
        </div>
      </div>

      <!-- Tab: Members -->
      <div v-if="activeTab === 'members'" class="card-neu animate-fade-up" style="animation-delay: 0.18s">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-bold text-emerald-800">Anggota ({{ circleStore.activeMembers.length }})</h3>
        </div>
        <div class="divide-y divide-cream-200">
          <div v-for="m in circleStore.activeMembers" :key="m.id" class="flex items-center gap-3 py-3">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              :class="m.level && m.level >= 5 ? 'bg-emerald-500 text-white' : 'bg-cream-200 text-emerald-600'">
              {{ m.user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <p class="text-sm font-semibold text-emerald-800 truncate">{{ m.user?.name }}</p>
                <span v-if="m.role === 'admin'" class="text-[8px] text-emerald-400 font-bold uppercase">Admin</span>
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] font-semibold text-emerald-500">Lv.{{ m.level || 1 }}</span>
                <span class="text-[9px] text-cream-400">{{ m.level_title || 'Pemula' }}</span>
                <span class="text-[10px] text-cream-300">•</span>
                <span class="text-[10px] text-cream-400">{{ m.xp || 0 }} XP</span>
              </div>
              <!-- XP bar -->
              <div class="w-full h-1 bg-cream-200 rounded-full mt-1 overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  :style="{ width: `${xpProgress(m.xp || 0, m.level || 1)}%` }"></div>
              </div>
            </div>
            <!-- Juz count -->
            <div class="text-right shrink-0">
              <span class="text-sm font-bold text-emerald-600">{{ m.total_juz_done || 0 }}</span>
              <span class="text-xs text-cream-400">/30</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Juz Assignment -->
      <div v-if="activeTab === 'assign'" class="space-y-4 animate-fade-up" style="animation-delay: 0.18s">
        <div class="card-neu">
          <h3 class="text-sm font-bold text-emerald-800 mb-3">Pembagian Juz</h3>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="juz in 30"
              :key="juz"
              @click="circleStore.isAdmin ? openAssign(juz) : null"
              class="aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all duration-200 relative"
              :class="getAssignmentClass(juz)"
            >
              <span class="font-bold">{{ juz }}</span>
              <span v-if="getAssignee(juz)" class="text-[7px] leading-none mt-0.5 truncate w-full text-center px-0.5">
                {{ getAssignee(juz) }}
              </span>
              <!-- Status dot -->
              <span v-if="getAssignmentStatus(juz)" class="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
                :class="{
                  'bg-emerald-500': getAssignmentStatus(juz) === 'completed',
                  'bg-amber-500 animate-pulse': getAssignmentStatus(juz) === 'in_progress',
                  'bg-cream-300': getAssignmentStatus(juz) === 'pending',
                }"></span>
            </button>
          </div>

          <!-- Legend -->
          <div class="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span class="text-[10px] text-cream-400">Selesai</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-amber-500"></div>
              <span class="text-[10px] text-cream-400">Dibaca</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-cream-300"></div>
              <span class="text-[10px] text-cream-400">Belum</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded bg-cream-200"></div>
              <span class="text-[10px] text-cream-400">Kosong</span>
            </div>
          </div>
        </div>

        <p v-if="!circleStore.isAdmin" class="text-xs text-center text-cream-400">
          Hanya admin yang bisa mengatur pembagian juz
        </p>
      </div>

      <!-- Leave Circle Button -->
      <div v-if="!circleStore.isAdmin" class="text-center animate-fade-up" style="animation-delay: 0.3s">
        <button @click="handleLeave" class="text-xs text-cream-300 hover:text-red-400 transition-colors underline">
          Keluar dari Circle
        </button>
      </div>
    </template>

    <!-- Assign Juz Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center" @click.self="showAssignModal = false">
          <div class="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 z-10">
            <h2 class="text-lg font-bold text-emerald-800">Assign Juz {{ assignJuzNumber }}</h2>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <button
                v-for="m in circleStore.activeMembers"
                :key="m.id"
                @click="handleAssign(m.user_id)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-left"
              >
                <div class="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center text-sm font-bold text-emerald-600">
                  {{ m.user?.name?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <span class="text-sm font-medium text-emerald-800">{{ m.user?.name }}</span>
                  <span class="text-[10px] text-cream-400 ml-1">Lv.{{ m.level || 1 }}</span>
                </div>
              </button>
            </div>
            <button @click="showAssignModal = false" class="w-full py-3 rounded-xl text-sm font-medium text-cream-400 bg-cream-200 hover:bg-cream-300 transition-colors">Batal</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCircleStore, SCHEME_LABELS, LEVEL_THRESHOLDS } from '~/stores/circle'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const router = useRouter()
const circleStore = useCircleStore()
const userStore = useUserStore()

const circleId = computed(() => Number(route.params.id))

const activeTab = ref('leaderboard')
const tabs = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'members', label: 'Anggota' },
  { id: 'assign', label: 'Juz' },
]

const showAssignModal = ref(false)
const assignJuzNumber = ref(1)
const copied = ref(false)
const selectedScheme = ref('khatam_bersama')

onMounted(async () => {
  await circleStore.fetchCircleDetail(circleId.value)
  await circleStore.fetchLeaderboard(circleId.value)
  await circleStore.fetchMyAssignments(circleId.value)
  await circleStore.fetchStats(circleId.value)
  if (circleStore.activeCircle) {
    selectedScheme.value = circleStore.activeCircle.scheme
  }
})

function xpProgress(xp: number, level: number): number {
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)] || currentThreshold + 100
  const range = nextThreshold - currentThreshold
  if (range <= 0) return 100
  return Math.min(100, Math.round(((xp - currentThreshold) / range) * 100))
}

async function copyInviteCode() {
  if (!circleStore.activeCircle) return
  try {
    await navigator.clipboard.writeText(circleStore.activeCircle.invite_code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const el = document.createElement('textarea')
    el.value = circleStore.activeCircle.invite_code
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function getAssignee(juz: number): string | null {
  const a = circleStore.assignments.find(a => a.juz_number === juz)
  return a ? a.user?.name?.split(' ')[0] || null : null
}

function getAssignmentStatus(juz: number): string | null {
  const a = circleStore.assignments.find(a => a.juz_number === juz)
  return a ? a.status : null
}

function getAssignmentClass(juz: number): string {
  const assignment = circleStore.assignments.find(a => a.juz_number === juz)
  if (!assignment) return 'bg-cream-100 text-cream-400'
  switch (assignment.status) {
    case 'completed': return 'bg-emerald-100 border border-emerald-300 text-emerald-700'
    case 'in_progress': return 'bg-amber-50 border border-amber-200 text-amber-700'
    default: return 'bg-cream-200 border border-cream-300 text-emerald-600'
  }
}

function openAssign(juz: number) {
  assignJuzNumber.value = juz
  showAssignModal.value = true
}

async function handleAssign(userId: number) {
  await circleStore.assignJuz(circleId.value, userId, assignJuzNumber.value)
  showAssignModal.value = false
}

async function handleSchemeChange() {
  try {
    await circleStore.setScheme(circleId.value, selectedScheme.value)
  } catch (e) {
    if (circleStore.activeCircle) selectedScheme.value = circleStore.activeCircle.scheme
  }
}

async function handleAutoAssign() {
  try {
    await circleStore.autoAssign(circleId.value)
    await circleStore.fetchCircleDetail(circleId.value)
    await circleStore.fetchMyAssignments(circleId.value)
  } catch (e) {}
}

async function updateStatus(assignId: number, status: string) {
  await circleStore.updateAssignmentStatus(circleId.value, assignId, status)
}

async function startReadingFromCircle(assignment: any) {
  await updateStatus(assignment.id, 'in_progress')
  router.push(`/read/${assignment.juz_number}`)
}

async function handleLeave() {
  if (!confirm('Yakin ingin keluar dari circle ini?')) return
  try {
    await circleStore.leaveCircle(circleId.value)
    router.push('/circles')
  } catch (e) {}
}
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease-out; }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { transform: translateY(100%); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { transform: translateY(100%); }
</style>
