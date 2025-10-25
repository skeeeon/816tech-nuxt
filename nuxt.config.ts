import { defineNuxtConfig } from 'nuxt/config'
// Import build-time utility (static import - safe for Nuxt config)
import { getAllBlogSlugs } from './server/utils/buildtime-blog'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // SSG Configuration for static generation
  ssr: true,
  
  nitro: {
    prerender: {
      // Static routes that should always be pre-rendered
      routes: [
        '/',
        '/cards',
        '/cards/brian',
        '/blog',
	'/api/feed.xml'
      ],
      // Crawl all links to discover routes automatically
      crawlLinks: true
    },
    // Enable compression in production
    compressPublicAssets: true
  },

  // Add route rules for better caching and SPA behavior
  routeRules: {
    // Blog index should be static
    '/blog': { prerender: true },
    // Blog posts should be static (will be generated for each slug)
    '/blog/**': { prerender: true }
  },

  // FIXED: Hook to generate blog post routes using build-time utility
  hooks: {
    async 'nitro:config'(nitroConfig) {
      // Only run during build/generate
      if (!nitroConfig.prerender) return
      
      try {
        console.log('[nuxt:config] Generating blog post routes...')
        
        // Use the build-time utility to get slugs
        // This is a static import that Vite won't try to bundle for the client
        const slugs = await getAllBlogSlugs()
        
        if (slugs.length === 0) {
          console.warn('[nuxt:config] No blog posts found to prerender')
          return
        }
        
        // Generate blog post routes
        const blogRoutes = slugs.map(slug => `/blog/${slug}`)
        
        // Ensure routes array exists
        if (!nitroConfig.prerender.routes) {
          nitroConfig.prerender.routes = []
        }
        
        // Add blog routes to prerender list
        nitroConfig.prerender.routes.push(...blogRoutes)
        
        console.log(`✅ Pre-rendering ${blogRoutes.length} blog posts:`, blogRoutes)
      } catch (error) {
        console.error('❌ Error generating blog routes:', error)
        // Don't fail the build if blog route generation fails
        // The blog will still work with client-side navigation
      }
    }
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
      'composables',
      'utils'
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
        { rel: 'canonical', href: 'https://816tech.com' },
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
  }
})
