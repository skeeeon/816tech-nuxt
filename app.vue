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
 * FIXED: Enhanced theme initialization with SSR compatibility
 */

// Initialize theme on app startup
const { initTheme } = useTheme()

// Initialize theme when app mounts
onMounted(() => {
  initTheme()
})

// Global SEO defaults with theme support
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ],
  script: [
    {
      // Simplified FOUC prevention - inline script without function call
      innerHTML: `
        (function() {
          try {
            var savedTheme = localStorage.getItem('816tech-theme') || 'auto';
            var shouldBeDark = false;
            
            if (savedTheme === 'dark') {
              shouldBeDark = true;
            } else if (savedTheme === 'light') {
              shouldBeDark = false;
            } else {
              shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            
            if (shouldBeDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {
            // Fallback: do nothing if there's an error
          }
        })();
      `,
      type: 'text/javascript'
    }
  ]
})
</script>

<style>
/* Global styles are handled through the theme system in assets/css/main.css */
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

/* Prevent layout shift during theme initialization */
html {
  background-color: #ffffff;
}

html.dark {
  background-color: #0f172a;
}

/* Ensure body follows the theme immediately */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
</style>
