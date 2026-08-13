<template>
  <section id="approach" class="section"
           :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">How a Job Goes</h2>
      <p class="section-subtitle text-center">
        Three steps, with something concrete delivered at the end of each one. The process is
        the same for eight doors, a camera retrofit, or a software integration.
      </p>
      
      <!-- Enhanced three phase methodology -->
      <div class="relative mt-12 md:mt-16">
        <!-- Progress line background (desktop only) -->
        <div class="progress-track hidden lg:block absolute top-[30px] h-1">
          <!-- Background line -->
          <div class="w-full h-full rounded-full"
               :style="{ backgroundColor: 'var(--color-border-primary)' }"></div>
          <!-- Gradient progress line -->
          <div class="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-orange-500"></div>
        </div>
        
        <div class="approach-grid grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div v-for="(phase, index) in phases" :key="`phase-${index}`" 
               class="approach-phase relative">
            
            <!-- Enhanced phase number -->
            <div class="phase-header mb-6">
              <div class="phase-number-container">
                <div class="phase-number" 
                     :style="{ 
                       backgroundColor: phase.color,
                       color: 'white',
                       boxShadow: `0 4px 12px ${phase.color}40`
                     }">
                  {{ index + 1 }}
                </div>
                <!-- Animated ring -->
                <div class="phase-ring" 
                     :style="{ borderColor: phase.color + '40' }"></div>
              </div>
            </div>
            
            <!-- Enhanced phase content -->
            <div class="phase-content">
              <div class="phase-icon mb-6" 
                   :style="{ color: phase.color }">
                <component :is="phase.iconComponent" class="w-12 h-12" />
              </div>
              <h3 class="text-2xl font-bold mb-4" 
                  :style="{ color: 'var(--color-content-primary)' }">
                {{ phase.title }}
              </h3>
              <p class="text-base mb-6 leading-relaxed" 
                 :style="{ color: 'var(--color-content-secondary)' }">
                {{ phase.description }}
              </p>
              
              <!-- Enhanced activities list -->
              <div class="phase-activities mb-6">
                <h4 class="font-semibold mb-4 text-sm uppercase tracking-wide flex items-center" 
                    :style="{ color: phase.color }">
                  <ListBulletIcon class="w-4 h-4 mr-2" />
                  Key Activities
                </h4>
                <ul class="space-y-3">
                  <li v-for="(activity, actIndex) in phase.activities" 
                      :key="`act-${index}-${actIndex}`"
                      class="flex items-start activity-item">
                    <div class="activity-bullet mr-3 mt-1 flex-shrink-0" 
                         :style="{ backgroundColor: phase.color + '20' }">
                      <CheckIcon class="w-3 h-3" 
                                 :style="{ color: phase.color }" />
                    </div>
                    <span class="text-sm leading-relaxed" 
                          :style="{ color: 'var(--color-content-secondary)' }">
                      {{ activity }}
                    </span>
                  </li>
                </ul>
              </div>
              
              <!-- Enhanced deliverables -->
              <div class="phase-deliverables p-5 rounded-xl border-l-4" 
                   :style="{ 
                     backgroundColor: phase.color + '08',
                     borderLeftColor: phase.color
                   }">
                <h4 class="font-semibold mb-3 text-sm flex items-center" 
                    :style="{ color: 'var(--color-content-primary)' }">
                  <CubeIcon class="w-4 h-4 mr-2" :style="{ color: phase.color }" />
                  Deliverables:
                </h4>
                <p class="text-sm leading-relaxed" 
                   :style="{ color: 'var(--color-content-secondary)' }">
                  {{ phase.deliverables }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced why this approach works -->
      <div class="mt-20 md:mt-24">
        <div class="max-w-5xl mx-auto text-center">
          <h3 class="text-2xl md:text-3xl font-bold mb-8" 
              :style="{ color: 'var(--color-content-primary)' }">
            What You Get Working With Us
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(benefit, index) in approachBenefits" :key="`benefit-${index}`" 
                 class="approach-benefit p-6 rounded-xl"
                 :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
              <div class="benefit-icon-container mb-6">
                <div class="benefit-icon" 
                     :style="{ 
                       color: 'var(--color-primary)',
                       backgroundColor: 'var(--color-primary)' + '15'
                     }">
                  <component :is="benefit.iconComponent" class="w-6 h-6" />
                </div>
              </div>
              <h4 class="font-semibold mb-3 text-lg" 
                  :style="{ color: 'var(--color-content-primary)' }">
                {{ benefit.title }}
              </h4>
              <p class="text-sm leading-relaxed" 
                 :style="{ color: 'var(--color-content-secondary)' }">
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced call to action -->
      <div class="text-center mt-16 md:mt-20">
        <div class="max-w-3xl mx-auto p-8 rounded-2xl"
             :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
          <h3 class="text-2xl font-semibold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            Want a number for your building?
          </h3>
          <p class="text-base mb-8 leading-relaxed"
             :style="{ color: 'var(--color-content-secondary)' }">
            Tell us what you're trying to fix and we'll come look at it. The walkthrough and
            the fixed-price quote don't cost anything.
          </p>
          <button
            @click="navigateToContact('approach-discovery-call')"
            class="btn btn-primary inline-flex items-center text-lg px-8 py-4">
            <CalendarIcon class="w-5 h-5 mr-3" />
            Schedule a walkthrough
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * Enhanced Our Approach section component for 816tech
 * Details the three-phase implementation methodology: Discover, Design, Deploy
 * Features improved visual design with gradient connectors and modern styling
 * Uses centralized navigation composable for consistent behavior
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import {
  MagnifyingGlassIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  CheckIcon,
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

// Use centralized navigation logic
const { navigateToContact } = useNavigation()

// Three-phase methodology with enhanced styling
// Kept the three-phase structure; replaced the abstractions. Every "deliverable"
// below is a document or working system the customer physically receives -- no ROI
// projections (we have no basis for that number) and no "exceeding expectations".
const phases = [
  {
    title: 'Walk it',
    iconComponent: MagnifyingGlassIcon,
    color: '#2563eb', // Primary blue
    description: 'We come out and look at the actual building and the actual systems. Most sites have more usable cable in the walls and more life left in their equipment than the owner expects.',
    activities: [
      'Look at each door, camera position, and cable path',
      'Trace what the last installer left and what still works',
      'Check network drops, switch capacity, and power',
      'Sort out which doors are code-required egress',
      'Agree on what is in scope and what can wait'
    ],
    deliverables: 'A point-by-point list of what each door, camera, run, or integration needs. The walkthrough costs nothing.'
  },
  {
    title: 'Quote it',
    iconComponent: PaintBrushIcon,
    color: '#059669', // Green
    description: 'One number, itemized, with the hardware named. You will know the make and model of every reader, camera, lock, and switch before anyone drills a hole.',
    activities: [
      'Itemized hardware list at the part-number level',
      'Labor quoted per door or per drop, with a firm total',
      'Any monthly fee stated plainly with what it covers',
      'A wiring and termination plan the crew can execute',
      'Half down at signing, balance when it works'
    ],
    deliverables: 'A fixed-price quote you can compare line by line against anyone else\'s.'
  },
  {
    title: 'Build it',
    iconComponent: Cog6ToothIcon,
    color: '#ea580c', // Orange
    description: 'Licensed low-voltage crews pull the wire. We design it, commission it, and stay until your people can run it without calling us.',
    activities: [
      'Licensed subcontractors handle wire and conduit',
      'We commission and test every device ourselves',
      'Credentials loaded, schedules set, staff trained',
      'Administrator logins are yours and stay yours',
      'We pull the network cable and prove doors open'
    ],
    deliverables: 'A working system, your own administrator access, as-built documentation, and a spare parts plan.'
  }
]

// Enhanced benefits of this structured approach
const approachBenefits = [
  {
    iconComponent: CurrencyDollarIcon,
    title: 'You own the hardware',
    description: 'The panels, readers, cameras, and switches are yours, bought outright. Nothing is leased, and nothing stops working because a subscription lapsed.'
  },
  {
    iconComponent: ClockIcon,
    title: 'No per-door billing',
    description: 'One flat monthly fee for the account, however many doors, cameras, or credentials you add. Add a door next year and the monthly fee stays where it is.'
  },
  {
    iconComponent: StarIcon,
    title: 'Nobody gets locked in',
    description: 'The software is open source. Take it in house or hand it to another integrator and it keeps working, with your data intact.'
  }
]
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.approach-phase {
  position: relative;
}

/* Connector between the first and last phase circles. Each circle is centered in
   its column, so its center sits half a column in from the track's edge:
   (track width - 2 gaps) / 3 / 2. Derived rather than hardcoded so it stays on
   the circles at every desktop width. */
.progress-track {
  --track-inset: calc((100% - 2 * 3rem) / 6);
  left: var(--track-inset);
  right: var(--track-inset);
}

.phase-header {
  display: flex;
  justify-content: center;
  position: relative;
}

.phase-number-container {
  position: relative;
  display: inline-block;
}

.phase-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 3;
  position: relative;
  transition: all 0.3s ease;
}

