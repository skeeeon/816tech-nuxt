<template>
  <div class="card-page">
    
    <!-- Loading state -->
    <div v-if="pending" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <div class="animate-pulse">
          <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <p :style="{ color: 'var(--color-content-secondary)' }">
            Loading business card...
          </p>
        </div>
      </div>
    </div>

    <!-- Error state (card not found) -->
    <div v-else-if="error || !card" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="error-icon mx-auto mb-6" 
             :style="{ 
               color: 'var(--color-warning)',
               backgroundColor: 'var(--color-warning)' + '15'
             }">
          <MagnifyingGlassIcon class="w-12 h-12" />
        </div>
        <h1 class="text-2xl font-bold mb-4" 
            :style="{ color: 'var(--color-content-primary)' }">
          Card Not Found
        </h1>
        <p class="text-base mb-8" 
           :style="{ color: 'var(--color-content-secondary)' }">
          The business card you're looking for doesn't exist or may have been moved.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/cards" class="btn btn-primary">
            View All Cards
          </NuxtLink>
          <NuxtLink to="/" class="btn btn-outlined">
            Visit 816tech
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Card content -->
    <div v-else class="card-content">
      <!-- Main card content -->
      <div class="py-8">
        <BusinessCard 
          :card="card" 
          @showQR="showQRModal = true" 
        />
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal 
        :show="showQRModal"
        :card-url="cardShareUrl"
        :card-title="`${card.name} - ${card.company}`"
        @close="showQRModal = false"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * Individual business card page
 * Displays a single team member's business card with full functionality
 * Uses minimal card layout for clean sharing experience
 */

// Define layout
definePageMeta({
  layout: 'card'
})

// Import Heroicons
import {
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// Import components
import BusinessCard from '~/components/cards/BusinessCard.vue'
import QRCodeModal from '~/components/cards/QRCodeModal.vue'

// Use composables
const { getCard, getCardShareUrl, resolveImagePath } = useCardData()
const { trackCustomEvent } = useTracking()
const route = useRoute()

// Get card slug from route
const cardSlug = route.params.slug

// Fetch card data
const { data: card, pending, error } = await useLazyAsyncData(
  `card-${cardSlug}`,
  () => getCard(cardSlug),
  {
    // SSG compatibility: return null for unknown cards to trigger 404
    default: () => null
  }
)

// Modal state
const showQRModal = ref(false)

// Computed properties
const cardShareUrl = computed(() => {
  if (!card.value) return ''
  return getCardShareUrl(card.value.slug)
})

// Handle 404 for unknown cards
if (!pending.value && !card.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Business card not found'
  })
}

// Dynamic SEO based on card data
watchEffect(() => {
  if (card.value) {
    useSeoMeta({
      title: `${card.value.name} - ${card.value.title} | 816tech`,
      description: `Connect with ${card.value.name}, ${card.value.title} at ${card.value.company}. ${card.value.description}`,
      keywords: `${card.value.name}, ${card.value.company}, business card, contact, ${card.value.title}`,
      ogTitle: `${card.value.name} - Digital Business Card`,
      ogDescription: `${card.value.title} at ${card.value.company}`,
      ogType: 'profile',
      ogUrl: cardShareUrl.value,
      twitterCard: 'summary',
      twitterTitle: `${card.value.name} - ${card.value.title}`,
      twitterDescription: `Connect with ${card.value.name} at ${card.value.company}`,
      // Business card specific meta
      'profile:first_name': card.value.name.split(' ')[0],
      'profile:last_name': card.value.name.split(' ').slice(1).join(' '),
      'business:contact_data:locality': card.value.location.split(',')[0]?.trim(),
      'business:contact_data:region': card.value.location.split(',')[1]?.trim().split(' ')[0]
    })

    // Add structured data for person
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: card.value.name,
            jobTitle: card.value.title,
            worksFor: {
              '@type': 'Organization',
              name: card.value.company,
              url: 'https://816tech.com'
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: card.value.location.split(',')[0]?.trim(),
              addressRegion: card.value.location.split(',')[1]?.trim()
            },
            contactPoint: [
              card.value.contacts.email && {
                '@type': 'ContactPoint',
                contactType: 'email',
                email: card.value.contacts.email.value
              },
              card.value.contacts.mobile && {
                '@type': 'ContactPoint',
                contactType: 'mobile',
                telephone: card.value.contacts.mobile.value
              }
            ].filter(Boolean),
            url: cardShareUrl.value
          })
        }
      ]
    })
  }
})

// Track page view
onMounted(() => {
  if (card.value) {
    trackCustomEvent('card-view', { 
      cardSlug: card.value.slug,
      cardName: card.value.name 
    })
  }
})

// Load QR code library for modal
onMounted(() => {
  if (import.meta.client && typeof window.QRCode === 'undefined') {
    // Load QR code library if not already loaded
    const script = document.createElement('script')
    script.src = '/qrcode.min.js' // Make sure this file exists in /public/
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.card-page {
  min-height: calc(100vh - 200px); /* Account for layout header/footer */
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Enhanced button styling */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outlined:hover {
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}
</style>
