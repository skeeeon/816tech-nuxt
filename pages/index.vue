<template>
  <div>
    <HeroSection />
    <SolutionsSection />
    <ApproachSection />
    <AboutSection />
    
    <!-- Enhanced Contact section with consistent styling -->
    <section id="contact" class="section contact-section" 
             style="background-color: #2563eb !important;">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: #ffffff !important;">
          Ready to Transform Your Operations?
        </h2>
        <p class="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90" 
           style="color: #ffffff !important;">
          Let's discuss how 816tech can solve your business challenges and drive measurable results. 
          Contact us for a free consultation and discover what's possible.
        </p>
        
        <!-- Contact options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div v-for="(contact, index) in contactOptions" :key="`contact-${index}`" 
               class="contact-option">
            <div class="contact-icon mb-4">
              <component :is="contact.iconComponent" class="w-8 h-8 mx-auto" style="color: #ffffff !important;" />
            </div>
            <h3 class="text-xl font-semibold mb-2" style="color: #ffffff !important;">{{ contact.title }}</h3>
            <p class="mb-4 opacity-80" style="color: #ffffff !important;">{{ contact.description }}</p>
            <NuxtLink :to="contact.href" 
                      class="btn bg-white hover:bg-gray-100 text-blue-600 font-medium"
                      :external="contact.external"
                      @click="handleContactClick(contact.type)">
              {{ contact.action }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * Main landing page for 816tech
 * Comprehensive SEO implementation with structured data
 * Uses centralized navigation and tracking for consistent behavior
 * FIXED: Contact section with consistent background color
 */

// Import Heroicons
import { PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/vue/24/outline'

// Import sections - using explicit imports for consistency
import HeroSection from '~/components/sections/HeroSection.vue'
import SolutionsSection from '~/components/sections/SolutionsSection.vue'
import ApproachSection from '~/components/sections/ApproachSection.vue'
import AboutSection from '~/components/sections/AboutSection.vue'

// Use centralized tracking for contact interactions
const { trackContact } = useTracking()

// SEO Meta Tags
useSeoMeta({
  title: '816tech - Enterprise Technology Integration | Kansas City',
  description: 'Kansas City\'s trusted technology integration partner specializing in enterprise solutions using proven open-source technologies. System integration, custom development, and infrastructure design.',
  keywords: 'enterprise technology, system integration, Kansas City, Missouri, open source solutions, custom software development, technology consulting',
  author: '816tech',
  ogTitle: '816tech - Enterprise Technology Solutions in Kansas City',
  ogDescription: 'Transform your business operations with proven technology integration and custom solutions built on open-source platforms.',
  ogImage: '/images/816tech-og-image.jpg',
  ogUrl: 'https://816tech.com',
  ogType: 'website',
  ogSiteName: '816tech',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '@816tech',
  twitterTitle: '816tech - Enterprise Technology Integration | Kansas City',
  twitterDescription: 'Kansas City\'s trusted technology integration partner using open-source solutions.',
  twitterImage: '/images/816tech-og-image.jpg'
})

// Enhanced structured data for local business
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://816tech.com',
        name: '816tech',
        description: 'Enterprise technology integration and custom software solutions using open-source technologies',
        url: 'https://816tech.com',
        telephone: '+1-816-800-3299',
        email: 'info@816tech.com',
        foundingDate: '2020',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kansas City',
          addressRegion: 'MO',
          addressCountry: 'US'
        },
        areaServed: [
          { '@type': 'City', name: 'Kansas City' },
          { '@type': 'State', name: 'Missouri' },
          { '@type': 'State', name: 'Kansas' },
          { '@type': 'Place', name: 'Midwest United States' }
        ],
        serviceType: [
          'System Integration',
          'Custom Software Development',
          'Enterprise Technology Consulting',
          'Infrastructure Design',
          'Open Source Solutions',
          'Business Automation',
          'Technology Modernization'
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Technology Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'System Integration',
                description: 'Connect disparate systems and create unified enterprise ecosystems'
              }
            },
            {
              '@type': 'Offer', 
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Software Development',
                description: 'Tailored applications and interfaces built with open-source technologies'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service', 
                name: 'Infrastructure Design',
                description: 'Scalable technology infrastructure planning and implementation'
              }
            }
          ]
        },
        knowsAbout: [
          'Open Source Software',
          'Enterprise Architecture',
          'System Integration',
          'Linux Administration',
          'FreeBSD',
          'Docker',
          'Kubernetes',
          'Database Integration',
          'API Development',
          'Cloud Infrastructure'
        ],
        sameAs: [
          'https://www.linkedin.com/company/816tech',
          'https://twitter.com/816tech'
        ]
      })
    }
  ]
})

// Contact options for the enhanced contact section with Heroicon components
const contactOptions = [
  {
    type: 'phone',
    iconComponent: PhoneIcon,
    title: 'Call Us',
    description: 'Speak directly with our team about your needs',
    action: 'Call Now',
    href: 'tel:+18168003299',
    external: true
  },
  {
    type: 'email',
    iconComponent: EnvelopeIcon,
    title: 'Email Us',
    description: 'Send us details about your project for a detailed response',
    action: 'Send Email',
    href: 'mailto:info@816tech.com',
    external: true
  },
  {
    type: 'calendar',
    iconComponent: CalendarIcon,
    title: 'Schedule Meeting',
    description: 'Book a free consultation to discuss your requirements',
    action: 'Book Meeting',
    href: 'https://cal.com/816tech',
    external: true
  }
]

/**
 * Handle contact option clicks with consistent tracking
 * @param {string} contactType - Type of contact interaction
 */
const handleContactClick = (contactType) => {
  trackContact(contactType, {
    source: 'contact-section',
    location: 'main-page'
  })
}
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.contact-option {
  @apply p-6 rounded-lg;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.contact-option:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.contact-icon {
  transition: transform 0.3s ease;
}

.contact-option:hover .contact-icon {
  transform: scale(1.1);
}

/* Enhanced button styling for contact options */
.contact-option .btn {
  transition: all 0.2s ease;
}

.contact-option .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
