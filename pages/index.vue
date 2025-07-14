<template>
  <div>
    <HeroSection />
    <SolutionsSection />
    <ApproachSection />
    <AboutSection />
    
    <!-- Enhanced Contact section with proper styling -->
    <section id="contact" class="section bg-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Transform Your Operations?
        </h2>
        <p class="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          Let's discuss how 816tech can solve your business challenges and drive measurable results. 
          Contact us for a free consultation and discover what's possible.
        </p>
        
        <!-- Contact options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div v-for="(contact, index) in contactOptions" :key="`contact-${index}`" 
               class="contact-option p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
            <div class="contact-icon mb-4 transform hover:scale-110 transition-transform duration-300">
              <component :is="contact.iconComponent" class="w-8 h-8 mx-auto text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-2 text-white">{{ contact.title }}</h3>
            <p class="mb-4 text-blue-100">{{ contact.description }}</p>
            <NuxtLink :to="contact.href" 
                      class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
 * Comprehensive SEO implementation with enhanced structured data
 * Uses centralized navigation and tracking for consistent behavior
 * UPDATED: Contact section with proper styling (no !important overrides)
 * UPDATED: Enhanced structured data for better SEO
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
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogUrl: 'https://816tech.com',
  ogType: 'website',
  ogSiteName: '816tech',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '@816tech',
  twitterCreator: '@816tech',
  twitterTitle: '816tech - Enterprise Technology Integration | Kansas City',
  twitterDescription: 'Kansas City\'s trusted technology integration partner using open-source solutions.',
  twitterImage: '/images/816tech-og-image.jpg',
  // Local business specific meta tags
  'business:contact_data:locality': 'Kansas City',
  'business:contact_data:region': 'Missouri',
  'business:contact_data:country_name': 'United States',
  'business:contact_data:postal_code': '64105',
  'business:contact_data:street_address': '710 Central St'
})

// Enhanced structured data with multiple schema types
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
          streetAddress: '710 Central St',
          addressLocality: 'Kansas City',
          addressRegion: 'MO',
          postalCode: '64105',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '39.1012',
          longitude: '-94.5844'
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
                description: 'Connect disparate systems and create unified enterprise ecosystems',
                category: 'Enterprise Software'
              }
            },
            {
              '@type': 'Offer', 
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Software Development',
                description: 'Tailored applications and interfaces built with open-source technologies',
                category: 'Software Development'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service', 
                name: 'Infrastructure Design',
                description: 'Scalable technology infrastructure planning and implementation',
                category: 'IT Infrastructure'
              }
            }
          ]
        },
        priceRange: '$$',
        paymentAccepted: ['Cash', 'Credit Card', 'Check', 'Invoice'],
        currenciesAccepted: 'USD',
        openingHours: 'Mo-Fr 08:00-17:00',
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
    },
    // Enhanced Service structured data
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        'provider': {
          '@type': 'LocalBusiness',
          'name': '816tech',
          '@id': 'https://816tech.com'
        },
        'serviceType': 'Technology Integration Services',
        'description': 'Enterprise technology integration and custom software solutions using proven open-source technologies',
        'areaServed': [
          {
            '@type': 'State',
            'name': 'Missouri'
          },
          {
            '@type': 'State', 
            'name': 'Kansas'
          }
        ],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Technology Services',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'System Integration',
                'description': 'Connect disparate systems and create unified enterprise ecosystems',
                'category': 'Enterprise Software'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Custom Development',
                'description': 'Tailored applications built with open-source technologies',
                'category': 'Software Development'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Infrastructure Design', 
                'description': 'Scalable technology infrastructure planning and implementation',
                'category': 'IT Infrastructure'
              }
            }
          ]
        }
      })
    },
    // Organization structured data
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://816tech.com/#organization',
        name: '816tech',
        url: 'https://816tech.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://816tech.com/images/816tech-logo.png',
          width: 200,
          height: 250
        },
        description: 'Enterprise technology integration using open-source solutions',
        foundingDate: '2020',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '710 Central St',
          addressLocality: 'Kansas City',
          addressRegion: 'MO',
          postalCode: '64105',
          addressCountry: 'US'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-816-800-3299',
          contactType: 'customer service',
          availableLanguage: 'English',
          email: 'info@816tech.com'
        }
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

/* Enhanced contact section styling without !important overrides */
.contact-option {
  transition: all 0.3s ease;
}

.contact-option:hover {
  transform: translateY(-2px);
}

.contact-icon {
  transition: transform 0.3s ease;
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
