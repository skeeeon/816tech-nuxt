/**
 * SEO composables for 816tech
 * Provides structured data and SEO utilities
 */

/**
 * Local business structured data composable
 * Implements comprehensive schema.org markup for local SEO
 */
export const useLocalBusiness = () => {
  const structuredData = {
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
  }

  useHead({
    script: [{ type: 'application/ld+json', children: JSON.stringify(structuredData) }]
  })

  return { structuredData }
}

/**
 * Organization structured data
 * For brand and company information
 */
export const useOrganization = () => {
  const organizationData = {
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
      addressLocality: 'Kansas City',
      addressRegion: 'MO',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-816-800-3299',
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  }

  return { organizationData }
}

/**
 * Website structured data
 * For site-wide SEO markup
 */
export const useWebsite = () => {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://816tech.com/#website',
    url: 'https://816tech.com',
    name: '816tech - Enterprise Technology Integration',
    description: 'Kansas City technology integration partner specializing in open-source enterprise solutions',
    publisher: {
      '@id': 'https://816tech.com/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://816tech.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return { websiteData }
}

/**
 * Professional service structured data
 * For service-specific SEO
 */
export const useProfessionalService = () => {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://816tech.com/#service',
    name: '816tech Technology Integration Services',
    description: 'Professional enterprise technology integration and custom software development',
    provider: {
      '@id': 'https://816tech.com/#organization'
    },
    areaServed: {
      '@type': 'Place',
      name: 'Kansas City Metropolitan Area'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology Integration Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise System Integration',
            category: 'Technology Consulting'
          }
        }
      ]
    }
  }

  return { serviceData }
}

/**
 * Breadcrumb structured data utility
 * @param {Array} breadcrumbs - Array of breadcrumb objects
 */
export const useBreadcrumbs = (breadcrumbs = []) => {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }

  if (breadcrumbs.length > 0) {
    useHead({
      script: [{ type: 'application/ld+json', children: JSON.stringify(breadcrumbData) }]
    })
  }

  return { breadcrumbData }
}

/**
 * Enhanced meta tags for specific pages
 * @param {Object} options - SEO options
 */
export const useEnhancedSEO = (options = {}) => {
  const {
    title = '816tech - Enterprise Technology Integration | Kansas City',
    description = 'Kansas City\'s trusted technology integration partner using open-source solutions',
    keywords = 'enterprise technology, system integration, Kansas City, open source',
    ogImage = '/images/816tech-og-image.jpg',
    canonical = 'https://816tech.com'
  } = options

  useSeoMeta({
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonical }
    ]
  })
}
