<template>
  <header class="sticky top-0 z-30 shadow-sm border-b" 
          :style="{ 
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)'
          }">
    <div class="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/" class="flex items-center transition-colors" 
                  aria-label="816tech - Return to top">
          <Logo816tech />
        </NuxtLink>
      </div>
      <TheNavbar />
    </div>
  </header>
</template>

<script setup>
/**
 * Main header component for 816tech
 * Contains the logo and main navigation
 * Fixed imports using Nuxt aliases for consistent resolution
 */

// Use Nuxt aliases for all component imports
import TheNavbar from '~/components/layout/TheNavbar.vue'
import Logo816tech from '~/components/common/Logo816tech.vue'
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
