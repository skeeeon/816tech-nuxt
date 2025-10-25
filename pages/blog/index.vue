<template>
  <div class="blog-index-page">
    <!-- Main content -->
    <div class="py-16">
      <div class="container mx-auto px-4">
        <!-- Loading state -->
        <div v-if="pending" class="text-center">
          <div class="animate-pulse">
            <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p :style="{ color: 'var(--color-content-secondary)' }">
              Loading posts...
            </p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center max-w-2xl mx-auto">
          <div class="error-icon mx-auto mb-6"
               :style="{
                 backgroundColor: 'var(--color-error)' + '15',
                 color: 'var(--color-error)'
               }">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold mb-3" 
              :style="{ color: 'var(--color-content-primary)' }">
            Unable to Load Posts
          </h2>
          <p class="text-lg mb-8" 
             :style="{ color: 'var(--color-content-secondary)' }">
            There was a problem loading the blog. Please try refreshing the page.
          </p>
          <button @click="() => refresh()" class="btn btn-primary">
            Try Again
          </button>
        </div>

        <!-- Posts list -->
        <div v-else-if="posts && posts.length > 0" class="max-w-7xl mx-auto">
          <div class="space-y-12">
            <article v-for="post in posts" :key="post.slug" class="post-preview group">
              <!-- Use regular anchor for full page load in SSG -->
              <a :href="`/blog/${post.slug}`" class="block">
                <div class="flex items-center gap-4 mb-3 text-sm" 
                     :style="{ color: 'var(--color-content-tertiary)' }">
                  <time :datetime="post.date">
                    {{ formatDate(post.date) }}
                  </time>
                  <span v-if="post.readingTime">•</span>
                  <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
                  <span v-if="post.author">•</span>
                  <span v-if="post.author">{{ post.author }}</span>
                </div>
                
                <h2 class="text-2xl md:text-3xl font-bold mb-3 transition-colors group-hover:text-primary-600" 
                    :style="{ color: 'var(--color-content-primary)' }">
                  {{ post.title }}
                </h2>
                
                <p class="text-base md:text-lg mb-4 leading-relaxed" 
                   :style="{ color: 'var(--color-content-secondary)' }">
                  {{ post.excerpt }}
                </p>
                
                <div class="flex items-center justify-between">
                  <span class="font-semibold transition-colors group-hover:text-primary-600 inline-flex items-center" 
                        :style="{ color: 'var(--color-primary)' }">
                    Read More 
                    <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                  
                  <div v-if="post.tags && post.tags.length > 0" class="flex gap-2">
                    <span v-for="tag in post.tags.slice(0, 3)" 
                          :key="tag"
                          class="text-xs px-1 py-1 rounded"
                          :style="{ 
                            backgroundColor: 'var(--color-surface-tertiary)',
                            color: 'var(--color-content-secondary)'
                          }">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </a>
            </article>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center max-w-2xl mx-auto">
          <div class="empty-icon mx-auto mb-6"
               :style="{
                 backgroundColor: 'var(--color-surface-secondary)',
                 color: 'var(--color-content-tertiary)'
               }">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold mb-3" 
              :style="{ color: 'var(--color-content-primary)' }">
            No Posts Yet
          </h2>
          <p class="text-lg mb-8" 
             :style="{ color: 'var(--color-content-secondary)' }">
            We're working on bringing you insightful content about enterprise technology and system integration. Check back soon!
          </p>
          <NuxtLink to="/" class="btn btn-primary">
            Return to Homepage
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Blog index page - displays all blog posts
 * FIXED: Use $fetch to avoid importing server utilities in client bundle
 */

// Fetch posts using Nuxt's built-in server routes capability
// This prevents Vite from trying to bundle server/utils/blog.js
const { data: posts, pending, error, refresh } = await useAsyncData(
  'blog-posts',
  () => $fetch('/api/blog/posts')
)

// Format date helper - consistent UTC to avoid hydration mismatches
const formatDate = (dateString) => {
  // Parse the date as UTC to avoid timezone issues between server and client
  const date = new Date(dateString + 'T00:00:00Z')
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC'
  })
}

// SEO
useSeoMeta({
  title: 'Blog - 816tech',
  description: 'Insights on enterprise technology, system integration, and open source from the 816tech team.',
  ogTitle: '816tech Blog',
  ogDescription: 'Insights on enterprise technology, system integration, and open source.',
  ogType: 'website'
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.post-preview {
  border-bottom: 1px solid var(--color-border-primary);
  padding-bottom: 3rem;
  transition: all 0.2s ease;
}

.post-preview:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.post-preview:hover {
  transform: translateX(4px);
}

.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
