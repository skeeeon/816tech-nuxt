<template>
  <section id="about" class="section"
           :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">About 816tech</h2>
      <p class="section-subtitle text-center">
        A Kansas City-based technology integrator with deep expertise in enterprise implementation
        and a commitment to delivering exceptional results.
      </p>
      
      <!-- Company overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-16">
        <!-- Left column: Story and experience -->
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold mb-4" 
                :style="{ color: 'var(--color-content-primary)' }">
              Our Story
            </h3>
            <div class="space-y-4 text-base" 
                 :style="{ color: 'var(--color-content-secondary)' }">
              <p>
                Founded in Kansas City with over 15 years of combined experience in enterprise technology, 
                816tech was born from a simple observation: too many projects fail not because of 
                technology limitations, but due to poor implementation and lack of business focus.
              </p>
              <p>
                We bridge the gap between cutting-edge technology and real-world business needs, 
                ensuring every project delivers measurable value and sustainable results.
              </p>
              <p>
                Our local presence in the heart of America allows us to serve clients across the Midwest 
                with personalized attention while maintaining the expertise and resources of a national firm.
              </p>
            </div>
          </div>
          
          <!-- Key differentiators -->
          <div>
            <h3 class="text-2xl font-bold mb-6" 
                :style="{ color: 'var(--color-content-primary)' }">
              What Sets Us Apart
            </h3>
            <div class="space-y-4">
              <div v-for="(differentiator, index) in differentiators" 
                   :key="`diff-${index}`"
                   class="flex items-start">
                <div class="differentiator-icon mr-4 mt-1" 
                     :style="{ backgroundColor: differentiator.color + '20' }">
                  <component :is="differentiator.iconComponent" 
                             class="w-5 h-5"
                             :style="{ color: differentiator.color }" />
                </div>
                <div>
                  <h4 class="font-semibold mb-2" 
                      :style="{ color: 'var(--color-content-primary)' }">
                    {{ differentiator.title }}
                  </h4>
                  <p class="text-sm" 
                     :style="{ color: 'var(--color-content-secondary)' }">
                    {{ differentiator.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right column: Stats and credentials -->
        <div class="space-y-8">
          <!-- Company stats -->
          <div class="stats-grid">
            <h3 class="text-2xl font-bold mb-6" 
                :style="{ color: 'var(--color-content-primary)' }">
              By the Numbers
            </h3>
            <div class="grid grid-cols-2 gap-6">
              <div v-for="(stat, index) in companyStats" 
                   :key="`stat-${index}`"
                   class="stat-item text-center">
                <div class="stat-number" 
                     :style="{ color: 'var(--color-primary)' }">
                  {{ stat.number }}
                </div>
                <div class="stat-label" 
                     :style="{ color: 'var(--color-content-secondary)' }">
                  {{ stat.label }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Fixed certifications and partnerships -->
          <div>
            <h3 class="text-2xl font-bold mb-6" 
                :style="{ color: 'var(--color-content-primary)' }">
              Credentials & Partnerships
            </h3>
            <div class="credentials-grid">
              <div v-for="(credential, index) in credentials" 
                   :key="`cred-${index}`"
                   class="credential-item">
                <div class="credential-icon-container">
                  <component :is="credential.iconComponent" 
                             class="w-5 h-5 credential-icon"
                             :style="{ color: 'var(--color-primary)' }" />
                </div>
                <div class="credential-content">
                  <h4 class="font-semibold text-sm" 
                      :style="{ color: 'var(--color-content-primary)' }">
                    {{ credential.title }}
                  </h4>
                  <p class="text-xs" 
                     :style="{ color: 'var(--color-content-secondary)' }">
                    {{ credential.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Local presence -->
          <div class="local-presence p-6 rounded-lg" 
               :style="{ backgroundColor: 'var(--color-surface-primary)' }">
            <div class="flex items-center mb-4">
              <MapPinIcon class="w-6 h-6 mr-3" 
                          :style="{ color: 'var(--color-primary)' }" />
              <h3 class="text-xl font-bold" 
                  :style="{ color: 'var(--color-content-primary)' }">
                Kansas City Based
              </h3>
            </div>
            <p class="text-sm mb-4" 
               :style="{ color: 'var(--color-content-secondary)' }">
              Proudly serving the greater Kansas City metropolitan area and the Midwest region. 
              Our local presence means faster response times, on-site support, and a deep 
              understanding of regional business needs.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Team commitment -->
      <div class="mt-16 md:mt-20 text-center">
        <div class="max-w-3xl mx-auto">
          <h3 class="text-2xl font-bold mb-6" 
              :style="{ color: 'var(--color-content-primary)' }">
            Our Commitment to You
          </h3>
          <p class="text-lg mb-8" 
             :style="{ color: 'var(--color-content-secondary)' }">
            We don't just implement technology—we partner with you for long-term success. 
            Every project is backed by our commitment to quality, transparency, and measurable results.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(commitment, index) in commitments" 
                 :key="`commit-${index}`"
                 class="commitment-item">
              <div class="commitment-icon mb-4" 
                   :style="{ color: commitment.color }">
                <component :is="commitment.iconComponent" class="w-8 h-8" />
              </div>
              <h4 class="font-semibold mb-2" 
                  :style="{ color: 'var(--color-content-primary)' }">
                {{ commitment.title }}
              </h4>
              <p class="text-sm" 
                 :style="{ color: 'var(--color-content-secondary)' }">
                {{ commitment.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced CTA section linking to contact -->
      <div class="text-center mt-16 md:mt-20">
        <div class="max-w-2xl mx-auto p-8 rounded-2xl"
             :style="{ backgroundColor: 'var(--color-surface-primary)' }">
          <h3 class="text-xl font-semibold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            Ready to Experience the 816tech Difference?
          </h3>
          <p class="text-base mb-6" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Let's discuss how our proven approach and local expertise can transform your technology challenges into competitive advantages.
          </p>
          <button 
            @click="navigateToContact('about-experience-difference')"
            class="btn btn-primary inline-flex items-center">
            <ChatBubbleLeftEllipsisIcon class="w-5 h-5 mr-2" />
            Start the Conversation
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * About section component for 816tech
 * Highlights company background, experience, local presence, and team commitment
 * Uses centralized navigation composable for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import {
  CheckBadgeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/vue/24/outline'

// Use centralized navigation logic
const { navigateToContact } = useNavigation()

// Key differentiators for 816tech
const differentiators = [
  {
    iconComponent: CheckBadgeIcon,
    color: '#2563eb',
    title: 'Proven Experience',
    description: '15+ years implementing enterprise technology solutions with a track record of successful projects across multiple industries.'
  },
  {
    iconComponent: UsersIcon,
    color: '#059669',
    title: 'Business-First Approach',
    description: 'We focus on solving business problems first, then apply the right technology—not the other way around.'
  },
  {
    iconComponent: WrenchScrewdriverIcon,
    color: '#7c3aed',
    title: 'Full-Service Support',
    description: 'From initial consultation through ongoing maintenance—we are your long-term technology partner.'
  }
]

// Company statistics
const companyStats = [
  { number: '15+', label: 'Years of Experience' },
  { number: '6-12', label: 'Months to ROI' },
  { number: '0', label: 'Vendor Lock-in Risk' },
  { number: '100%', label: 'Open Source' }
]

// Fixed credentials and certifications with Heroicon components
const credentials = [
  {
    iconComponent: ShieldCheckIcon,
    title: 'Security Certified',
    description: 'Certified in cybersecurity and data protection standards'
  },
  {
    iconComponent: BookOpenIcon,
    title: 'Industry Training',
    description: 'Ongoing education in latest technologies and practices'
  },
  {
    iconComponent: BuildingOfficeIcon,
    title: 'Vendor Partnerships',
    description: 'Authorized partner with leading technology manufacturers'
  }
]

// Team commitments
const commitments = [
  {
    iconComponent: StarIcon,
    color: '#f59e0b',
    title: 'Quality First',
    description: 'Every solution meets our rigorous quality standards and exceeds client expectations.'
  },
  {
    iconComponent: EyeIcon,
    color: '#2563eb',
    title: 'Full Transparency',
    description: 'Clear communication, honest timelines, and upfront pricing—no surprises.'
  },
  {
    iconComponent: HeartIcon,
    color: '#dc2626',
    title: 'Long-term Success',
    description: 'We measure our success by your success and build solutions for lasting value.'
  }
]
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.differentiator-icon {
  @apply p-2 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0;
}

.stat-item {
  @apply p-4 rounded-lg;
  background-color: var(--color-surface-primary);
}

.stat-number {
  @apply text-3xl font-bold mb-1;
}

.stat-label {
  @apply text-sm font-medium;
}

.credentials-grid {
  @apply space-y-4;
}

.credential-item {
  @apply flex items-start p-4 rounded-lg;
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  transition: all 0.2s ease;
}

.credential-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.credential-icon-container {
  @apply flex-shrink-0 mr-4;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-50);
  border-radius: 8px;
}

.credential-icon {
}

.credential-content {
  @apply flex-grow;
}

.local-presence {
  border: 2px solid var(--color-border-primary);
}

.commitment-item {
  @apply text-center;
}

.commitment-icon {
  display: flex;
  justify-content: center;
}

/* Enhanced button styling */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
</style>
