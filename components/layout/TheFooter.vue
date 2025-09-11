<template>
  <footer class="py-12 sm:py-16 border-t" 
          :style="{ 
            backgroundColor: 'var(--color-surface-secondary)',
            borderColor: 'var(--color-border-primary)'
          }">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        <!-- Company Info -->
        <div>
          <Logo816tech class="mb-4" />
          <p :style="{ color: 'var(--color-content-secondary)' }">
            Enterprise technology integration using proven open-source solutions. 
            Serving Kansas City and the greater Midwest region with reliable, scalable systems.
          </p>
        </div>
        
        <!-- Solutions -->
        <div>
          <h4 class="text-lg font-semibold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">Our Services</h4>
          <ul class="space-y-3">
            <li v-for="(link, index) in serviceLinks" :key="`service-${index}`">
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
              <div class="flex items-start py-1">
                <component :is="contact.iconComponent" 
                           class="w-4 h-4 mr-2 flex-shrink-0 mt-1" 
                           :style="{ color: 'var(--color-primary)' }" />
                <div class="flex-grow">
                  <NuxtLink v-if="contact.href" 
                            :to="contact.href" 
                            :external="contact.external"
                            class="transition-colors hover:text-primary-600 block"
                            :style="{ color: 'var(--color-content-secondary)' }"
                            @click="handleContactInteraction(contact.type, contact.text)">
                    <span>{{ contact.text }}</span>
                    <span v-if="contact.subtitle" 
                          class="block text-sm opacity-80">{{ contact.subtitle }}</span>
                  </NuxtLink>
                  <div v-else :style="{ color: 'var(--color-content-secondary)' }">
                    <span>{{ contact.text }}</span>
                    <span v-if="contact.subtitle" 
                          class="block text-sm opacity-80">{{ contact.subtitle }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Client Portal & Resources -->
        <div>
          <h4 class="text-lg font-semibold mb-4"
              :style="{ color: 'var(--color-content-primary)' }">Client Resources</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="https://816tech.invoicing.co/client"
                        external
                        target="_blank"
                        class="transition-colors block py-1 hover:text-primary-600 inline-flex items-center"
                        :style="{ color: 'var(--color-content-secondary)' }"
                        @click="handleBillingClick">
                <CreditCardIcon class="w-4 h-4 mr-2 flex-shrink-0" 
                                :style="{ color: 'var(--color-primary)' }" />
                <div>
                  <span>Billing Portal</span>
                  <span class="block text-sm opacity-80">Invoices & Payments</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <div class="flex items-start py-1">
                <ChatBubbleLeftEllipsisIcon class="w-4 h-4 mr-2 flex-shrink-0 mt-1" 
                                            :style="{ color: 'var(--color-primary)' }" />
                <div class="flex-grow">
                  <span :style="{ color: 'var(--color-content-secondary)' }">Support</span>
                  <span class="block text-sm opacity-80" 
                        :style="{ color: 'var(--color-content-secondary)' }">
                    Available during business hours
                  </span>
                </div>
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
 * Enhanced with client resources section including billing portal
 * Uses centralized navigation and tracking for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 * UPDATED: Added billing portal in dedicated "Client Resources" section
 */

// Import Heroicons
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CreditCardIcon, 
  ChatBubbleLeftEllipsisIcon 
} from '@heroicons/vue/24/outline'

// Import components using Nuxt aliases for consistency
import Logo816tech from '~/components/common/Logo816tech.vue'

// Use centralized navigation and tracking
const { scrollToSection } = useNavigation()
const { trackNavigation, trackContact, trackCustomEvent } = useTracking()

// Service links - focused on actual content that exists
const serviceLinks = [
  { text: 'System Integration', href: '/#solutions' },
  { text: 'Custom Development', href: '/#solutions' },
  { text: 'Infrastructure Design', href: '/#solutions' },
  { text: 'Our Approach', href: '/#approach' },
  { text: 'About 816tech', href: '/#about' }
]

// Contact information with enhanced tracking data and Heroicon components
const contactInfo = [
  { 
    iconComponent: MapPinIcon,
    text: '710 Central St',
    subtitle: 'Kansas City, MO 64105',
    href: 'https://maps.google.com/?q=710+Central+St,+Kansas+City,+MO+64105',
    external: true,
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

/**
 * Handle billing portal clicks with tracking
 */
const handleBillingClick = () => {
  trackCustomEvent('billing-portal-click', {
    source: 'footer',
    external_url: 'https://816tech.invoicing.co/client'
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
