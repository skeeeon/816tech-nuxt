<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
/**
 * Root application component for 816tech Nuxt application
 * Handles global initialization and provides the main app structure
 */

// Initialize theme on app startup
const { initTheme } = useTheme()

// Initialize theme when app mounts
onMounted(() => {
  initTheme()
})

// Global SEO defaults
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
})
</script>

<style>
/* Global styles are handled through the theme system in assets/css/theme.css */
/* This ensures consistent styling across the entire application */

/* Ensure proper font loading */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Ensure proper theme transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
