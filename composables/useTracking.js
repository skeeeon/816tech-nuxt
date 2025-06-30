/**
 * Analytics and tracking composable for 816tech
 * Simplified version with better SSR compatibility
 */

/**
 * Initialize analytics tracking
 */
export const useTracking = () => {
  /**
   * Track section views for user engagement analysis
   */
  const trackSectionView = (sectionName) => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track('section-view', { section: sectionName })
    }
  }

  /**
   * Track CTA interactions for conversion analysis
   */
  const trackCTA = (ctaName, additional = {}) => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track('cta-click', { cta: ctaName, ...additional })
    }
  }

  /**
   * Track contact interactions
   */
  const trackContact = (contactMethod, additional = {}) => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track('contact-interaction', { method: contactMethod, ...additional })
    }
  }

  /**
   * Track navigation events
   */
  const trackNavigation = (section, method = 'click') => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track('navigation', { section, method })
    }
  }

  /**
   * Track theme changes for UX analysis
   */
  const trackThemeChange = (theme) => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track('theme-change', { theme })
    }
  }

  /**
   * Generic custom event tracking
   */
  const trackCustomEvent = (eventName, eventData = {}) => {
    if (import.meta.client && typeof window.umami !== 'undefined') {
      window.umami.track(eventName, eventData)
    }
  }

  return {
    trackSectionView,
    trackCTA,
    trackContact,
    trackNavigation,
    trackThemeChange,
    trackCustomEvent
  }
}
