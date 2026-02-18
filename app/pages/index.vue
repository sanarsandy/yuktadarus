<template>
  <div class="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-8">
    <div class="animate-fade-up text-center max-w-sm">
      <!-- Logo -->
      <!-- MacaQuran Minimalist Logo -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-surface-200 mb-6 relative group overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Book Shape -->
            <path d="M12 8C12 6.89543 12.8954 6 14 6H34C35.1046 6 36 6.89543 36 8V40C36 41.1046 35.1046 42 34 42H14C12.8954 42 12 41.1046 12 40V8Z" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 36H36" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Arrow Up -->
            <path d="M24 28V14M24 14L19 19M24 14L29 19" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-brand-700 tracking-tight">
          MacaQuran
        </h1>
      </div>

      <!-- Description -->
      <p class="text-stone-500 text-lg leading-relaxed mb-10">
        Build a consistent habit of reading the Quran. Track your daily progress, stay motivated with streaks, and share the journey with your circle.
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
