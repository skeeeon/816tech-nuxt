<template>
  <section id="approach" class="section"
           :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">Our Proven Approach</h2>
      <p class="section-subtitle text-center">
        Every successful implementation follows our structured three-phase methodology,
        ensuring projects are delivered on time, on budget, and exceeding expectations.
      </p>
      
      <!-- Enhanced three phase methodology -->
      <div class="relative mt-12 md:mt-16">
        <!-- Progress line background (desktop only) -->
        <div class="hidden lg:block absolute top-[30px] left-0 right-0 h-1 mx-auto"
             style="width: calc(100% - 240px); left: 120px;">
          <!-- Background line -->
          <div class="w-full h-full rounded-full"
               :style="{ backgroundColor: 'var(--color-border-primary)' }"></div>
          <!-- Gradient progress line -->
          <div class="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-orange-500"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
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
            Why Our Approach Works
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
            Ready to Start Your Technology Journey?
          </h3>
          <p class="text-base mb-8 leading-relaxed" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Let's begin with a discovery conversation to understand your challenges 
            and explore how modern technology can transform your operations.
          </p>
          <button 
            @click="navigateToContact('approach-discovery-call')"
            class="btn btn-primary inline-flex items-center text-lg px-8 py-4">
            <CalendarIcon class="w-5 h-5 mr-3" />
            Schedule Discovery Call
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
const phases = [
  {
    title: 'Discover',
    iconComponent: MagnifyingGlassIcon,
    color: '#2563eb', // Primary blue
    description: 'We start by deeply understanding your business challenges, current systems, and objectives to ensure our solution aligns perfectly with your needs.',
    activities: [
      'Stakeholder interviews and requirements gathering',
      'Current system assessment and gap analysis',
      'Site surveys and technical feasibility studies',
      'ROI analysis and business case development',
      'Risk assessment and mitigation planning'
    ],
    deliverables: 'Comprehensive project plan, technical specifications, timeline, and budget proposal with clear ROI projections.'
  },
  {
    title: 'Design',
    iconComponent: PaintBrushIcon,
    color: '#059669', // Green
    description: 'Our team creates detailed system architecture, user interfaces, and integration plans tailored to your specific requirements and existing infrastructure.',
    activities: [
      'System architecture and network design',
      'User interface and experience design',
      'Integration planning with existing systems',
      'Security framework and compliance review',
      'Testing strategy and acceptance criteria'
    ],
    deliverables: 'Detailed technical designs, architectural diagrams, user mockups, and implementation roadmap with milestones.'
  },
  {
    title: 'Deploy',
    iconComponent: Cog6ToothIcon,
    color: '#ea580c', // Orange
    description: 'Together we implement, test, and launch your solution with comprehensive training and ongoing support to ensure smooth adoption and prolonged success.',
    activities: [
      'System installation and configuration',
      'Integration testing and quality assurance',
      'User training and documentation',
      'Go-live support and monitoring',
      'Performance optimization and fine-tuning'
    ],
    deliverables: 'Fully operational system, comprehensive documentation, trained users, and ongoing support plan.'
  }
]

// Enhanced benefits of this structured approach
const approachBenefits = [
  {
    iconComponent: ClockIcon,
    title: 'Predictable Timeline',
    description: 'Structured phases with clear milestones ensure projects stay on schedule and meet deadlines, giving you confidence in delivery dates.'
  },
  {
    iconComponent: CurrencyDollarIcon,
    title: 'Budget Certainty',
    description: 'Thorough planning and fixed-price phases eliminate cost surprises and scope creep, protecting your investment.'
  },
  {
    iconComponent: StarIcon,
    title: 'Quality Assurance',
    description: 'Each phase includes testing and validation to ensure high-quality deliverables and exceptional user satisfaction.'
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

.phase-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.activity-item {
  transition: all 0.2s ease;
}

.activity-item:hover {
  transform: translateX(4px);
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
  
  .phase-activities,
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
