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
                        @click="trackFooterLink(link.text)">
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
                        @click="trackFooterLink(link.text)">
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
                <i :class="`pi ${contact.icon} mr-2`" 
                   :style="{ color: 'var(--color-primary)' }"></i>
                <NuxtLink v-if="contact.href" 
                          :to="contact.href" 
                          :external="contact.external"
                          class="transition-colors hover:text-primary-600"
                          :style="{ color: 'var(--color-content-secondary)' }"
                          @click="trackContactLink(contact.text)">
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
 * Updated for Nuxt 3 with enhanced tracking
 */
import Logo816tech from '~/components/common/Logo816tech.vue'

// Use tracking for footer interactions
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

// Contact information
const contactInfo = [
  { 
    icon: 'pi-map-marker', 
    text: 'Kansas City, MO',
    href: null,
    external: false
  },
  { 
    icon: 'pi-phone', 
    text: '(816) 800-3299',
    href: 'tel:+18168003299',
    external: true
  },
  { 
    icon: 'pi-envelope', 
    text: 'info@816tech.com',
    href: 'mailto:info@816tech.com',
    external: true
  }
]

/**
 * Track footer link clicks
 * @param {string} linkText - The text of the link clicked
 */
const trackFooterLink = (linkText) => {
  trackNavigation(linkText.toLowerCase().replace(/\s+/g, '-'), 'footer')
}

/**
 * Track contact link clicks
 * @param {string} contactText - The contact method clicked
 */
const trackContactLink = (contactText) => {
  let method = 'unknown'
  if (contactText.includes('@')) method = 'email'
  else if (contactText.includes('816')) method = 'phone'
  
  trackContact(method, { source: 'footer' })
}
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
