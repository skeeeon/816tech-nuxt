<template>
  <footer class="py-12 sm:py-16 border-t" 
          :style="{ 
            backgroundColor: 'var(--color-surface-secondary)',
            borderColor: 'var(--color-border-primary)'
          }">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        <!-- Company Info -->
        <div>
          <Logo816tech class="mb-4" />
          <p :style="{ color: 'var(--color-content-secondary)' }">
            Modern enterprise solutions expertly implemented. Serving Kansas City and the greater Midwest region.
          </p>
        </div>
        
        <!-- Solutions -->
        <div>
          <h4 class="text-lg font-semibold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">Solutions</h4>
          <ul class="space-y-3">
            <li v-for="(link, index) in solutionLinks" :key="`solution-${index}`">
              <NuxtLink :to="link.href" 
                        class="transition-colors block py-1 hover:text-primary-600"
                        :style="{ color: 'var(--color-content-secondary)' }"
                        @click="handleFooterNavigation(link.text, link.href)">
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <!-- Industries -->
        <div>
          <h4 class="text-lg font-semibold mb-4"
              :style="{ color: 'var(--color-content-primary)' }">Industries</h4>
          <ul class="space-y-3">
            <li v-for="(link, index) in industryLinks" :key="`industry-${index}`">
              <NuxtLink :to="link.href" 
                        class="transition-colors block py-1 hover:text-primary-600"
                        :style="{ color: 'var(--color-content-secondary)' }"
                        @click="handleFooterNavigation(link.text, link.href)">
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <!-- Contact -->
        <div>
          <h4 class="text-lg font-semibold mb-4"
              :style="{ color: 'var(--color-content-primary)' }">Contact</h4>
          <ul class="space-y-3">
            <li v-for="(contact, index) in contactInfo" :key="`contact-${index}`">
              <div class="flex items-center py-1">
                <component :is="contact.iconComponent" 
                           class="w-4 h-4 mr-2 flex-shrink-0" 
                           :style="{ color: 'var(--color-primary)' }" />
                <NuxtLink v-if="contact.href" 
                          :to="contact.href" 
                          :external="contact.external"
                          class="transition-colors hover:text-primary-600"
                          :style="{ color: 'var(--color-content-secondary)' }"
                          @click="handleContactInteraction(contact.type, contact.text)">
                  {{ contact.text }}
                </NuxtLink>
                <span v-else :style="{ color: 'var(--color-content-secondary)' }">
                  {{ contact.text }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom section -->
      <div class="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t text-center" 
           :style="{ borderColor: 'var(--color-border-primary)' }">
        <p :style="{ color: 'var(--color-content-secondary)' }">
          © {{ new Date().getFullYear() }} 816tech. All rights reserved. Kansas City, Missouri.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
/**
 * Footer component for 816tech
 * Contains company information, solution categories, and contact details
 * Uses centralized navigation and tracking for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

// Import components using Nuxt aliases for consistency
import Logo816tech from '~/components/common/Logo816tech.vue'

// Use centralized navigation and tracking
const { scrollToSection } = useNavigation()
const { trackNavigation, trackContact } = useTracking()

// Solution links - focused on what 816tech does
const solutionLinks = [
  { text: 'System Integration', href: '/#solutions' },
  { text: 'Custom Development', href: '/#solutions' },
  { text: 'Infrastructure Design', href: '/#solutions' },
  { text: 'Ongoing Support', href: '/#approach' }
]

// Industry links - markets 816tech serves
const industryLinks = [
  { text: 'Manufacturing', href: '/#industries' },
  { text: 'Healthcare', href: '/#industries' },
  { text: 'Education', href: '/#industries' },
  { text: 'Commercial Real Estate', href: '/#industries' }
]

// Contact information with enhanced tracking data and Heroicon components
const contactInfo = [
  { 
    iconComponent: MapPinIcon,
    text: 'Kansas City, MO',
    href: null,
    external: false,
    type: 'location'
  },
  { 
    iconComponent: PhoneIcon,
    text: '(816) 800-3299',
    href: 'tel:+18168003299',
    external: true,
    type: 'phone'
  },
  { 
    iconComponent: EnvelopeIcon,
    text: 'info@816tech.com',
    href: 'mailto:info@816tech.com',
    external: true,
    type: 'email'
  }
]

/**
 * Handle footer navigation with consistent tracking
 * @param {string} linkText - The text of the link clicked
 * @param {string} href - The destination href
 */
const handleFooterNavigation = (linkText, href) => {
  // Extract section from href
  const section = href.split('#')[1] || 'unknown'
  
  // Use centralized navigation if it's an internal section
  if (href.startsWith('/#')) {
    scrollToSection(section, 'footer')
  } else {
    // Track external navigation
    trackNavigation(linkText.toLowerCase().replace(/\s+/g, '-'), 'footer')
  }
}

/**
 * Handle contact interactions with enhanced tracking
 * @param {string} contactType - The type of contact (phone, email, location)
 * @param {string} contactText - The contact text
 */
const handleContactInteraction = (contactType, contactText) => {
  trackContact(contactType, { 
    source: 'footer',
    value: contactText
  })
}
</script>

<style scoped>
.container {
  max-width: 1280px;
}

/* Enhanced hover effects */
a:hover {
  color: var(--color-primary) !important;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

/* Icon hover effects */
svg:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
