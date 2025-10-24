import { marked } from 'marked'
import matter from 'gray-matter'
import { promises as fs } from 'fs'
import path from 'path'

const postsDirectory = path.resolve(process.cwd(), 'content/blog')

/**
 * Get a single post by its URL slug.
 * This now reads all files to find the one with the matching slug in its frontmatter.
 * @param {string} slug - The URL slug of the post
 * @returns {Promise<Object|null>} The post object or null if not found
 */
export const getPostBySlug = async (slug) => {
  try {
    const filenames = await fs.readdir(postsDirectory)
    for (const filename of filenames) {
      if (filename.endsWith('.md')) {
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        if (data.slug === slug) {
          const htmlContent = await marked(content)
          return {
            ...data,
            content: htmlContent
          }
        }
      }
    }
    // If no post was found after checking all files
    return null
  } catch (error) {
    console.error(`Error finding blog post for slug "${slug}":`, error)
    return null
  }
}

/**
 * Get all blog posts, sorted by date.
 * This now reads the slug from the frontmatter.
 * @returns {Promise<Array>} Array of post objects
 */
export const getAllPosts = async () => {
  try {
    const filenames = await fs.readdir(postsDirectory)
    const mdFiles = filenames.filter(fn => fn.endsWith('.md'))
    
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data } = matter(fileContents)
        // The slug now comes from the frontmatter
        return {
          ...data
        }
      })
    )
    
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error reading all blog posts:', error)
    return []
  }
}
