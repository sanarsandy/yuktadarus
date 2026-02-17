<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 nav-glass" id="bottom-nav">
    <div class="max-w-md mx-auto flex items-center justify-around py-3 px-4">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="isActive(item.path) ? 'text-emerald-500' : 'text-cream-400 hover:text-emerald-300'"
      >
        <div
          class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
          :class="isActive(item.path) ? 'bg-cream-200 shadow-neu-sm' : ''"
        >
          <component :is="item.icon" :active="isActive(item.path)" />
        </div>
        <span class="text-xs font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/home', label: 'Home', icon: resolveComponent('IconHome') },
  { path: '/progress', label: 'Progress', icon: resolveComponent('IconProgress') },
  { path: '/profile', label: 'Profile', icon: resolveComponent('IconProfile') },
]

const isActive = (path: string) => route.path === path
</script>
