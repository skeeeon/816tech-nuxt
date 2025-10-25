/**
 * API endpoint to get all blog posts
 * GET /api/blog/posts
 */

import { getAllPosts } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  try {
    const posts = await getAllPosts()
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog posts'
    })
  }
})
