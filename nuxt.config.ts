export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // SSG Configuration
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  // Module order is critical - Tailwind before PrimeVue
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  // PrimeVue configuration - unstyled mode for best Tailwind integration
  primevue: {
    options: {
      unstyled: true,
      ripple: true
    },
    // Disable auto-import for components we don't need
    components: {
      exclude: ['Form', 'FormField']
    }
  },

  // SEO Configuration
  app: {
    head: {
      title: '816tech - Enterprise Technology Integration | Kansas City',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Kansas City\'s trusted technology integration partner. Enterprise solutions using proven open-source technologies.' },
        { name: 'keywords', content: 'enterprise technology, system integration, Kansas City, Missouri, open source solutions, custom software development' },
        { name: 'author', content: '816tech' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '816tech' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@816tech' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://816tech.com' }
      ],
      script: [
        {
          defer: true,
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': 'ab7c8a76-31ee-408d-aa07-02f3774d0f73'
        }
      ]
    }
  },

  // Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      'JetBrains Mono': [400, 700]
    },
    display: 'swap',
    preload: true
  },

  // CSS - Only PrimeIcons and custom styles (no theme CSS needed with unstyled mode)
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://816tech.com',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || ''
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  ssr: true
})
