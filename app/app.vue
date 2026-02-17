<template>
  <NuxtLayout>
    <NuxtPage />
    <ToastNotification />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useTilawahStore } from '~/stores/tilawah'

const userStore = useUserStore()
const tilawahStore = useTilawahStore()

onMounted(async () => {
  if (userStore.isLoggedIn && userStore.token) {
    await tilawahStore.fetchProgress()
  }
})
</script>