.phase-number:hover {
  transform: scale(1.05);
}

.phase-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  border: 2px solid;
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.2;
  }
}

.phase-content {
  text-align: center;
}

/* The activity list is bullet + text, so it stays left-aligned at every width.
   Inheriting the centering above only shows up once an item wraps, which reads
   as the text drifting away from its checkmark. */
.phase-activities {
  text-align: left;
}

.phase-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.activity-bullet {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.phase-deliverables {
  transition: all 0.3s ease;
}

.phase-deliverables:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.approach-benefit {
  transition: all 0.3s ease;
  border: 1px solid var(--color-border-primary);
}

.approach-benefit:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.benefit-icon-container {
  display: flex;
  justify-content: center;
}

.benefit-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Desktop: keep the three phase columns aligned to each other instead of letting
   each one size to its own copy. Fallback is a flex column that pins the
   deliverables card to the bottom; subgrid additionally lines up every row
   (icon, title, description, activities, deliverables) across all three. */
@media (min-width: 1024px) {
  .approach-phase {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .phase-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .phase-activities {
    flex: 1 1 auto;
  }
}

@supports (grid-template-rows: subgrid) {
  @media (min-width: 1024px) {
    .approach-grid {
      /* header, icon, title, description, activities, deliverables */
      grid-template-rows: repeat(6, auto);
      row-gap: 0;
    }

    .approach-phase {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span 6;
    }

    .phase-content {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span 5;
    }

    .phase-activities {
      flex: none;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .phase-header {
    margin-bottom: 2rem;
  }
  
  .phase-content {
    text-align: left;
  }
  
  .phase-icon {
    text-align: center;
    display: block;
    margin: 0 auto 1.5rem auto;
  }
  
  .phase-deliverables {
    text-align: left;
  }
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
