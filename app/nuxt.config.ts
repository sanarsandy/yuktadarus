// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

  app: {
    head: {
      title: 'MacaQuran',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Track your daily Quran reading journey. Complete 30 Juz during Ramadan with streaks, badges, and community.' },
        { name: 'theme-color', content: '#2D5A43' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800],
      Amiri: [400, 700],
    },
    display: 'swap',
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  vite: {
    server: {
      hmr: {
        port: 24678,
        clientPort: 24678,
      },
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  routeRules: {
    '/api/**': { proxy: 'http://backend:8080/api/**' },
  },
})
