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
 * ENHANCED: Dynamic highlight.js theme loading based on current theme
 */

// Explicit component imports to resolve auto-import issues
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'

// Initialize the theme system
const { isDarkMode } = useTheme()

// Initialize analytics tracking
useTracking()

/**
 * Dynamically load the appropriate highlight.js theme
 * This ensures code blocks have proper contrast in both light and dark modes
 */
const loadHighlightTheme = (dark) => {
  if (!import.meta.client) return
  
  // Remove existing highlight.js stylesheets
  const existingLinks = document.querySelectorAll('link[data-highlight-theme]')
  existingLinks.forEach(link => link.remove())
  
  // Add the appropriate theme
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.setAttribute('data-highlight-theme', 'true')
  
  if (dark) {
    // Dark theme - high contrast
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
  } else {
    // Light theme - high contrast
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
  }
  
  document.head.appendChild(link)
}

// Load initial theme on mount
onMounted(() => {
  loadHighlightTheme(isDarkMode.value)
})

// Watch for theme changes and reload highlight.js theme
watch(isDarkMode, (newIsDark) => {
  loadHighlightTheme(newIsDark)
})
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
  /* Ensure proper color scheme for browser chrome */
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
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

/* Enhanced layout stability during theme transitions */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  /* Prevent layout shift */
  min-height: 100vh;
}

/* Ensure proper z-index layering */
header {
  z-index: 1000;
}

main {
  z-index: 1;
}

footer {
  z-index: 1;
}

/* Improve text rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Ensure proper loading states */
.nuxt-loading-indicator {
  background: var(--color-primary);
}
</style>
