<template>
  <div class="blog-post-page py-16">
    <div class="container mx-auto px-4">
      <!-- Loading state -->
      <div v-if="pending" class="text-center">
        <p :style="{ color: 'var(--color-content-secondary)' }">Loading post...</p>
      </div>

      <!-- Post content -->
      <article v-else-if="post" class="max-w-4xl mx-auto">
        <header class="mb-8 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-3" :style="{ color: 'var(--color-content-primary)' }">
            {{ post.title }}
          </h1>
          <p class="text-base" :style="{ color: 'var(--color-content-secondary)' }">
            Posted by {{ post.author }} on {{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </header>

        <div class="prose max-w-none" v-html="post.content"></div>
      </article>
    </div>
  </div>
</template>

<script setup>
// By removing definePageMeta, this page will now use layouts/default.vue automatically.

const { getPostBySlug } = useBlog()
const route = useRoute()
const slug = route.params.slug

const { data: post, pending, error } = getPostBySlug(slug)

// Handle 404 for unknown posts
watch(error, (newError) => {
  if (newError) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found',
      fatal: true
    })
  }
})

// Dynamic SEO based on post data
watchEffect(() => {
  if (post.value) {
    useSeoMeta({
      title: `${post.value.title} - 816tech Blog`,
      description: post.value.excerpt,
      ogTitle: post.value.title,
      ogDescription: post.value.excerpt,
      ogType: 'article',
      'article:published_time': new Date(post.value.date).toISOString(),
      'article:author': post.value.author
    })
  }
})
</script>

<style>
/* Import a theme for highlight.js that works well in light and dark modes */
@import 'highlight.js/styles/atom-one-dark.css';

/*
 * Enhanced Prose Styles for Blog Content
 * This provides better spacing, typography, and styling for rendered markdown.
*/
.prose {
  color: var(--color-content-secondary);
  line-height: 1.7;
  font-size: 1.125rem; /* Slightly larger base font size for readability */
}

/* --- Headings --- */
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: var(--color-content-primary);
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}
.prose h2 {
  font-size: 1.875rem;
  border-bottom: 1px solid var(--color-border-primary);
  padding-bottom: 0.5rem;
}
.prose h3 {
  font-size: 1.5rem;
}

/* --- Paragraphs and Links --- */
.prose p {
  margin-bottom: 1.25em;
}
.prose a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary-200);
  transition: all 0.2s ease;
}
.prose a:hover {
  color: var(--primary-hover);
  background-color: var(--color-primary-100);
}
.dark .prose a:hover {
  background-color: rgba(96, 165, 250, 0.2); /* blue-400 with alpha */
}

/* --- Lists --- */
.prose ul, .prose ol {
  padding-left: 1.5em;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
.prose li {
  margin-bottom: 0.75em;
}
.prose li > p {
  margin-bottom: 0.5em;
}

/* --- Code Blocks (pre) and Inline Code (code) --- */
.prose code {
  background-color: var(--color-surface-secondary);
  color: var(--color-content-secondary);
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid var(--color-border-primary);
}

/* Code blocks container */
.prose pre {
  background-color: #282c34; /* Matches atom-one-dark theme */
  border-radius: 8px;
  padding: 1.25em;
  overflow-x: auto;
  margin-top: 1.5em;
  margin-bottom: 2em;
}

/* Reset styles for code inside a pre block */
.prose pre code {
  background-color: transparent;
  color: inherit;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 100%;
  line-height: 1.5;
}

/* --- Blockquotes --- */
.prose blockquote {
  padding-left: 1.5em;
  border-left: 4px solid var(--color-border-primary);
  margin-left: 0;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  font-style: italic;
  color: var(--color-content-secondary);
}
</style>
