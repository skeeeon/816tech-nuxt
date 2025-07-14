<template>
  <div class="business-card-container">
    <!-- Top action buttons -->
    <div class="card-actions-top mb-6 flex justify-end space-x-3">
      <button 
        @click="$emit('showQR')"
        class="action-btn inline-flex items-center justify-center p-3 rounded-full transition-all duration-200"
        :style="{ 
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-content-primary)',
          border: '2px solid var(--color-border-primary)'
        }"
        aria-label="Show QR Code">
        <QrCodeIcon class="w-5 h-5" />
      </button>
      
      <button 
        @click="shareCard"
        v-if="canShare"
        class="action-btn inline-flex items-center justify-center p-3 rounded-full transition-all duration-200"
        :style="{ 
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-content-primary)',
          border: '2px solid var(--color-border-primary)'
        }"
        aria-label="Share Card">
        <ShareIcon class="w-5 h-5" />
      </button>
      
      <button 
        @click="copyCardUrl"
        v-else
        class="action-btn inline-flex items-center justify-center p-3 rounded-full transition-all duration-200"
        :style="{ 
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-content-primary)',
          border: '2px solid var(--color-border-primary)'
        }"
        aria-label="Copy URL">
        <ClipboardIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Main card content -->
    <div class="card-main">
      <!-- Personal info with headshot -->
      <div class="card-info text-center mb-8">
        <!-- Profile photo -->
        <div v-if="resolvedImagePath" class="profile-photo-container mb-6">
          <img :src="resolvedImagePath" 
               :alt="`${card.name} - ${card.title}`"
               class="profile-photo mx-auto"
               @error="handleImageError"
               @load="handleImageLoad">
        </div>
        
        <h1 class="card-name text-3xl font-bold mb-2" 
            :style="{ color: 'var(--color-content-primary)' }">
          {{ card.name }}
        </h1>
        <p class="card-title text-lg mb-2" 
           :style="{ color: 'var(--color-content-secondary)' }">
          {{ card.title }}
        </p>
        <p class="card-company text-base font-medium mb-1" 
           :style="{ color: 'var(--color-content-primary)' }">
          {{ card.company }}
        </p>
        <p class="card-location text-sm" 
           :style="{ color: 'var(--color-content-tertiary)' }">
          {{ card.location }}
        </p>
      </div>

      <!-- Description -->
      <div class="card-description text-center mb-8">
        <p class="text-base leading-relaxed max-w-2xl mx-auto" 
           :style="{ color: 'var(--color-content-secondary)' }">
          {{ card.description }}
        </p>
      </div>

      <!-- Save contact CTA -->
      <div class="card-cta text-center mb-8">
        <button 
          @click="downloadVCard"
          class="btn btn-primary inline-flex items-center"
          aria-label="Save Contact">
          <UserPlusIcon class="w-5 h-5 mr-2" />
          Save Contact
        </button>
      </div>

      <!-- Contact methods -->
      <div class="card-contacts">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="contact in contactMethods" :key="contact.key" 
               class="contact-method">
            <NuxtLink :to="contact.href" 
                      :external="contact.href.startsWith('http') || contact.href.startsWith('tel') || contact.href.startsWith('mailto')"
                      @click="handleContactClick(contact.key)"
                      class="contact-link group block text-center p-4 rounded-lg transition-all duration-200"
                      :style="{ backgroundColor: 'var(--color-surface-secondary)' }"
                      :aria-label="contact.label">
              <div class="contact-icon mb-3 transition-transform duration-200 group-hover:scale-110">
                <div class="icon-container mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                     :style="{ 
                       backgroundColor: 'var(--color-primary)',
                       color: 'white'
                     }">
                  <component :is="getIconComponent(contact.key)" class="w-5 h-5" />
                </div>
              </div>
              <p class="contact-label text-sm font-medium" 
                 :style="{ color: 'var(--color-content-primary)' }">
                {{ contact.label }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Business card component for displaying individual team member cards
 * Matches 816tech styling and integrates with existing design system
 */

// Import Heroicons
import {
  UserPlusIcon,
  QrCodeIcon,
  ShareIcon,
  ClipboardIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['showQR'])

// Use composables
const { getContactMethods, generateVCardDownloadUrl, getCardShareUrl, resolveImagePath } = useCardData()
const { trackContact, trackCustomEvent } = useTracking()

// Computed properties
const contactMethods = computed(() => getContactMethods(props.card))
const resolvedImagePath = computed(() => resolveImagePath(props.card.image))

const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

// Icon mapping with mobile phone differentiation
const iconMap = {
  phone: PhoneIcon,
  mobile: DevicePhoneMobileIcon,
  office: PhoneIcon,
  envelope: EnvelopeIcon,
  calendar: CalendarIcon,
  globe: GlobeAltIcon
}

/**
 * Get icon component for contact method
 * @param {string} iconName - Name of the icon
 * @returns {Component} Vue component for the icon
 */
const getIconComponent = (iconName) => {
  // Map contact keys to appropriate icons
  const keyToIcon = {
    mobile: 'mobile',
    office: 'phone', 
    email: 'envelope',
    website: 'globe',
    calendar: 'calendar'
  }
  
  const mappedIcon = keyToIcon[iconName] || iconName
  return iconMap[mappedIcon] || PhoneIcon
}

/**
 * Download vCard file
 */
const downloadVCard = () => {
  if (!import.meta.client) return
  
  try {
    const downloadUrl = generateVCardDownloadUrl(props.card)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = props.card.vcardFilename || `${props.card.slug}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
    
    // Track download
    trackCustomEvent('vcard-download', { cardSlug: props.card.slug })
  } catch (error) {
    console.error('Failed to download vCard:', error)
  }
}

/**
 * Handle contact method clicks
 * @param {string} contactType - Type of contact method
 */
const handleContactClick = (contactType) => {
  trackContact(contactType, {
    source: 'business-card',
    cardSlug: props.card.slug
  })
}

/**
 * Share card using Web Share API
 */
const shareCard = async () => {
  if (!import.meta.client || !navigator.share) return
  
  try {
    const shareUrl = getCardShareUrl(props.card.slug)
    await navigator.share({
      title: `${props.card.name} - ${props.card.company}`,
      text: `View ${props.card.name}'s digital business card`,
      url: shareUrl
    })
    
    trackCustomEvent('card-share', { 
      method: 'native-share',
      cardSlug: props.card.slug 
    })
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
  }
}

