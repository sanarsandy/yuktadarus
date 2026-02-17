<template>
  <div class="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-8">
    <div class="animate-fade-up text-center max-w-sm">
      <!-- Logo -->
      <div class="card-neu-sm w-20 h-20 mx-auto mb-8 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
          stroke="#2D5A43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M12 6v7" />
          <path d="M8 9l4-3 4 3" />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="text-4xl font-extrabold text-emerald-800 mb-6">
        One Day One Juz
      </h1>

      <!-- Description -->
      <p class="text-cream-400 text-lg leading-relaxed mb-10">
        Complete the entire Quran this Ramadan. Track your daily juz, build streaks, earn badges, and share the reward with friends.
      </p>

      <!-- Features Grid -->
      <div class="grid grid-cols-2 gap-3 mb-10">
        <FeatureCard
          title="Daily Tracking"
          description="Mark your juz complete each day with a single tap."
        >
          <template #icon><IconBook class="w-6 h-6" /></template>
        </FeatureCard>
        <FeatureCard
          title="Progress"
          description="Visualize your 30-day journey with calendar heatmap."
        >
          <template #icon><IconChart class="w-6 h-6" /></template>
        </FeatureCard>
        <FeatureCard
          title="Motivation"
          description="Daily Quran verses and milestone badges."
        >
          <template #icon><IconStar class="w-6 h-6" /></template>
        </FeatureCard>
        <FeatureCard
          title="Share"
          description="Invite friends to join and track together."
        >
          <template #icon><IconUser class="w-6 h-6" /></template>
        </FeatureCard>
      </div>

      <!-- CTA Buttons -->
      <div class="space-y-4">
        <button
          class="btn-primary w-full flex items-center justify-center gap-3 text-lg"
          @click="startJourney"
          id="start-journey-btn"
        >
          <span>Get Started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <button
          class="btn-secondary w-full text-lg"
          @click="goToLogin"
          id="login-btn"
        >
          I already have an account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import IconBook from '~/components/IconBook.vue'
import IconChart from '~/components/IconChart.vue'
import IconStar from '~/components/IconStar.vue'
import IconUser from '~/components/IconProfile.vue' // Reuse Profile icon for User

definePageMeta({
  layout: 'blank',
})

const userStore = useUserStore()
const router = useRouter()

// Redirect if already logged in
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.replace('/home')
  }
})

function startJourney() {
  router.push('/register')
}

function goToLogin() {
  router.push('/login')
}
</script>
