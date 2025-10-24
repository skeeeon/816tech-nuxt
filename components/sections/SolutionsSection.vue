<template>
  <section id="solutions" class="section" 
           :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">Solutions That Work</h2>
      <p class="section-subtitle text-center">
        We specialize in implementing solutions that solve real business challenges,
        from initial concept to ongoing support.
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
      
      <!-- Natural transition with navigation to approach section -->
      <div class="text-center mt-16 md:mt-20">
        <div class="max-w-3xl mx-auto">
          <p class="text-lg leading-relaxed mb-8" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Every solution is delivered through our proven three-phase methodology, 
            ensuring projects are completed on time, on budget, and exceeding expectations.
          </p>
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
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Use centralized navigation logic
const { scrollToSection } = useNavigation()

// Technology solution categories - positioned as implementation services
const solutions = [
  {
    iconComponent: Cog6ToothIcon,
    color: '#2563eb', // Primary blue
    title: 'System Integration',
    description: 'Connect disparate systems and create unified ecosystems that work together seamlessly.',
    capabilities: [
      'Legacy system modernization',
      'API development and integration',
      'Real-time data synchronization',
      'Cross-platform compatibility'
    ]
  },
  {
    iconComponent: ChartBarIcon,
    color: '#059669', // Green
    title: 'Data Analytics & Monitoring',
    description: 'Transform raw data into actionable insights with custom dashboards and analytics.',
    capabilities: [
      'Real-time monitoring dashboards',
      'Predictive analytics implementation',
      'Custom reporting solutions',
      'Alert and notification systems'
    ]
  },
  {
    iconComponent: ShieldCheckIcon,
    color: '#dc2626', // Red
    title: 'Security & Compliance',
    description: 'Implement robust security measures and ensure compliance with industry standards.',
    capabilities: [
      'End-to-end encryption',
      'Access control and authentication',
      'Compliance documentation',
      'Security audit and testing'
    ]
  },
  {
    iconComponent: ServerIcon,
    color: '#7c3aed', // Purple
    title: 'Infrastructure Design',
    description: 'Design and deploy scalable infrastructure that grows with your business needs.',
    capabilities: [
      'Network architecture planning',
      'Edge computing implementation',
      'Cloud integration strategies',
      'Scalability and redundancy'
    ]
  },
  {
    iconComponent: DevicePhoneMobileIcon,
    color: '#ea580c', // Orange
    title: 'Custom Applications',
    description: 'Develop tailored applications and interfaces that match your specific workflows.',
    capabilities: [
      'Mobile app development',
      'Web-based control panels',
      'Custom user interfaces',
      'Workflow automation tools'
    ]
  },
  {
    iconComponent: WrenchScrewdriverIcon,
    color: '#0891b2', // Cyan
    title: 'Ongoing Support',
    description: 'Comprehensive support services to keep your systems running smoothly.',
    capabilities: [
      '24/7 monitoring and support',
      'Preventive maintenance',
      'Performance optimization',
      'Training and documentation'
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
