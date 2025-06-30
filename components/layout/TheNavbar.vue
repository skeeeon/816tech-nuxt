<template>
  <!-- Desktop Navigation -->
  <nav class="hidden md:flex items-center space-x-6">
    <NuxtLink v-for="(item, index) in navItems" :key="`nav-desktop-${index}`"
              :to="`/#${item.id}`" 
              @click.prevent="scrollToSection(item.id, 'navbar')"
              class="text-base font-medium py-2 px-3 rounded-md transition-colors duration-200"
              :style="{ 
                color: 'var(--color-content-primary)',
                ':hover': { color: 'var(--color-primary)' }
              }"
              :aria-label="`Go to ${item.label} section`">
      {{ item.label }}
    </NuxtLink>
    <ThemeToggle class="mr-2" />
    <button 
      @click="navigateToContact('navbar-get-started')" 
      class="btn btn-primary"
      aria-label="Contact 816tech">
      Get Started
    </button>
  </nav>
  
  <!-- Mobile Navigation -->
  <div class="flex items-center space-x-3 md:hidden">
    <ThemeToggle />
    <button 
      class="p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
      :style="{ 
        backgroundColor: showMobileMenu ? 'var(--color-surface-secondary)' : 'transparent',
        color: 'var(--color-content-primary)'
      }"
      aria-label="Toggle mobile menu"
      :aria-expanded="showMobileMenu ? 'true' : 'false'"
      @click="toggleMobileMenu"
    >
      <XMarkIcon v-if="showMobileMenu" class="w-5 h-5" />
      <Bars3Icon v-else class="w-5 h-5" />
    </button>
    
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      aria-hidden="true"
      @click="closeMobileMenu"
    ></div>
    
    <!-- Mobile Menu Panel -->
    <transition name="mobile-menu">
      <div v-if="showMobileMenu" 
           class="fixed top-0 right-0 h-full w-64 sm:w-80 shadow-xl z-50 p-4 overflow-y-auto border-l"
           :style="{ 
             backgroundColor: 'var(--color-surface-primary)',
             borderColor: 'var(--color-border-primary)'
           }"
           role="dialog"
           aria-modal="true"
           aria-label="Mobile navigation menu">
        <div class="flex justify-between items-center mb-8 pb-4 border-b" 
             :style="{ borderBottomColor: 'var(--color-border-primary)' }">
          <Logo816tech size="sm" />
          <button 
            class="p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
            :style="{ 
              backgroundColor: 'var(--color-surface-secondary)',
              color: 'var(--color-content-primary)'
            }"
            aria-label="Close menu"
            @click="closeMobileMenu" 
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex flex-col space-y-2">
          <NuxtLink v-for="(item, index) in navItems" :key="`nav-mobile-${index}`"
                    :to="`/#${item.id}`" 
                    @click.prevent="scrollToSectionAndCloseMenu(item.id)" 
                    class="mobile-nav-item rounded-lg transition-colors"
                    :style="{ 
                      color: 'var(--color-content-primary)',
                      ':hover': { backgroundColor: 'var(--color-surface-hover)' }
                    }"
                    :aria-label="`Go to ${item.label} section`">
            {{ item.label }}
          </NuxtLink>
          
          <div class="pt-4 mt-2 border-t" 
               :style="{ borderColor: 'var(--color-border-primary)' }">
            <button 
              @click="scrollToSectionAndCloseMenu('contact', true)" 
              class="btn btn-primary w-full justify-center"
              aria-label="Contact 816tech">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * Navigation component for 816tech with centralized navigation logic
 * Uses the navigation composable for DRY code and consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import { XMarkIcon, Bars3Icon } from '@heroicons/vue/24/outline'

// Import components using Nuxt aliases
import ThemeToggle from '~/components/common/ThemeToggle.vue'
import Logo816tech from '~/components/common/Logo816tech.vue'

// Use centralized navigation logic
const { navItems, scrollToSection, navigateToContact } = useNavigation()

// Mobile menu state management
const showMobileMenu = ref(false)
const originalOverflow = ref(null)

/**
 * Toggle mobile menu visibility
 */
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  
  if (import.meta.client) {
    // Store original overflow setting before changing it
    if (showMobileMenu.value) {
      originalOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      restoreBodyScroll()
    }
  }
}

/**
 * Close mobile menu
 */
const closeMobileMenu = () => {
  showMobileMenu.value = false
  restoreBodyScroll()
}

/**
 * Restore body scroll when closing menu
 */
const restoreBodyScroll = () => {
  if (import.meta.client) {
    // Reset to original overflow or empty string if originalOverflow was null
    document.body.style.overflow = originalOverflow.value || ''
  }
}

/**
 * Scroll to section and close mobile menu
 * @param {string} sectionId - ID of the section to scroll to
 * @param {boolean} isCTA - Whether this is a CTA interaction
 */
const scrollToSectionAndCloseMenu = (sectionId, isCTA = false) => {
  closeMobileMenu()
  if (isCTA) {
    navigateToContact('mobile-menu')
  } else {
    scrollToSection(sectionId, 'mobile-menu')
  }
}

// Handle escape key to close menu
const handleEscKey = (event) => {
  if (event.key === 'Escape' && showMobileMenu.value) {
    closeMobileMenu()
  }
}

// Setup event listeners
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleEscKey)
  }
})

// Clean up event listeners
onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscKey)
    restoreBodyScroll()
  }
})
</script>

<style scoped>
.mobile-nav-item {
  @apply py-3 px-4 block w-full text-left;
  min-height: 44px;
}

/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
  
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Hover effects */
.mobile-nav-item:hover {
  background-color: var(--color-surface-hover);
}

a:hover {
  color: var(--color-primary) !important;
}
</style>
