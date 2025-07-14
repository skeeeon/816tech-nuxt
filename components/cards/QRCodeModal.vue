<template>
  <!-- Modal backdrop -->
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <!-- Modal content -->
    <div 
      class="modal-content rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      :style="{ backgroundColor: 'var(--color-surface-primary)' }"
      @click.stop
    >
      <!-- Close button -->
      <button 
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 rounded-full transition-colors"
        :style="{ 
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-content-primary)'
        }"
        aria-label="Close QR code modal"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Modal header -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-semibold mb-2" 
            :style="{ color: 'var(--color-content-primary)' }">
          Scan QR Code
        </h3>
        <p class="text-sm" 
           :style="{ color: 'var(--color-content-secondary)' }">
          Share this card by scanning with any QR code reader
        </p>
      </div>

      <!-- QR Code container -->
      <div class="qr-container text-center mb-6">
        <div 
          ref="qrCodeContainer"
          class="qr-code-wrapper inline-block p-4 rounded-lg"
          :style="{ backgroundColor: 'white' }"
        ></div>
      </div>

      <!-- Share options -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          @click="copyCardUrl"
          class="btn btn-outlined flex-1 inline-flex items-center justify-center">
          <ClipboardIcon class="w-4 h-4 mr-2" />
          Copy URL
        </button>
        
        <button 
          v-if="canShare"
          @click="shareCard"
          class="btn btn-primary flex-1 inline-flex items-center justify-center">
          <ShareIcon class="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * QR Code modal component for sharing business cards
 * Integrates with existing qrcode.min.js library
 */

// Import Heroicons
import {
  XMarkIcon,
  ClipboardIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  cardUrl: {
    type: String,
    required: true
  },
  cardTitle: {
    type: String,
    default: 'Business Card'
  }
})

// Emits
const emit = defineEmits(['close'])

// Use composables
const { trackCustomEvent } = useTracking()

// Template refs
const qrCodeContainer = ref(null)

// Computed properties
const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

/**
 * Generate and display QR code
 */
const generateQRCode = () => {
  if (!import.meta.client || !qrCodeContainer.value) return
  
  // Clear existing QR code
  qrCodeContainer.value.innerHTML = ''
  
  try {
    // Use the existing QRCode library (loaded globally)
    if (typeof window.QRCode !== 'undefined') {
      const qr = new window.QRCode({
        content: props.cardUrl,
        container: 'svg-viewbox',
        join: true,
        ecl: 'L',
        padding: 0,
        width: 200,
        height: 200
      })
      
      qrCodeContainer.value.innerHTML = qr.svg()
    } else {
      console.error('QRCode library not loaded')
      qrCodeContainer.value.innerHTML = '<p>QR Code generation failed</p>'
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    qrCodeContainer.value.innerHTML = '<p>QR Code generation failed</p>'
  }
}

/**
 * Copy card URL to clipboard
 */
const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    await navigator.clipboard.writeText(props.cardUrl)
    
    // Track copy action
    trackCustomEvent('qr-url-copy', { url: props.cardUrl })
    
    // You might want to show a toast notification here
    console.log('URL copied to clipboard')
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Share card using Web Share API
 */
const shareCard = async () => {
  if (!import.meta.client || !navigator.share) return
  
  try {
    await navigator.share({
      title: props.cardTitle,
      text: `View this digital business card`,
      url: props.cardUrl
    })
    
    trackCustomEvent('qr-native-share', { url: props.cardUrl })
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
  }
}

// Watch for show prop changes to generate QR code
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Wait for DOM update
    nextTick(() => {
      generateQRCode()
      
      // Track QR code view
      trackCustomEvent('qr-code-view', { url: props.cardUrl })
    })
  }
})

// Handle escape key
const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Setup event listeners
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleEscKey)
  }
})

// Clean up event listeners
onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscKey)
  }
})
</script>

<style scoped>
.modal-content {
  border: 1px solid var(--color-border-primary);
  animation: modal-appear 0.2s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.qr-code-wrapper {
  border: 1px solid var(--color-border-primary);
  max-width: 240px;
  margin: 0 auto;
}

.qr-code-wrapper :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

/* Enhanced button styling */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outlined:hover {
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
}
</style>
