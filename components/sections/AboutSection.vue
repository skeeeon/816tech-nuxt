<template>
  <section id="about" class="section"
           :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">About 816tech</h2>
      <p class="section-subtitle text-center">
        A Kansas City technology integrator. We design the systems, write the software that
        connects them, and stay on the hook for both.
      </p>
      
      <!-- Story and differentiators side by side; each column carries a heading so the
           two align at the top. -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-16">
        <!-- Left column: how we got here -->
        <div>
          <h3 class="text-2xl font-bold mb-6"
              :style="{ color: 'var(--color-content-primary)' }">
            How We Got Here
          </h3>
          <div class="space-y-4 text-base"
               :style="{ color: 'var(--color-content-secondary)' }">
            <p>
              We have always worked both sides of this trade at once: specifying, installing,
              and commissioning access control and video, on jobs from a single laundromat to
              enterprises with sites in several states, while also selling the same equipment
              to other installers. Distribution widened the sample. We saw which products came
              back, across far more buildings than we could wire ourselves, and the same
              complaints kept surfacing. Cloud systems stopped working when the internet did.
              Per-door software fees grew every time somebody added a reader. Customers could
              not touch their own equipment, because the software belonged to whoever sold it
              to them.
            </p>
            <p>
              We build what we would want to run, and we sell nothing we would not put in our
              own building. Doors that keep deciding when the internet is down. Hardware you
              own outright. Open-source software, so nobody can hold your building hostage, us
              included. One flat fee that does not climb every time you add a reader. When two
              systems refuse to talk to each other, we write the code that makes them, because
              we would rather solve that than tell you it cannot be done.
            </p>
          </div>
        </div>

        <!-- Right column: key differentiators -->
        <div>
          <h3 class="text-2xl font-bold mb-6"
              :style="{ color: 'var(--color-content-primary)' }">
            Where We're Unusual
          </h3>
          <div class="space-y-6">
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
    </div>
  </section>
</template>

<script setup>
/**
 * About section component for 816tech
 * Highlights company background and what makes us unusual
 * Updated to use Heroicons instead of PrimeIcons
 */

// Import Heroicons
import {
  CheckBadgeIcon,
  UsersIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

// NOTE ON CLAIMS: everything in this file must be verifiable if a customer asks.
// Three earlier entries were deleted rather than reworded, because they could not be
// backed by a company with no completed jobs yet:
//   - "6-12 Months to ROI"                  -> a fabricated metric
//   - "Security Certified"                  -> no specific certification to name
//   - "Authorized partner with leading ..."  -> not true of 816tech as a new entity
// If any becomes true, name the certificate or the manufacturer explicitly. Do not
// restore a vague version.
//
// EXPERIENCE: state it without a year count. A specific number ("sixteen years")
// reads as tacky resume-padding, and it was appearing four times in this one section.
// The claim that carries weight is having answered for our own installs afterward,
// not the tally.
//
// INTEGRATION vs DISTRIBUTION: the two ran IN PARALLEL the entire time, never
// sequentially -- earlier copy said "a few of those years were spent on distribution",
// which was wrong. Distribution is also NOT where the lessons came from; that framing
// implied we learned nothing from our own installs. Its role was volume and variety:
// it showed which products came back across far more buildings than we could wire
// ourselves. Keep the learning credited to the integration side.
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
    title: 'We answer for our own installs',
    description: 'We have specified this equipment, installed it, and been the ones who picked up the phone when it needed attention two years later. That is a different education than reading the spec sheet.'
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

// NOTE: the credentials block (insured / code-aware / licensed crews) was removed.
// Carrying insurance is table stakes and nobody buys on it. The two items that did
// carry weight are already stated where they matter in ApproachSection: egress rules
// in the "Scope it" activities, licensed low-voltage subs in "Build it". The one
// detail not restated anywhere is fire release through listed power supplies.
//
// NOTE: the three ownership promises (hardware you own, fixed prices, no lock-in)
// live in ApproachSection's approachBenefits, next to the quote and pricing copy
// where they carry the most weight. They were duplicated here; don't restore them.
//
// NOTE: the "Kansas City Based" card was removed as redundant -- the section subtitle
// and the hero both open on being a Kansas City integrator. Service area still lives
// in TheFooter, the page meta description, and the areaServed schema in pages/index.vue.
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.differentiator-icon {
  @apply p-2 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0;
}

</style>
