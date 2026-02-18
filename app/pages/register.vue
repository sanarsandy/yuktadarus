<template>
  <div class="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-6 sm:p-10">
    <div class="w-full max-w-md animate-fade-up">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-emerald-800 mb-2">Create Account</h1>
        <p class="text-cream-400">Join the community and start your journey</p>
      </div>

      <!-- Register Form -->
      <div class="card-neu p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name -->
          <div class="space-y-2">
            <label for="name" class="text-sm font-bold text-emerald-700 ml-1">Full Name</label>
            <div class="card-neu-inset flex items-center gap-3 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                id="name" 
                v-model="name" 
                type="text" 
                required 
                placeholder="Abdullah"
                class="bg-transparent border-none outline-none text-emerald-900 w-full placeholder-cream-300 font-medium"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-bold text-emerald-700 ml-1">Email</label>
            <div class="card-neu-inset flex items-center gap-3 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required 
                placeholder="hello@example.com"
                class="bg-transparent border-none outline-none text-emerald-900 w-full placeholder-cream-300 font-medium"
              >
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-bold text-emerald-700 ml-1">Password</label>
            <div class="card-neu-inset flex items-center gap-3 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                required 
                placeholder="••••••••"
                class="bg-transparent border-none outline-none text-emerald-900 w-full placeholder-cream-300 font-medium"
              >
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 space-y-4">
            <button 
              type="submit" 
              class="btn-primary w-full text-lg"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Create Account</span>
              <span v-else>Loading...</span>
            </button>

            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-cream-300 opacity-30"></div>
              <span class="flex-shrink-0 mx-4 text-cream-300 text-sm">Or</span>
              <div class="flex-grow border-t border-cream-300 opacity-30"></div>
            </div>

            <button 
              type="button" 
              @click="handleGoogleSignup"
              class="btn-secondary w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
            >
              <!-- Google Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center mt-8 text-cream-400">
        Already have an account? 
        <NuxtLink to="/login" class="text-emerald-600 font-bold hover:underline">
          Sign In
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank'
})

const userStore = useUserStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleRegister() {
  isLoading.value = true
  try {
    const { success, error } = useToast()
    await userStore.register(name.value, email.value, password.value)
    success('Registration successful! Welcome.')
    router.push('/home')
  } catch (e) {
    const { error } = useToast()
    error(userStore.error || 'Registration failed')
  } finally {
    isLoading.value = false
  }
}

// Removed useGoogleAuth import
// import { useGoogleAuth } from '~/composables/useGoogleAuth'

async function handleGoogleSignup() {
  try {
    const { url } = await $fetch<{ url: string }>('/api/auth/google/url')
    window.location.href = url
  } catch (e: any) {
    const { error } = useToast()
    error(e.message || 'Google signup failed')
  }
}
</script>
