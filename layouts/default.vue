<template>
  <div class="min-h-screen flex flex-col theme-transition">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
/**
 * Default layout for 816tech Nuxt application
 * Provides the main structure for all pages with explicit component imports
 */

// Explicit component imports to resolve auto-import issues
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'

// Initialize the theme system
const { isDarkMode } = useTheme()

// Initialize analytics tracking
useTracking()
</script>

<style>
/* Global container style */
.container {
  @apply px-4 sm:px-6 mx-auto;
  max-width: 1280px;
}

/* Add smooth scrolling to the entire page */
html {
  scroll-behavior: smooth;
}

/* Improve focus styles for accessibility */
:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  @apply dark:ring-primary-400 dark:ring-offset-slate-800;
}

/* Theme transition for smooth color changes */
.theme-transition {
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}
</style>
