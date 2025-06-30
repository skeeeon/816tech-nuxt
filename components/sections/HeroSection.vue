<template>
  <section 
    class="hero-section py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden"
  >
    <!-- Background image -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/kansas-city-dusk.jpg" 
        alt="Kansas City skyline at dusk" 
        class="w-full h-full object-cover"
      />
      <!-- Dark overlay for text readability -->
      <div 
        class="absolute inset-0"
        :style="{ 
          backgroundColor: isDarkMode ? 'rgba(7, 12, 21, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }"
      ></div>
    </div>
    
    <!-- Subtle tech pattern overlay -->
    <div class="absolute inset-0 opacity-5 z-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tech-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="2" fill="#ffffff" />
            <circle cx="10" cy="10" r="1" fill="#ffffff" />
            <circle cx="50" cy="50" r="1" fill="#ffffff" />
            <line x1="30" y1="30" x2="10" y2="10" stroke="#ffffff" stroke-width="0.5" />
            <line x1="30" y1="30" x2="50" y2="50" stroke="#ffffff" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tech-pattern)" />
      </svg>
    </div>
    
    <!-- Content -->
    <div class="container mx-auto px-4 relative z-20">
      <div class="max-w-4xl">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white">
          Enterprise Technology<br>
          <span class="text-blue-400">Built on Open Standards</span>
        </h1>
        <p class="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl text-gray-200">
          Kansas City's trusted partner for infrastructure, integration, and innovation. 
          We architect robust solutions using proven open-source technologies that scale with your business.
        </p>
        
        <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <button 
            @click="navigateToContact('hero-consultation')" 
            class="btn btn-primary"
            aria-label="Schedule a consultation with 816tech">
            Schedule Consultation
          </button>
          <button 
            @click="scrollToSection('solutions', 'hero-explore')" 
            class="btn btn-secondary-light"
            aria-label="Explore 816tech services">
            <Squares2X2Icon class="w-5 h-5 mr-2" />
            Explore Services
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * Hero section component for 816tech
 * Features Kansas City skyline background with open-source expertise messaging
 * Uses centralized navigation composable for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import { Squares2X2Icon } from '@heroicons/vue/24/outline'

// Use theme composable
const { isDarkMode } = useTheme()

// Use centralized navigation logic
const { scrollToSection, navigateToContact } = useNavigation()
</script>

<style scoped>
.container {
  max-width: 1280px;
}

/* Hero section specific styles */
.hero-section {
  min-height: 600px;
}

/* Light variant button for better contrast on dark background */
.btn-secondary-light {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-all duration-200;
  min-height: 44px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.btn-secondary-light:hover {
  background-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Ensure proper image loading and display */
.hero-section img {
  filter: brightness(0.9);
}

/* Media query for larger screens */
@media (min-width: 768px) {
  .hero-section {
    min-height: 700px;
  }
}
</style>
