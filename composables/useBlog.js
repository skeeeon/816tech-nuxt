/**
 * Blog composable for 816tech
 * Fetches blog data from the server API endpoints.
 */

export const useBlog = () => {
  /**
   * Get a single post by its slug by fetching from the API.
   * @param {string} slug - The slug of the post
   */
  const getPostBySlug = (slug) => {
    return useLazyAsyncData(`blog-post-${slug}`, () => $fetch(`/api/blog/${slug}`))
  }

  /**
   * Get all blog posts by fetching from the API.
   */
  const getAllPosts = () => {
    return useLazyAsyncData('all-blog-posts', () => $fetch('/api/blog'))
  }

  return {
    getPostBySlug,
    getAllPosts
  }
}
