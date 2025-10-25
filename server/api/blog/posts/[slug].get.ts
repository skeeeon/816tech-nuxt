/**
 * API endpoint to get a single blog post by slug
 * GET /api/blog/posts/:slug
 */

import { getPostBySlug } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }
  
  try {
    const post = await getPostBySlug(slug)
    
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
      })
    }
    
    return post
  } catch (error: any) {
    // If it's already a Nuxt error, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, it's an internal error
    console.error(`Error fetching blog post ${slug}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog post'
    })
  }
})
