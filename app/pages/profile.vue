<template>
  <div class="max-w-md mx-auto px-5 pt-6 pb-4 space-y-5">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-3xl font-extrabold text-emerald-800">Profile</h1>
      <p class="text-cream-400 text-sm mt-1">Your achievements & sharing</p>
    </div>

    <!-- Badges Section -->
    <div class="card-neu animate-fade-up" style="animation-delay: 0.1s" id="badges-section">
      <h3 class="text-lg font-bold text-emerald-800 mb-4">Badges</h3>
      <div class="grid grid-cols-3 gap-3">
        <BadgeCard
          v-for="badge in badges.badges"
          :key="badge.id"
          :badge="badge"
          :earned="badge.requirement()"
        >
          <template #icon>
            <component :is="getBadgeIcon(badge.id, badge.requirement())" class="w-6 h-6" />
          </template>
        </BadgeCard>
      </div>
    </div>

    <!-- Referral Section -->
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
import IconStar from '~/components/IconStar.vue'
import IconFlame from '~/components/IconFlame.vue'
import IconTrophy from '~/components/IconTrophy.vue'
import IconLock from '~/components/IconLock.vue'

const badges = useBadgesStore()
const userStore = useUserStore()
const tilawah = useTilawahStore()

function getBadgeIcon(id: string, earned: boolean) {
  if (!earned) return IconLock
  switch (id) {
    case 'first-juz': return IconStar
    case 'one-week-strong': return IconFlame
    case 'halfway-there': return IconStar
    case 'final-push': return IconStar
    case 'khatam-complete': return IconTrophy
    default: return IconStar
  }
}

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress?')) {
    tilawah.resetProgress()
  }
}
</script>
