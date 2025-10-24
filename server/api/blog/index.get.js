import { getAllPosts } from '~/server/utils/blogReader'

export default defineEventHandler(async () => {
  const posts = await getAllPosts()
  return posts
})
