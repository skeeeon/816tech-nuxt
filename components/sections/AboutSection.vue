<template>
  <section id="about" class="section"
           :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">About 816tech</h2>
      <p class="section-subtitle text-center">
        A Kansas City technology integrator with sixteen years of experience designing and
        installing the systems we sell.
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
                We have sixteen years in this trade, most of it on the integration side: specifying
                access control and video systems, installing them, and commissioning them. That work
                ran from a single laundromat to multi-building campuses to enterprises with sites in
                several states, so we know what holds up at one door and what holds up at a thousand.
              </p>
              <p>
                A few of those years were spent on the distribution side, selling to other
                installers, which is where you find out what generates service calls two years after
                handover. The same complaints kept coming back. Cloud systems stopped working when
                the internet did. Per-door software fees grew every time somebody added a reader.
                Customers could not touch their own equipment, because the software belonged to
                whoever sold it to them.
              </p>
              <p>
                So we build what we would want in our own building: decisions made on site, hardware
                you own outright, and open-source software, so no vendor can hold your building
                hostage, including us. When two systems refuse to talk to each other, we write the
                code that makes them, which most integrators cannot do.
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
              Serving the Kansas City metro and the surrounding area. Close enough to walk your
              building this week, and to be on site the same week when something needs a hand on it.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Team commitment -->
      <div class="mt-16 md:mt-20 text-center">
        <div class="max-w-3xl mx-auto">
          <h3 class="text-2xl font-bold mb-6" 
              :style="{ color: 'var(--color-content-primary)' }">
            What You Can Hold Us To
          </h3>
          <p class="text-lg mb-8"
             :style="{ color: 'var(--color-content-secondary)' }">
            Three things, in writing, on every job.
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

// NOTE ON CLAIMS: everything in this file must be verifiable if a customer asks.
// Three earlier entries were deleted rather than reworded, because they could not be
// backed by a company with no completed jobs yet:
//   - "6-12 Months to ROI"                  -> a fabricated metric
//   - "Security Certified"                  -> no specific certification to name
//   - "Authorized partner with leading ..."  -> not true of 816tech as a new entity
// If any becomes true, name the certificate or the manufacturer explicitly. Do not
// restore a vague version. Same rule for the stats: no number we can't source.
//
// VOICE: first person plural ("we"), never "I". Prior copy mixed the two, which read
// as a one-person shop. The prior experience is real and transferable, so it belongs
// to the company.
//
// PRIOR-WORK REFERENCES: describe SIZE, not sector. The range runs from a single
// small business through enterprises operating in several states, and the rungs are
// named by building count ("multi-building campuses"), not by industry. Never name a
// former customer and never imply one: no stadiums or arenas, and no sector labels
// either -- "school districts" was cut for the same reason, since a named sector plus
// a metro plus a size is close to an identification even when no customer is meant.
const differentiators = [
  {
    iconComponent: CheckBadgeIcon,
    color: '#2563eb',
    title: 'Sixteen years installing these systems',
    description: 'Mostly integration work, on sites ranging from single small businesses to enterprises operating in several states. We have specified this equipment, installed it, and been called back when it failed.'
  },
  {
    iconComponent: UsersIcon,
    color: '#059669',
    title: 'The designer commissions the job',
    description: 'No account manager handing you off, and no tier-one queue. Whoever walks your building is who sets the system up and who picks up the phone afterward.'
  },
  {
    iconComponent: WrenchScrewdriverIcon,
    color: '#7c3aed',
    title: 'We write the software',
    description: 'Unusual for an integrator, and it means the integrations other shops decline are ordinary work here, including equipment that shipped with no way to talk to anything else.'
  }
]

const companyStats = [
  { number: '16', label: 'Years installing these systems' },
  { number: 'KC', label: 'Based in Kansas City' },
  { number: '0', label: 'Per-device software fees' },
  { number: '100%', label: 'Open source software' }
]

const credentials = [
  {
    iconComponent: ShieldCheckIcon,
    title: 'Insured',
    description: 'General liability and errors & omissions coverage; certificate available on request'
  },
  {
    iconComponent: BookOpenIcon,
    title: 'Code-aware',
    description: 'Egress stays mechanical and fire release runs through listed power supplies'
  },
  {
    iconComponent: BuildingOfficeIcon,
    title: 'Licensed crews on the wire',
    description: 'Conduit and cable pulled by licensed low-voltage contractors carrying their own insurance'
  }
]

const commitments = [
  {
    iconComponent: StarIcon,
    color: '#f59e0b',
    title: 'Your equipment is yours',
    description: 'You buy the hardware outright. Nothing is leased, and nothing stops working if you stop paying us.'
  },
  {
    iconComponent: EyeIcon,
    color: '#2563eb',
    title: 'Fixed prices, named parts',
    description: 'You see the make and model of every component before work starts, with labor quoted per door or per drop instead of open-ended.'
  },
  {
    iconComponent: HeartIcon,
    color: '#dc2626',
    title: 'No lock-in, ever',
    description: 'The software is open source. Take it in house or hand it to another integrator and it keeps working, with your data intact.'
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
