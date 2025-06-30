/**
 * Navigation utilities for 816tech
 * Provides consistent navigation behavior across components
 */

/**
 * Smooth scroll to section with header offset
 * @param {string} sectionId - ID of the section to scroll to
 * @param {number} headerOffset - Offset for fixed header (default: 80)
 */
export const scrollToSection = (sectionId, headerOffset = 80) => {
  if (import.meta.client) {
    const element = document.getElementById(sectionId)
    if (element) {
      setTimeout(() => {
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
 * Navigate with hash and smooth scroll
 * @param {string} sectionId - Section to navigate to
 * @param {Object} options - Navigation options
 */
export const navigateToSection = (sectionId, options = {}) => {
  const { trackingCallback, headerOffset = 80 } = options
  
  // Call tracking callback if provided
  if (trackingCallback && typeof trackingCallback === 'function') {
    trackingCallback(sectionId)
  }
  
  // Use Nuxt navigation
  navigateTo(`/#${sectionId}`)
  
  // Also perform smooth scroll
  scrollToSection(sectionId, headerOffset)
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} Whether element is visible
 */
export const isElementInViewport = (element, threshold = 0.1) => {
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
 * Get current section based on scroll position
 * @param {string[]} sectionIds - Array of section IDs to check
 * @returns {string|null} Currently active section ID
 */
export const getCurrentSection = (sectionIds = ['hero', 'solutions', 'approach', 'about', 'contact']) => {
  if (!import.meta.client) return null
  
  const sections = sectionIds.map(id => ({
    id,
    element: document.getElementById(id)
  })).filter(section => section.element)
  
  for (const section of sections) {
    if (isElementInViewport(section.element, 0.3)) {
      return section.id
    }
  }
  
  return null
}

/**
 * Setup intersection observer for section tracking
 * @param {Function} callback - Callback function when sections come into view
 * @param {Object} options - Intersection observer options
 * @returns {Function} Cleanup function
 */
export const setupSectionObserver = (callback, options = {}) => {
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
