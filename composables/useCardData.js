/**
 * Card data management composable for 816tech business cards
 * Provides centralized access to card information and utilities
 */

export const useCardData = () => {
  /**
   * Get all available cards
   * @returns {Promise<Array>} Array of card objects
   */
  const getAllCards = async () => {
    try {
      // Import Brian's card data
      const brianModule = await import('~/data/cards/brian.json')
      const brianCard = brianModule.default || brianModule
      
      const cards = []
      
      if (brianCard && brianCard.active) {
        cards.push(brianCard)
      }
      
      return cards.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Failed to load card data:', error)
      return []
    }
  }

  /**
   * Get a specific card by slug
   * @param {string} slug - Card identifier
   * @returns {Promise<Object|null>} Card object or null if not found
   */
  const getCard = async (slug) => {
    try {
      if (slug === 'brian') {
        const brianModule = await import('~/data/cards/brian.json')
        const brianCard = brianModule.default || brianModule
        return brianCard && brianCard.active ? brianCard : null
      }
      
      return null
    } catch (error) {
      console.error(`Failed to load card data for ${slug}:`, error)
      return null
    }
  }

  /**
   * Generate vCard content for a given card
   * @param {Object} card - Card data object
   * @returns {string} vCard formatted string
   */
  const generateVCard = (card) => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      `N:${card.name.split(' ').reverse().join(';')}`,
      `ORG:${card.company}`,
      `TITLE:${card.title}`,
      `ADR:;;${card.location}`,
      card.contacts.email ? `EMAIL:${card.contacts.email.value}` : '',
      card.contacts.mobile ? `TEL;TYPE=CELL:${card.contacts.mobile.value}` : '',
      card.contacts.office ? `TEL;TYPE=WORK:${card.contacts.office.value}` : '',
      card.contacts.website ? `URL:${card.contacts.website.href}` : '',
      `NOTE:${card.description}`,
      'END:VCARD'
    ].filter(Boolean).join('\n')
    
    return vcard
  }

  /**
   * Generate download link for vCard
   * @param {Object} card - Card data object
   * @returns {string} Data URL for vCard download
   */
  const generateVCardDownloadUrl = (card) => {
    const vcard = generateVCard(card)
    const blob = new Blob([vcard], { type: 'text/vcard' })
    return URL.createObjectURL(blob)
  }

  /**
   * Get contact methods as an array for easier iteration
   * @param {Object} card - Card data object
   * @returns {Array} Array of contact method objects
   */
  const getContactMethods = (card) => {
    return Object.entries(card.contacts).map(([key, contact]) => ({
      key,
      ...contact
    }))
  }

  /**
   * Generate sharing URL for a card
   * @param {string} slug - Card slug
   * @param {string} baseUrl - Base URL of the site
   * @returns {string} Full URL to the card
   */
  const getCardShareUrl = (slug, baseUrl = 'https://816tech.com') => {
    return `${baseUrl}/cards/${slug}`
  }

  /**
   * Resolve image path to ensure it's always absolute from site root
   * @param {string} imagePath - Original image path
   * @returns {string} Resolved absolute path
   */
  const resolveImagePath = (imagePath) => {
    if (!imagePath) return ''
    
    // Ensure path starts with / for absolute resolution
    if (imagePath.startsWith('/')) {
      return imagePath
    }
    
    // If relative path, make it absolute
    return `/${imagePath}`
  }

  return {
    getAllCards,
    getCard,
    generateVCard,
    generateVCardDownloadUrl,
    getContactMethods,
    getCardShareUrl,
    resolveImagePath
  }
}
