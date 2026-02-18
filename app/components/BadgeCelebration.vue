<template>
  <Teleport to="body">
    <Transition name="celebration">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click="dismiss"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm"></div>

        <!-- Confetti Particles -->
        <div class="confetti-container absolute inset-0 pointer-events-none overflow-hidden">
          <div v-for="i in 30" :key="i"
            class="confetti-particle absolute"
            :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.8}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              backgroundColor: confettiColors[i % confettiColors.length],
              width: `${6 + Math.random() * 6}px`,
              height: `${6 + Math.random() * 6}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }"
          ></div>
        </div>

        <!-- Badge Card -->
        <div class="relative z-10 celebration-card bg-white rounded-3xl p-8 mx-6 max-w-xs w-full text-center shadow-2xl">
          <!-- Icon circle -->
          <div class="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 sparkle-ring">
            <BadgeIcon v-if="badge" :name="badge.icon" :size="32" />
          </div>

          <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2">Badge Unlocked</p>
          <h3 class="text-xl font-extrabold text-emerald-800 mb-2">{{ badge?.name }}</h3>
          <p class="text-sm text-emerald-600/70 mb-6">{{ badge?.description }}</p>

          <div class="text-xs text-cream-400">Tap anywhere to dismiss</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Badge } from '~/stores/badges'
import BadgeIcon from '~/components/BadgeIcon.vue'

const props = defineProps<{
  badge: Badge | null
  visible: boolean
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const confettiColors = ['#2D5A43', '#478767', '#C4A962', '#E5D59B', '#75A58D', '#D8C069']

let autoTimer: any = null

watch(() => props.visible, (val) => {
  if (val) {
    autoTimer = setTimeout(() => emit('dismiss'), 4000)
  } else {
    if (autoTimer) clearTimeout(autoTimer)
  }
})

function dismiss() {
  emit('dismiss')
}

onUnmounted(() => {
  if (autoTimer) clearTimeout(autoTimer)
})
</script>

<style scoped>
.celebration-enter-active { transition: all 0.4s ease-out; }
.celebration-leave-active { transition: all 0.3s ease-in; }
.celebration-enter-from { opacity: 0; }
.celebration-enter-from .celebration-card { transform: scale(0.5); opacity: 0; }
.celebration-leave-to { opacity: 0; }
.celebration-leave-to .celebration-card { transform: scale(0.9); opacity: 0; }

.celebration-card { animation: celebrationBounce 0.6s ease-out; }

@keyframes celebrationBounce {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.08); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

.sparkle-ring { animation: sparklePulse 1.5s ease-in-out infinite; }
@keyframes sparklePulse {
  0%, 100% { box-shadow: 0 0 20px rgba(45,90,67,0.1); }
  50% { box-shadow: 0 0 30px rgba(45,90,67,0.2); }
}

.confetti-particle { top: -10px; animation: confettiFall linear forwards; }
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
</style>
