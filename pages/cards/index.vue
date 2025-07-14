<template>
  <div class="cards-index-page">
    <!-- Page header content -->
    <div class="page-header py-8 text-center">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold mb-2" 
            :style="{ color: 'var(--color-content-primary)' }">
          Team Directory
        </h1>
        <p class="text-base" 
           :style="{ color: 'var(--color-content-secondary)' }">
          Connect with our team members
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading state -->
        <div v-if="pending" class="text-center">
          <div class="animate-pulse">
            <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p :style="{ color: 'var(--color-content-secondary)' }">
              Loading team cards...
            </p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center">
          <div class="error-icon mx-auto mb-4" 
               :style="{ 
                 color: 'var(--color-error)',
                 backgroundColor: 'var(--color-error)' + '15'
               }">
            <ExclamationTriangleIcon class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-semibold mb-2" 
              :style="{ color: 'var(--color-content-primary)' }">
            Unable to Load Cards
          </h2>
          <p class="mb-4" 
             :style="{ color: 'var(--color-content-secondary)' }">
            There was a problem loading the team directory.
          </p>
          <button @click="refresh()" class="btn btn-primary">
            Try Again
          </button>
        </div>

        <!-- Cards grid -->
        <div v-else-if="cards && cards.length > 0" class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div v-for="card in cards" :key="card.slug" 
                 class="card-preview group">
              <NuxtLink :to="`/cards/${card.slug}`" 
                        class="card-link block p-8 rounded-xl transition-all duration-200 border"
                        :style="{ 
                          backgroundColor: 'var(--color-surface-secondary)',
                          borderColor: 'var(--color-border-primary)'
                        }"
                        @click="handleCardClick(card.slug)">
                
                <!-- Card header -->
                <div class="text-center mb-6">
                  <div class="card-avatar mx-auto mb-4" 
                       :style="{ 
                         backgroundColor: 'var(--color-primary)' + '15',
                         color: 'var(--color-primary)'
                       }">
                    <img v-if="resolveImagePath(card.image)" 
                         :src="resolveImagePath(card.image)" 
                         :alt="`${card.name} headshot`"
                         class="card-avatar-image"
                         @error="handleCardImageError"
                         @load="handleCardImageLoad">
                    <UserIcon v-else class="w-10 h-10" />
                  </div>
                  
                  <h3 class="text-xl font-bold mb-2" 
                      :style="{ color: 'var(--color-content-primary)' }">
                    {{ card.name }}
                  </h3>
                  <p class="text-base mb-1" 
                     :style="{ color: 'var(--color-content-secondary)' }">
                    {{ card.title }}
                  </p>
                  <p class="text-sm mb-6" 
                     :style="{ color: 'var(--color-content-tertiary)' }">
                    {{ card.company }}
                  </p>
                </div>

                <!-- View card button -->
                <div class="view-indicator text-center">
                  <div class="view-btn inline-flex items-center px-6 py-3 rounded-lg font-medium text-sm"
                       :style="{ 
                         backgroundColor: 'var(--color-primary)',
                         color: 'white'
                       }">
                    View Business Card
                    <svg class="w-4 h-4 ml-2" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center">
          <div class="empty-icon mx-auto mb-4" 
               :style="{ 
                 color: 'var(--color-content-tertiary)',
                 backgroundColor: 'var(--color-surface-secondary)'
               }">
            <UserGroupIcon class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-semibold mb-2" 
              :style="{ color: 'var(--color-content-primary)' }">
            No Cards Available
          </h2>
          <p :style="{ color: 'var(--color-content-secondary)' }">
            There are currently no team cards to display.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Cards index page - displays all available team business cards
 * Provides a directory-style view of team members
 * Uses minimal card layout for clean sharing experience
 */

// Define layout
definePageMeta({
  layout: 'card'
})

// Import Heroicons
import {
  UserIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Use composables
const { getAllCards, resolveImagePath } = useCardData()
const { trackNavigation, trackCustomEvent } = useTracking()

// Page data
const { data: cards, pending, error, refresh } = await useLazyAsyncData('all-cards', getAllCards)

/**
 * Handle card click for analytics
 * @param {string} cardSlug - Slug of the clicked card
 */
const handleCardClick = (cardSlug) => {
  trackNavigation('card-detail', 'cards-index')
  trackCustomEvent('card-preview-click', { cardSlug })
}

/**
 * Handle card image loading errors
 */
const handleCardImageError = (event) => {
  // Hide the image and show the icon instead
  event.target.style.display = 'none'
  console.error('Failed to load card image:', event.target.src)
}

/**
 * Handle successful card image loading
 */
const handleCardImageLoad = (event) => {
  console.log('Successfully loaded card image:', event.target.src)
}

// SEO meta tags
useSeoMeta({
  title: 'Team Directory - 816tech Digital Business Cards',
  description: 'Connect with 816tech team members through our digital business card directory.',
  robots: 'noindex, nofollow', // Keep directory private
  ogTitle: '816tech Team Directory',
  ogDescription: 'Digital business cards for 816tech team members',
  ogType: 'website'
})

// Track page view
onMounted(() => {
  trackCustomEvent('cards-index-view', { 
    cardCount: cards.value?.length || 0 
  })
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.cards-index-page {
  min-height: calc(100vh - 200px); /* Account for layout header/footer */
}

.card-preview {
  /* No transition - static styling */
}

.card-link {
  /* Default state is the previous "hovered" state */
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.dark .card-link {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* Default state includes the border */
  border: 3px solid var(--color-primary);
  transform: scale(1.05);
}

.card-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.view-btn {
  /* Clean, simple button styling - no shine effects */
  transition: opacity 0.2s ease;
}

.view-btn:hover {
  opacity: 0.9;
}

.error-icon,
.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .card-avatar {
    width: 70px;
    height: 70px;
  }
  
  .card-link {
    padding: 1.5rem;
  }
  
  .view-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .cards-index-page .grid {
    grid-template-columns: 1fr;
  }
}
</style>
