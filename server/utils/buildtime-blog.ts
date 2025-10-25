/**
 * Build-time blog utilities for 816tech
 * 
 * IMPORTANT: This file is ONLY used during the Nuxt build process
 * in the nitro:config hook. It should NEVER be imported by runtime
 * server utilities or client-side code.
 * 
 * Purpose: Extract blog post slugs from markdown files for static
 * route generation during the build.
 */

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

/**
 * Get the blog posts directory path
 * @returns {string} Absolute path to blog content directory
 */
function getBlogDirectory(): string {
  return path.resolve(process.cwd(), 'content/blog')
}

/**
 * Extract slug from a markdown file's frontmatter
 * @param {string} filename - Name of the markdown file
 * @returns {Promise<string|null>} Slug or null if invalid
 */
async function extractSlugFromFile(filename: string): Promise<string | null> {
  try {
    const blogDir = getBlogDirectory()
    const fullPath = path.join(blogDir, filename)
    const fileContents = await fs.readFile(fullPath, 'utf8')
    
    // Parse frontmatter only (no need to parse full markdown)
    const { data } = matter(fileContents)
    
    // Return slug if it exists, otherwise null
    return data.slug || null
  } catch (error) {
    console.error(`[buildtime-blog] Error extracting slug from ${filename}:`, error)
    return null
  }
}

/**
 * Get all blog post slugs for static route generation
 * This is used ONLY during build time to determine which routes to prerender
 * 
 * @returns {Promise<string[]>} Array of blog post slugs
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const blogDir = getBlogDirectory()
    
    // Check if blog directory exists
    try {
      await fs.access(blogDir)
    } catch {
      console.warn('[buildtime-blog] Blog directory not found, skipping blog route generation')
      return []
    }
    
    // Read all files in the blog directory
    const filenames = await fs.readdir(blogDir)
    
    // Filter to only markdown files
    const mdFiles = filenames.filter(fn => fn.endsWith('.md'))
    
    if (mdFiles.length === 0) {
      console.warn('[buildtime-blog] No markdown files found in blog directory')
      return []
    }
    
    // Extract slugs from all markdown files
    const slugPromises = mdFiles.map(filename => extractSlugFromFile(filename))
    const slugs = await Promise.all(slugPromises)
    
    // Filter out null values (invalid files)
    const validSlugs = slugs.filter((slug): slug is string => slug !== null)
    
    console.log(`[buildtime-blog] Found ${validSlugs.length} blog posts for prerendering:`, validSlugs)
    
    return validSlugs
  } catch (error) {
    console.error('[buildtime-blog] Error reading blog directory:', error)
    return []
  }
}

/**
 * Validate that a slug is safe for use in URLs
 * @param {string} slug - Slug to validate
 * @returns {boolean} Whether slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Slugs should be lowercase alphanumeric with hyphens
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug)
}
