/**
 * Navigation composable for 816tech
 * Centralizes navigation logic to follow DRY principles
 * Provides consistent navigation behavior across all components
 * FIXED: Blog navigation now works correctly with proper routing
 */

export const useNavigation = () => {
  // Use tracking for navigation events
  const { trackNavigation, trackCTA } = useTracking()

  // Navigation items - centralized configuration
  // Items with 'id' are hash-based sections on homepage
  // Items with 'path' are separate pages
  const navItems = [
    { id: 'solutions', label: 'Solutions' },
    { id: 'approach', label: 'Our Approach' },
    { id: 'about', label: 'About' },
    { path: '/blog', label: 'Blog' } // This is a real route, not a hash section
  ]

  /**
   * Enhanced smooth scroll to section with consistent tracking
   * @param {string} sectionId - ID of the section to scroll to
   * @param {string} source - Source of the navigation (for tracking)
   * @param {boolean} isCTA - Whether this is a CTA interaction
   */
  const scrollToSection = (sectionId, source = 'navigation', isCTA = false) => {
    // Track navigation
    trackNavigation(sectionId, source)
    
    // Track CTA if applicable
    if (isCTA) {
      trackCTA(`${source}-${sectionId}`)
    }
    
    // Use Nuxt navigation with hash
    navigateTo(`/#${sectionId}`)
    
    // Smooth scroll for immediate UX
    if (import.meta.client) {
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          const headerOffset = 80 // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }

  /**
   * Navigate to contact section with CTA tracking
   * @param {string} source - Source of the CTA click
   */
  const navigateToContact = (source = 'cta') => {
    scrollToSection('contact', source, true)
  }

  /**
   * Check if element is in viewport
   * @param {Element} element - Element to check
   * @param {number} threshold - Visibility threshold (0-1)
   * @returns {boolean} Whether element is visible
   */
  const isElementInViewport = (element, threshold = 0.1) => {
    if (!element) return false
    
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                       ((rect.top + rect.height) >= windowHeight * threshold)
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && 
                      ((rect.left + rect.width) >= windowWidth * threshold)
    
    return vertInView && horInView
  }

  /**
   * Setup intersection observer for section tracking
   * @param {Function} callback - Callback function when sections come into view
   * @param {Object} options - Intersection observer options
   * @returns {Function} Cleanup function
   */
  const setupSectionObserver = (callback, options = {}) => {
    if (!import.meta.client) return () => {}
    
    const defaultOptions = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    }
    
    const observerOptions = { ...defaultOptions, ...options }
    
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= observerOptions.threshold) {
          callback(entry.target.id, entry)
        }
      })
    }, observerOptions)
    
    sections.forEach(section => observer.observe(section))
    
    // Return cleanup function
    return () => {
      observer.disconnect()
    }
  }

  return {
    navItems,
    scrollToSection,
    navigateToContact,
    isElementInViewport,
    setupSectionObserver
  }
}
