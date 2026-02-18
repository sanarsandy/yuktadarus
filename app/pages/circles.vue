<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-4 space-y-5">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-3xl font-extrabold text-emerald-800">Circle</h1>
      <p class="text-cream-400 text-sm mt-1">Tadarus bersama teman & keluarga</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 animate-fade-up" style="animation-delay: 0.05s">
      <button
        @click="showCreateModal = true"
        class="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        Buat Circle
      </button>
      <button
        @click="showJoinModal = true"
        class="flex-1 bg-cream-200 text-emerald-700 font-semibold py-3 rounded-xl text-sm hover:bg-cream-300 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Gabung
      </button>
    </div>

    <!-- Loading -->
    <div v-if="circleStore.isLoading" class="text-center py-12">
      <div class="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
      <p class="text-sm text-cream-400 mt-3">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="circleStore.myCircles.length === 0" class="card-neu text-center py-10 animate-fade-up" style="animation-delay: 0.1s">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 flex items-center justify-center text-cream-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3 class="font-bold text-emerald-800 mb-1">Belum ada circle</h3>
      <p class="text-xs text-cream-400 px-6">Buat circle baru atau gabung menggunakan kode undangan dari teman</p>
    </div>

    <!-- Circle List -->
    <div v-else class="space-y-3 animate-fade-up" style="animation-delay: 0.1s">
      <CircleCard
        v-for="circle in circleStore.myCircles"
        :key="circle.id"
        :circle="circle"
        @select="goToCircle"
      />
    </div>

    <!-- Create Circle Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center" @click.self="showCreateModal = false">
          <div class="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 z-10">
            <h2 class="text-lg font-bold text-emerald-800">Buat Circle Baru</h2>

            <div>
              <label class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Nama Circle</label>
              <input v-model="createName" type="text" placeholder="contoh: Keluarga Besar"
                class="w-full mt-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-100 text-emerald-800 text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
            </div>

            <div>
              <label class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Deskripsi (opsional)</label>
              <input v-model="createDesc" type="text" placeholder="contoh: Tadarus Ramadan 1447H"
                class="w-full mt-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-100 text-emerald-800 text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
            </div>

            <!-- Scheme Selector -->
            <div>
              <label class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Skema Tadarus</label>
              <div class="space-y-2 mt-2">
                <button
                  v-for="s in schemes"
                  :key="s.value"
                  @click="createScheme = s.value"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                  :class="createScheme === s.value
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-cream-300 bg-cream-100 hover:border-cream-400'"
                >
                  <span class="text-lg">{{ s.icon }}</span>
                  <div>
                    <p class="text-sm font-semibold" :class="createScheme === s.value ? 'text-emerald-700' : 'text-emerald-800'">{{ s.label }}</p>
                    <p class="text-[10px]" :class="createScheme === s.value ? 'text-emerald-500' : 'text-cream-400'">{{ s.desc }}</p>
                  </div>
                </button>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="showCreateModal = false" class="flex-1 py-3 rounded-xl text-sm font-medium text-cream-400 bg-cream-200 hover:bg-cream-300 transition-colors">Batal</button>
              <button @click="handleCreate" :disabled="!createName.trim() || circleStore.isLoading"
                class="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {{ circleStore.isLoading ? 'Creating...' : 'Buat' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Join Circle Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showJoinModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center" @click.self="showJoinModal = false">
          <div class="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 z-10">
            <h2 class="text-lg font-bold text-emerald-800">Gabung Circle</h2>
            <div>
              <label class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Kode Undangan</label>
              <input v-model="joinCode" type="text" maxlength="6" placeholder="Masukkan 6 huruf kode"
                class="w-full mt-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-100 text-emerald-800 text-sm text-center font-mono text-xl tracking-[0.3em] uppercase focus:outline-none focus:border-emerald-400 transition-colors" />
            </div>
            <p v-if="circleStore.error" class="text-xs text-red-500 font-medium">{{ circleStore.error }}</p>
            <div class="flex gap-3">
              <button @click="showJoinModal = false" class="flex-1 py-3 rounded-xl text-sm font-medium text-cream-400 bg-cream-200 hover:bg-cream-300 transition-colors">Batal</button>
              <button @click="handleJoin" :disabled="joinCode.length < 6 || circleStore.isLoading"
                class="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {{ circleStore.isLoading ? 'Joining...' : 'Gabung' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCircleStore, SCHEME_LABELS, SCHEME_DESCRIPTIONS } from '~/stores/circle'
import type { Circle } from '~/stores/circle'

const circleStore = useCircleStore()
const router = useRouter()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const createName = ref('')
const createDesc = ref('')
const createScheme = ref('khatam_bersama')
const joinCode = ref('')

const schemes = [
  { value: 'khatam_bersama', label: 'Khatam Bersama', desc: '30 juz dibagi rata ke anggota', icon: '📖' },
  { value: 'tartil_harian', label: 'Tartil Harian', desc: 'Jadwal harian bergilir', icon: '📅' },
  { value: 'khatam_race', label: 'Khatam Race', desc: 'Lomba khatam 30 juz', icon: '🏆' },
]

onMounted(() => {
  circleStore.fetchMyCircles()
})

async function handleCreate() {
  if (!createName.value.trim()) return
  try {
    const circle = await circleStore.createCircle(createName.value.trim(), createDesc.value.trim(), createScheme.value)
    showCreateModal.value = false
    createName.value = ''
    createDesc.value = ''
    createScheme.value = 'khatam_bersama'
    if (circle) router.push(`/circle/${circle.id}`)
  } catch (e) {}
}

async function handleJoin() {
  if (joinCode.value.length < 6) return
  try {
    const circle = await circleStore.joinCircle(joinCode.value.trim())
    showJoinModal.value = false
    joinCode.value = ''
    if (circle) router.push(`/circle/${circle.id}`)
  } catch (e) {}
}

function goToCircle(circle: Circle) {
  router.push(`/circle/${circle.id}`)
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
