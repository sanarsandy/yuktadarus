<template>
  <div class="h-screen flex items-center justify-center bg-cream-100">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-emerald-800">Authenticating...</h2>
      <p class="text-cream-400 mt-2">Please wait while we verify your Google account.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  const code = route.query.code as string
  
  if (!code) {
    const { error } = useToast()
    error('Authorization code missing')
    return router.push('/login')
  }

  try {
    await userStore.loginWithGoogle(code)
    router.push('/home')
  } catch (e: any) {
    const { error } = useToast()
    error(e.message || 'Google login failed')
    router.push('/login')
  }
})
</script>
