<template>
  <div class="blog-post-page py-16">
    <div class="container mx-auto px-4">
      <!-- Loading state -->
      <div v-if="pending" class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="animate-pulse">
            <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p :style="{ color: 'var(--color-content-secondary)' }">
              Loading post...
            </p>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="fetchError" class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center max-w-md mx-auto px-4">
          <div class="error-icon mx-auto mb-6" 
               :style="{ 
                 color: 'var(--color-error)',
                 backgroundColor: 'var(--color-error)' + '15'
               }">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-4" 
              :style="{ color: 'var(--color-content-primary)' }">
            Error Loading Post
          </h1>
          <p class="text-base mb-8" 
             :style="{ color: 'var(--color-content-secondary)' }">
            There was a problem loading this blog post. Please try again.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/blog" class="btn btn-primary">
              Back to Blog
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Post content -->
      <article v-else-if="post" class="max-w-7xl mx-auto">
        <!-- Post header -->
        <header class="mb-12">
          <!-- Back to blog link - use regular anchor for full page load -->
          <a href="/blog"
             class="inline-flex items-center mb-6 text-sm font-medium transition-colors hover:text-primary-600"
             :style="{ color: 'var(--color-content-secondary)' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Blog
          </a>
          
          <!-- Post metadata -->
          <div class="flex flex-wrap items-center gap-4 mb-6 text-sm" 
               :style="{ color: 'var(--color-content-tertiary)' }">
            <time :datetime="post.date">
              {{ formatDate(post.date) }}
            </time>
            <span v-if="post.readingTime">•</span>
            <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
            <span v-if="post.author">•</span>
            <span v-if="post.author">By {{ post.author }}</span>
          </div>
          
          <!-- Post title -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" 
              :style="{ color: 'var(--color-content-primary)' }">
            {{ post.title }}
          </h1>
          
          <!-- Tags -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span v-for="tag in post.tags" 
                  :key="tag"
                  class="text-sm px-3 py-1 rounded-full"
                  :style="{ 
                    backgroundColor: 'var(--color-primary)' + '15',
                    color: 'var(--color-primary)'
                  }">
              {{ tag }}
            </span>
          </div>
          
          <!-- Excerpt if available -->
          <p v-if="post.excerpt" 
             class="text-lg md:text-xl leading-relaxed"
             :style="{ color: 'var(--color-content-secondary)' }">
            {{ post.excerpt }}
          </p>
        </header>

        <!-- Post content with enhanced prose styles -->
        <div class="prose prose-lg max-w-none" v-html="post.content"></div>
        
        <!-- Post footer -->
        <footer class="mt-16 pt-8 border-t" 
                :style="{ borderColor: 'var(--color-border-primary)' }">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p class="text-sm font-medium mb-2" 
                 :style="{ color: 'var(--color-content-primary)' }">
                Share this article
              </p>
              <div class="flex gap-3">
                <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(getPostUrl())}`"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="share-button"
                   :style="{ 
                     backgroundColor: 'var(--color-surface-secondary)',
                     color: 'var(--color-content-primary)'
                   }"
                   aria-label="Share on Twitter">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                
                <a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPostUrl())}`"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="share-button"
                   :style="{ 
                     backgroundColor: 'var(--color-surface-secondary)',
                     color: 'var(--color-content-primary)'
                   }"
                   aria-label="Share on LinkedIn">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <a href="/blog" class="btn btn-outlined">
              ← More Articles
            </a>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
/**
 * Blog post page - displays a single blog post
 * FIXED: Use $fetch to avoid importing server utilities in client bundle
 */

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()

// Fetch post using API route instead of direct import
// This prevents Vite from trying to bundle server/utils/blog.js
const { data: post, pending, error: fetchError } = await useAsyncData(
  `blog-post-${slug}`,
  () => $fetch(`/api/blog/posts/${slug}`)
)

// If post not found after loading, throw 404
watch(post, (newPost) => {
  if (!pending.value && !newPost && !fetchError.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found',
      fatal: true
    })
  }
}, { immediate: true })

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

