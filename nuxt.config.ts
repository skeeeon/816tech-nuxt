export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // SSG Configuration for better performance
  nitro: {
    prerender: {
      routes: [
        '/',
        '/cards',
        '/cards/brian'
        // Add new card routes here as team members are added
      ]
    },
    // Enable compression in production
    compressPublicAssets: true
  },

  // Ensure proper component auto-imports
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Simplified modules - PrimeVue removed
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  // Enhanced imports configuration
  imports: {
    dirs: [
      'composables'
    ]
  },

  // SEO Configuration with Theme Optimization
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
        { name: 'twitter:site', content: '@816tech' },
        // Theme color meta tags for better browser integration
        { name: 'theme-color', content: '#2563eb', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' }
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
        },
        // Add QR code library for business cards
        {
          src: '/qrcode.min.js',
          defer: true
        }
      ]
    }
  },

  // Google Fonts with optimized loading
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      'JetBrains Mono': [400, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true
  },

  // CSS - Updated path
  css: [
    '~/assets/css/main.css'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://816tech.com',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || ''
    }
  },

  // Tailwind CSS configuration with optimization
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // Enhanced Vite configuration for performance
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    },
    clearScreen: false,
    build: {
      // Restore build optimizations
      cssCodeSplit: false, // Better for theme switching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', '@heroicons/vue'],
          }
        }
      }
    }
  },

  // Production optimizations
  experimental: {
    payloadExtraction: false, // Better for SSG
    inlineSSRStyles: false // Prevent CSS duplication
  },

  // Disable TypeScript checking for now
  typescript: {
    typeCheck: false
  },

  ssr: true
})
