/**
 * Composable for theme management in Nuxt
 * Provides reactive state and methods for theme management with SSR support
 * FIXED: Simplified to prevent SSR issues while still preventing FOUC
 * 
 * @returns {Object} Theme utilities and state
 */
export function useTheme() {
  // Use Nuxt's state management for SSR compatibility
  const currentTheme = useState('theme', () => 'auto')
  
  // Track system preference with ref for reactivity
  const systemPrefersDark = ref(false)
  
  /**
   * Computed property to determine if dark mode is active
   * Returns true if theme is 'dark' or if theme is 'auto' and system prefers dark
   */
  const isDarkMode = computed(() => {
    return currentTheme.value === 'dark' || 
      (currentTheme.value === 'auto' && systemPrefersDark.value)
  })
  
  /**
   * Initialize theme based on saved preferences and system settings
   * FIXED: Avoid duplicate theme application that causes flash
   */
  const initTheme = () => {
    // Only run on client side
    if (import.meta.client) {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      systemPrefersDark.value = mediaQuery.matches
      
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem('816tech-theme')
      
      // Validate and set theme (but don't apply - inline script already did)
      if (['dark', 'light', 'auto'].includes(savedTheme)) {
        currentTheme.value = savedTheme
      } else {
        currentTheme.value = 'auto'
      }
      
      // DON'T apply theme here - inline script already applied it
      // This prevents the flash: applyTheme()
      
      // Set up listener for system preference changes
      const updateSystemPreference = (e) => {
        systemPrefersDark.value = e.matches
        
        // Apply theme when system preference changes
        applyTheme()
        
        // Dispatch event for cross-component communication
        window.dispatchEvent(new CustomEvent('system-theme-changed', {
          detail: { isDark: e.matches }
        }))
      }
      
      // Register event listener with compatibility for older browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateSystemPreference)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(updateSystemPreference)
      }
      
      // Clean up on unmount
      onUnmounted(() => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateSystemPreference)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(updateSystemPreference)
        }
      })
    }
  }
  
  /**
   * Set the theme to light, dark, or auto
   * @param {string} theme - The theme to set ('light', 'dark', or 'auto')
   */
  const setTheme = (theme) => {
    // Validate theme value
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'.`)
      return
    }

    currentTheme.value = theme
    saveTheme()
    applyTheme()
    
    // Track theme change
    if (import.meta.client) {
      const { trackThemeChange } = useTracking()
      trackThemeChange(theme)
      
      // Emit theme changed event
      window.dispatchEvent(new CustomEvent('theme-changed', { 
        detail: { theme } 
      }))
    }
  }
  
  /**
   * Toggle between light, dark, and auto themes
   * Cycles through themes in order: light -> dark -> auto -> light
   */
  const toggleTheme = () => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else if (currentTheme.value === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }
  
  /**
   * Save theme preference to localStorage
   */
  const saveTheme = () => {
    if (import.meta.client) {
      localStorage.setItem('816tech-theme', currentTheme.value)
    }
  }
  
  /**
   * Apply the theme to the document
   */
  const applyTheme = () => {
    if (import.meta.client) {
      const shouldBeDark = isDarkMode.value
      document.documentElement.classList.toggle('dark', shouldBeDark)
    }
  }
  
  // Watch for theme changes and apply them (but avoid initial duplicate application)
  watch(isDarkMode, (newIsDark, oldIsDark) => {
    if (import.meta.client) {
      // Only apply if this is actually a change, not the initial load
      if (oldIsDark !== undefined && oldIsDark !== newIsDark) {
        document.documentElement.classList.toggle('dark', newIsDark)
      }
    }
  })
  
  // Initialize theme on client mount
  onMounted(() => {
    initTheme()
  })
  
  // Return theme utilities and state
  return {
    // Current theme state
    currentTheme,
    isDarkMode,
    systemPrefersDark,
    
    // Theme change methods
    setLightTheme: () => setTheme('light'),
    setDarkTheme: () => setTheme('dark'),
    setSystemTheme: () => setTheme('auto'),
    toggleTheme,
    setTheme,
    
    // Utility methods
    initTheme
  }
}
