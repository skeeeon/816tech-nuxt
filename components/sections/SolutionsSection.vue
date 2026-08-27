<template>
  <section id="solutions" class="section" 
           :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">What We Do</h2>
      <p class="section-subtitle text-center">
        We start with the software and the integration, then handle the physical systems that
        depend on it. Access control and cameras are the specialty, and we service equipment
        another company installed.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-16">
        <div v-for="(solution, index) in solutions" :key="`solution-${index}`" 
             class="solution-card group">
          
          <!-- Refined icon container with Heroicons -->
          <div class="solution-icon-container mb-6">
            <div class="solution-icon" 
                 :style="{ 
                   color: solution.color,
                   backgroundColor: solution.color + '12'
                 }">
              <component :is="solution.iconComponent" class="w-8 h-8" />
            </div>
          </div>

          <h3 class="text-xl font-semibold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            {{ solution.title }}
          </h3>
          <p class="mb-6 leading-relaxed" 
             :style="{ color: 'var(--color-content-secondary)' }">
            {{ solution.description }}
          </p>
          
          <!-- Refined capabilities list -->
          <ul class="space-y-3">
            <li v-for="(capability, capIndex) in solution.capabilities" 
                :key="`cap-${index}-${capIndex}`"
                class="flex items-start text-sm capability-item">
              <div class="capability-bullet mr-3 mt-1 flex-shrink-0" 
                   :style="{ backgroundColor: 'var(--color-success)' + '15' }">
                <CheckIcon class="w-3 h-3" 
                           :style="{ color: 'var(--color-success)' }" />
              </div>
              <span class="leading-relaxed" 
                    :style="{ color: 'var(--color-content-secondary)' }">
                {{ capability }}
              </span>
            </li>
          </ul>

          <!-- Subtle accent bar -->
          <div class="solution-accent" 
               :style="{ backgroundColor: solution.color }"></div>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup>
/**
 * Solutions section component for 816tech
 * Highlights technology implementation capabilities with elegant, professional styling
 * Uses centralized navigation composable for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import {
  ShieldCheckIcon,
  VideoCameraIcon,
  ServerIcon,
  CodeBracketIcon,
  ArrowsRightLeftIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Use centralized navigation logic
const { scrollToSection } = useNavigation()

// Technology solution categories - positioned as implementation services
// Six cards to fill the lg:grid-cols-3 grid cleanly (2 rows of 3).
//
// Two rules for anything added or reworded here:
//   1. It must be a THING, not an abstraction. "API development and integration"
//      and "predictive analytics implementation" are what made the earlier version
//      of this section say nothing -- a reader could not tell what they'd receive.
//   2. It must be deliverable by one operator plus a licensed sub crew.
//      Notably removed: "24/7 monitoring and support". The SLA is remote response
//      next business day with on-site billed T&M, and "monitoring" is a licensed
//      activity in several states -- we say notifications.
//
// Physical security leads because it's the deepest specialty, but the range is
// deliberate: adjacent network and software work is what fills the months while
// access-control sales cycles run, and a one-trick shop contradicts our own
// no-lock-in argument.
const solutions = [
  {
    iconComponent: ShieldCheckIcon,
    color: '#2563eb', // Primary blue
    title: 'Access Control & Physical Security',
    description: 'Card and fob entry that keeps working when the internet goes down, because the doors decide locally.',
    capabilities: [
      'Doors unlock on site, not in a data center',
      'Add or revoke a credential in seconds',
      'Schedules, holidays, and after-hours rules',
      'Every entry logged, searchable, and yours to keep'
    ]
  },
  {
    iconComponent: VideoCameraIcon,
    color: '#059669', // Green
    title: 'Cameras & Video',
    description: 'New camera systems or additions to what you have, recording on site rather than in somebody\'s cloud.',
    capabilities: [
      'ONVIF cameras, no proprietary lock-in',
      'On-site recording, nothing streamed out by default',
      'Badge events linked to the footage',
      'Motion and object detection on the local box'
    ]
  },
  {
    iconComponent: ServerIcon,
    color: '#7c3aed', // Purple
    title: 'Networks, Cabling & Wireless',
    description: 'The low-voltage infrastructure underneath all of it, done to the same standard as the visible parts.',
    capabilities: [
      'Structured cabling, clean terminations, tidy racks',
      'Switching, PoE, and VLANs sized for the building',
      'Wireless coverage surveys and access points',
      'Camera and door networks kept off your office LAN'
    ]
  },
  {
    iconComponent: CodeBracketIcon,
    color: '#ea580c', // Orange
    title: 'Custom Software & Integrations',
    description: 'We write the software, so systems that "don\'t integrate" usually turn out to.',
    capabilities: [
      'Connect equipment and software that shipped without APIs for each other',
      'Dashboards and reports built around how you actually work',
      'Automation for the steps somebody is doing by hand',
      'Data pushed into the reporting tools you already run'
    ]
  },
  {
    iconComponent: ArrowsRightLeftIcon,
    color: '#0284c7', // Sky
    title: 'Working With What You Own',
    description: 'We would rather keep your equipment in service than sell you replacements for it.',
    capabilities: [
      'Keep working cameras, panels, and readers running',
      'Tie existing systems together instead of ripping them out',
      'Service and repair hardware another installer put in',
      'A straight answer when something really is past saving'
    ]
  },
  {
    iconComponent: WrenchScrewdriverIcon,
    color: '#0891b2', // Cyan
    title: 'Service & Support',
    description: 'One flat monthly fee covers the software, hosting, and remote help.',
    capabilities: [
      'Request service in one tap from your phone',
      'Remote response next business day, included',
      'We see equipment faults before you call',
      'On-site work quoted and billed by the hour'
    ]
  }
]
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.solution-card {
  @apply p-6 rounded-xl relative overflow-hidden;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  transition: all 0.2s ease;
  position: relative;
}

.solution-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.solution-card:hover .solution-accent {
  width: 100%;
}

.solution-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.solution-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.solution-card:hover .solution-icon {
  transform: scale(1.02);
}

.capability-item {
  transition: all 0.2s ease;
}

.capability-bullet {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.solution-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  transition: width 0.3s ease;
  border-radius: 0 0 12px 12px;
}

/* Refined button styling */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-outlined:hover {
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .solution-card {
    @apply p-5;
  }
  
  .solution-icon-container {
    margin-bottom: 1rem;
  }
}
</style>