// Get full post URL for sharing
const getPostUrl = () => {
  const baseUrl = config.public.siteUrl || 'https://816tech.com'
  return `${baseUrl}/blog/${slug}`
}

// Dynamic SEO based on post data
watchEffect(() => {
  if (post.value) {
    useSeoMeta({
      title: `${post.value.title} - 816tech Blog`,
      description: post.value.excerpt,
      ogTitle: post.value.title,
      ogDescription: post.value.excerpt,
      ogType: 'article',
      ogUrl: getPostUrl(),
      'article:published_time': new Date(post.value.date).toISOString(),
      'article:author': post.value.author,
      'article:tag': post.value.tags
    })
  }
})
</script>

<style>
/*
 * Enhanced Prose Styles for Blog Content
 * Includes syntax highlighting support via highlight.js
 */

.prose {
  color: var(--color-content-secondary);
  line-height: 1.8;
  font-size: 1.125rem;
}

/* Headings */
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: var(--color-content-primary);
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

.prose h2 {
  font-size: 2rem;
  border-bottom: 2px solid var(--color-border-primary);
  padding-bottom: 0.5rem;
  margin-top: 2.5em;
}

.prose h3 {
  font-size: 1.5rem;
  margin-top: 2em;
}

.prose h4 {
  font-size: 1.25rem;
}

/* Paragraphs */
.prose p {
  margin-bottom: 1.5em;
}

/* Links */
.prose a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary-200);
  transition: all 0.2s ease;
  font-weight: 500;
}

.prose a:hover {
  color: var(--primary-hover);
  background-color: var(--color-primary-100);
  border-bottom-color: var(--color-primary);
}

.dark .prose a:hover {
  background-color: rgba(96, 165, 250, 0.15);
}

/* Lists */
.prose ul, .prose ol {
  padding-left: 1.75em;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

.prose li {
  margin-bottom: 0.75em;
  line-height: 1.7;
}

.prose li > p {
  margin-bottom: 0.5em;
}

/* Strong emphasis */
.prose strong {
  color: var(--color-content-primary);
  font-weight: 600;
}

/* Code - inline */
.prose code {
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  padding: 0.2em 0.4em;
  margin: 0 0.1em;
  font-size: 0.875em;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid var(--color-border-primary);
  font-weight: 500;
}

/* Code blocks container */
.prose pre {
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  padding: 1.5em;
  overflow-x: auto;
  margin-top: 2em;
  margin-bottom: 2em;
  border: 1px solid var(--color-border-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .prose pre {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Reset styles for code inside pre blocks */
.prose pre code {
  background-color: transparent;
  color: inherit;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  border-radius: 0;
}

/* Blockquotes */
.prose blockquote {
  padding-left: 1.5em;
  border-left: 4px solid var(--color-primary);
  margin-left: 0;
  margin-top: 2em;
  margin-bottom: 2em;
  font-style: italic;
  color: var(--color-content-secondary);
  background-color: var(--color-surface-secondary);
  padding: 1.25em 1.5em;
  border-radius: 0 8px 8px 0;
}

/* Tables */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose th,
.prose td {
  padding: 0.75em 1em;
  border: 1px solid var(--color-border-primary);
  text-align: left;
}

.prose th {
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  font-weight: 600;
}

/* Images */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 2em;
  margin-bottom: 2em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .prose img {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Horizontal rules */
.prose hr {
  border: none;
  border-top: 2px solid var(--color-border-primary);
  margin: 3em 0;
}

/* Share buttons */
.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border-primary);
}

.share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: var(--color-primary) !important;
  color: white !important;
  border-color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .prose {
    font-size: 1rem;
  }
  
  .prose h2 {
    font-size: 1.75rem;
  }
  
  .prose h3 {
    font-size: 1.375rem;
  }
  
  .prose pre {
    padding: 1em;
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: 0;
  }
}
</style>
