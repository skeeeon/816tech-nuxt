/**
 * Server-only blog utilities for 816tech
 * These functions run ONLY on the server/build side, never in browser
 * Safe to use Node.js APIs like fs here
 * FIXED: Use absolute import path for markdown utilities
 */

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import hljs from 'highlight.js'

/**
 * Configure marked with custom renderer and options
 * Supports syntax highlighting, GFM, and smart typography
 * MOVED: From utils/markdown.js to avoid import resolution issues
 */
function configureMarked() {
  const renderer = new marked.Renderer()
  
  // Customize heading rendering to add IDs for anchor links
  renderer.heading = function({ text, depth }) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    return `<h${depth} id="${escapedText}">${text}</h${depth}>`
  }
  
  // Customize code block rendering with syntax highlighting
  renderer.code = function({ text, lang }) {
    const code = text
    const language = lang
    
    // If language is specified and supported, highlight it
    if (language && hljs.getLanguage(language)) {
      try {
        const highlighted = hljs.highlight(code, { 
          language: language,
          ignoreIllegals: true 
        }).value
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
      } catch (err) {
        console.error('Syntax highlighting error:', err)
      }
    }
    
    // Auto-detect language if not specified
    try {
      const result = hljs.highlightAuto(code)
      return `<pre><code class="hljs language-${result.language}">${result.value}</code></pre>`
    } catch (err) {
      // Fallback to plain code block
      return `<pre><code class="hljs">${escapeHtml(code)}</code></pre>`
    }
  }
  
  // Configure marked options
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: true,
    xhtml: false
  })
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * Parse markdown string to HTML
 */
function parseMarkdown(markdown) {
  configureMarked()
  return marked.parse(markdown)
}

/**
 * Extract reading time from markdown content
 */
function getReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Get the posts directory path
 */
function getPostsDirectory() {
  return path.resolve(process.cwd(), 'content/blog')
}

/**
 * Read and parse a single markdown file
 * @param {string} filename - Name of the markdown file
 * @returns {Promise<Object|null>} Parsed post object or null
 */
async function readPostFile(filename) {
  try {
    const postsDir = getPostsDirectory()
    const fullPath = path.join(postsDir, filename)
    const fileContents = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Parse markdown to HTML
    const htmlContent = parseMarkdown(content)
    
    // Calculate reading time
    const readingTime = getReadingTime(content)
    
    return {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      author: data.author || '816tech',
      slug: data.slug || 'untitled',
      excerpt: data.excerpt || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: htmlContent,
      readingTime
    }
  } catch (error) {
    console.error(`Error reading post file ${filename}:`, error)
    return null
  }
}

/**
 * Get all blog posts (metadata only, no content)
 * @returns {Promise<Array>} Array of post objects
 */
export async function getAllPosts() {
  try {
    const postsDir = getPostsDirectory()
    const filenames = await fs.readdir(postsDir)
    const mdFiles = filenames.filter(fn => fn.endsWith('.md'))
    
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const post = await readPostFile(filename)
        if (!post) return null
        
        // Return only metadata (no content) for listing
        return {
          title: post.title,
          date: post.date,
          author: post.author,
          slug: post.slug,
          excerpt: post.excerpt,
          tags: post.tags,
          readingTime: post.readingTime
        }
      })
    )
    
    // Filter out nulls and sort by date
    return posts
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error getting all posts:', error)
    return []
  }
}

/**
 * Get a single post by slug (with content)
 * @param {string} slug - URL slug of the post
 * @returns {Promise<Object|null>} Full post object with content
 */
export async function getPostBySlug(slug) {
  try {
    const postsDir = getPostsDirectory()
    const filenames = await fs.readdir(postsDir)
    
    for (const filename of filenames) {
      if (filename.endsWith('.md')) {
        const fullPath = path.join(postsDir, filename)
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (data.slug === slug) {
          // Found the matching post, get full content
          const post = await readPostFile(filename)
          return post
        }
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return null
  }
}

/**
 * Get all post slugs for static path generation
 * @returns {Promise<Array>} Array of slug strings
 */
export async function getAllPostSlugs() {
  try {
    const postsDir = getPostsDirectory()
    const filenames = await fs.readdir(postsDir)
    const mdFiles = filenames.filter(fn => fn.endsWith('.md'))
    
    const slugs = await Promise.all(
      mdFiles.map(async (filename) => {
        const fullPath = path.join(postsDir, filename)
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data } = matter(fileContents)
        return data.slug
      })
    )
    
    return slugs.filter(Boolean)
  } catch (error) {
    console.error('Error getting post slugs:', error)
    return []
  }
}