/**
 * Copy card URL to clipboard
 */
const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    const shareUrl = getCardShareUrl(props.card.slug)
    await navigator.clipboard.writeText(shareUrl)
    
    // Show some feedback (could be enhanced with a toast)
    trackCustomEvent('card-share', { 
      method: 'copy-url',
      cardSlug: props.card.slug 
    })
    
    // Simple feedback - you might want to add a toast notification here
    console.log('Card URL copied to clipboard')
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Handle image loading errors
 */
const handleImageError = (event) => {
  // Hide the image container if image fails to load
  event.target.style.display = 'none'
  console.error(`Failed to load profile image for ${props.card.name}:`, event.target.src)
}

/**
 * Handle successful image loading
 */
const handleImageLoad = (event) => {
  console.log(`Successfully loaded profile image for ${props.card.name}:`, event.target.src)
}
</script>

<style scoped>
.business-card-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card-actions-top {
  position: relative;
  z-index: 10;
}

.action-btn {
  width: 48px;
  height: 48px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.profile-photo-container {
  display: flex;
  justify-content: center;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dark .profile-photo {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-photo:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.dark .profile-photo:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.contact-link {
  transition: all 0.2s ease;
}

.contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-link:hover .contact-icon {
  transform: scale(1.05);
}

.dark .contact-link:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Enhanced button styling */
.btn {
  transition: all 0.2s ease;
  min-width: 120px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .business-card-container {
    padding: 1rem;
  }
  
  .card-contacts .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>
