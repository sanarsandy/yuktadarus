<template>
  <div class="card-neu" id="referral-card">
    <h3 class="text-lg font-bold text-emerald-800 mb-4">Share the Reward</h3>

    <div class="card-neu-inset p-6 text-center mb-4">
      <p class="text-xs text-cream-400 mb-2">Your referral code</p>
      <p class="text-3xl font-bold text-emerald-500 tracking-widest font-mono">
        {{ referralCode }}
      </p>
    </div>

    <button
      class="btn-secondary w-full flex items-center justify-center gap-3"
      @click="copyLink"
      id="copy-invite-link-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span>{{ copied ? 'Copied!' : 'Copy Invite Link' }}</span>
    </button>

    <p class="text-center text-xs text-cream-400 mt-4">
      Share the reward of Quran reading — may Allah reward your effort.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  referralCode: string
}>()

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(`Join me on ODOJ! Use my code to start your Quran journey.`)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
