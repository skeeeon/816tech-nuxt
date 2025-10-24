import { getPostBySlug } from '~/server/utils/blogReader'

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug
  const post = await getPostBySlug(slug)
  
  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }
  
  return post
})
