<template>
  <div class="blog-index-page">
    <!-- Page header -->
    <div class="page-header py-12" :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
      <div class="container mx-auto px-4 text-center">
        <p class="text-lg" :style="{ color: 'var(--color-content-secondary)' }">
          Insights on enterprise technology, system integration, and open source.
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="py-16">
      <div class="container mx-auto px-4">
        <!-- Loading state -->
        <div v-if="pending" class="text-center">
          <p :style="{ color: 'var(--color-content-secondary)' }">Loading posts...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center">
          <h2 class="text-xl font-semibold mb-2">Unable to Load Posts</h2>
          <p>There was a problem loading the blog. Please try again later.</p>
        </div>

        <!-- Posts list -->
        <div v-else-if="posts && posts.length > 0" class="max-w-4xl mx-auto">
          <div class="space-y-12">
            <div v-for="post in posts" :key="post.slug" class="post-preview group">
              <NuxtLink :to="`/blog/${post.slug}`" class="block">
                <p class="text-sm mb-2" :style="{ color: 'var(--color-content-secondary)' }">
                  {{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                </p>
                <h2 class="text-2xl font-bold mb-3 transition-colors group-hover:text-primary-600" :style="{ color: 'var(--color-content-primary)' }">
                  {{ post.title }}
                </h2>
                <p class="text-base mb-4" :style="{ color: 'var(--color-content-secondary)' }">
                  {{ post.excerpt }}
                </p>
                <span class="font-semibold transition-colors group-hover:text-primary-600" :style="{ color: 'var(--color-primary)' }">
                  Read More &rarr;
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center">
          <h2 class="text-xl font-semibold mb-2">No Posts Yet</h2>
          <p>There are currently no blog posts available. Check back soon!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// By removing definePageMeta, this page will now use layouts/default.vue automatically.

const { getAllPosts } = useBlog()
const { data: posts, pending, error } = getAllPosts()

useSeoMeta({
  title: 'Blog - 816tech',
  description: 'Insights on enterprise technology, system integration, and open source from the 816tech team.',
  ogTitle: '816tech Blog',
  ogDescription: 'Insights on enterprise technology, system integration, and open source.'
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}
.post-preview {
  border-bottom: 1px solid var(--color-border-primary);
  padding-bottom: 2rem;
}
.post-preview:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
