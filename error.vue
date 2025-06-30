<template>
  <div class="min-h-screen flex items-center justify-center theme-transition"
       :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    <div class="max-w-md mx-auto text-center px-4">
      <!-- Error illustration -->
      <div class="mb-8">
        <div class="error-icon mx-auto" 
             :style="{ 
               color: error.statusCode === 404 ? 'var(--color-warning)' : 'var(--color-error)',
               backgroundColor: (error.statusCode === 404 ? 'var(--color-warning)' : 'var(--color-error)') + '15'
             }">
          <MagnifyingGlassIcon v-if="error.statusCode === 404" class="w-10 h-10" />
          <ExclamationTriangleIcon v-else class="w-10 h-10" />
        </div>
      </div>

      <!-- Error message -->
      <h1 class="text-4xl font-bold mb-4" 
          :style="{ color: 'var(--color-content-primary)' }">
        {{ error.statusCode }}
      </h1>
      
      <h2 class="text-xl font-semibold mb-4" 
          :style="{ color: 'var(--color-content-primary)' }">
        {{ errorTitle }}
      </h2>
      
      <p class="text-base mb-8" 
         :style="{ color: 'var(--color-content-secondary)' }">
        {{ errorMessage }}
      </p>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/" class="btn btn-primary">
          <HomeIcon class="w-5 h-5 mr-2" />
          Return Home
        </NuxtLink>
        
        <button @click="handleError" class="btn btn-outlined">
          <ArrowPathIcon class="w-5 h-5 mr-2" />
          Try Again
        </button>
      </div>

      <!-- Contact information for persistent errors -->
      <div v-if="error.statusCode >= 500" 
           class="mt-8 p-4 rounded-lg" 
           :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
        <p class="text-sm mb-2" 
           :style="{ color: 'var(--color-content-secondary)' }">
          If this problem persists, please contact us:
        </p>
        <NuxtLink to="mailto:info@816tech.com" 
                  class="text-sm font-medium hover:underline"
                  :style="{ color: 'var(--color-primary)' }"
                  external>
          info@816tech.com
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Error page component for 816tech
 * Handles various error states with appropriate messaging and actions
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Get error from Nuxt
const props = defineProps({
  error: Object
})

// Computed properties for error messaging
const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 500:
      return 'Server Error'
    case 403:
      return 'Access Forbidden'
    default:
      return 'Something Went Wrong'
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "The page you're looking for doesn't exist. It may have been moved or deleted."
    case 500:
      return "We're experiencing technical difficulties. Our team has been notified and is working on a fix."
    case 403:
      return "You don't have permission to access this resource."
    default:
      return "An unexpected error occurred. Please try again or contact support if the problem persists."
  }
})

// Error handling function
const handleError = async () => {
  try {
    // Clear the error and try to reload
    await clearError({ redirect: '/' })
  } catch (err) {
    // If clearing error fails, force reload
    if (import.meta.client) {
      window.location.reload()
    }
  }
}

// SEO for error pages
useSeoMeta({
  title: `${props.error?.statusCode || 'Error'} - 816tech`,
  description: errorMessage.value,
  robots: 'noindex, nofollow'
})

// Track error for analytics
const { trackCustomEvent } = useTracking()

onMounted(() => {
  trackCustomEvent('error-page-view', {
    statusCode: props.error?.statusCode || 'unknown',
    path: props.error?.url || 'unknown'
  })
})
</script>

<style scoped>
.error-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.theme-transition {
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}
</style>
