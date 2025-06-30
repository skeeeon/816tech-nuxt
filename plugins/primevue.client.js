/**
 * PrimeVue plugin configuration for Nuxt
 * Configures PrimeVue components for client-side rendering
 */
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'filled'
  })
})
