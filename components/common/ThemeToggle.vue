<template>
  <div class="flex items-center space-x-1">
    <button 
      @click="toggleMode" 
      class="relative inline-flex items-center justify-center h-10 w-10 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
      :style="{ 
        backgroundColor: isDarkMode ? 'var(--color-surface-tertiary)' : 'rgba(59, 130, 246, 0.1)', 
        color: isDarkMode ? '#60a5fa' : 'var(--color-primary)' 
      }"
      :aria-label="`Toggle theme, currently ${themeLabel} mode`"
    >
      <!-- Icon transition with Heroicons - Fixed sizing to match original -->
      <transition name="theme-toggle" mode="out-in">
        <MoonIcon v-if="isDarkMode" class="w-5 h-5" aria-hidden="true" />
        <SunIcon v-else-if="currentTheme === 'light'" class="w-5 h-5" aria-hidden="true" />
        <ComputerDesktopIcon v-else class="w-5 h-5" aria-hidden="true" />
      </transition>
    </button>
    
    <!-- Theme label (optional, hidden on mobile) -->
    <span class="text-sm hidden md:inline" aria-hidden="true">{{ themeLabel }}</span>
  </div>
</template>

<script setup>
/**
 * Theme toggle component for 816tech
 * Provides a button to cycle between light, dark, and auto theme modes
 * Updated for Nuxt 3 with Heroicons and enhanced tracking
 * FIXED: Consistent visual sizing and improved theme detection
 */

// Import Heroicons
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

// Use the theme composable
const { currentTheme, isDarkMode, toggleTheme } = useTheme()

// Use tracking for theme changes
const { trackThemeChange } = useTracking()

/**
 * Toggle between light, dark, and system themes
 */
const toggleMode = () => {
  const oldTheme = currentTheme.value
  toggleTheme()
  
  // Track theme change
  trackThemeChange(currentTheme.value)
}

/**
 * Computed property for the theme label text
 * @returns {string} Current theme label
 */
const themeLabel = computed(() => {
  if (currentTheme.value === 'light') return 'Light'
  if (currentTheme.value === 'dark') return 'Dark'
  return 'Auto'
})
</script>

<style scoped>
/* Theme toggle animation - improved timing */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.theme-toggle-enter-from,
.theme-toggle-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(20deg);
}

/* Ensure button has consistent hover state */
button:hover {
  transform: scale(1.05);
  transition: all 0.2s ease;
}

/* Focus ring for accessibility */
button:focus-visible {
  ring-color: var(--color-primary);
  ring-offset-color: var(--color-surface-primary);
}
</style>
