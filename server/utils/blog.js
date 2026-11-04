/**
 * Server-only blog utilities for 816tech
 * These functions run ONLY on the server/build side, never in browser
 * Safe to use Node.js APIs like fs here
 * UPDATED: Added image and imageAlt support for social media sharing
 */

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { getImageSize } from './image-size'

/**
 * Configure marked with custom renderer and options
 * Supports syntax highlighting, GFM, and smart typography
 */
function configureMarked() {
  const renderer = new marked.Renderer()
  
  // Customize heading rendering to add IDs for anchor links. The id is still
  // built from the raw text so existing #links keep working; the content is
  // rendered, so `code` and *emphasis* in a heading no longer show their markup.
  renderer.heading = function({ text, depth, tokens }) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    const content = this.parser.parseInline(tokens)
    const anchor = depth > 1
      ? `<a class="heading-anchor" href="#${escapedText}" aria-label="Link to this section">#</a>`
      : ''
    return `<h${depth} id="${escapedText}">${content}${anchor}</h${depth}>`
  }

  // Images carry their pixel size so the page doesn't jump while they load,
  // and every image after the first (usually the lead image, above the fold)
  // loads lazily.
  let imageCount = 0
  renderer.image = function({ href, title, text }) {
    const size = getImageSize(href)
    const attrs = [
      `src="${escapeHtml(href)}"`,
      `alt="${escapeHtml(text || '')}"`,
      title ? `title="${escapeHtml(title)}"` : '',
      size ? `width="${size.width}" height="${size.height}"` : '',
      imageCount++ === 0 ? 'fetchpriority="high"' : 'loading="lazy"',
      'decoding="async"'
    ]
    return `<img ${attrs.filter(Boolean).join(' ')}>`
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
 * Turn standalone images into figures. An image on its own line followed by a
 * paragraph that is entirely italic becomes <figure> + <figcaption>, which is
 * how posts already write captions:
 *
 *   ![alt](/images/blog/x.png)
 *
 *   *The caption.*
 */
function wrapFigures(html) {
  return html
    .replace(
      /<p>(<img [^>]+>)<\/p>\s*<p><em>((?:(?!<\/em>)[\s\S])*)<\/em><\/p>/g,
      '<figure>$1<figcaption>$2</figcaption></figure>'
    )
    .replace(/<p>(<img [^>]+>)<\/p>/g, '<figure>$1</figure>')
}

/**
 * Parse markdown string to HTML
 */
function parseMarkdown(markdown) {
  configureMarked()
  return wrapFigures(marked.parse(markdown))
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
 * A post with `draft: true` in its frontmatter renders in `nuxt dev` and is
 * left out everywhere else: the listing, the feed, the sitemap and its own URL.
 */
function isVisible(draft) {
  return !draft || import.meta.dev
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
      image: data.image || null,  // Social media image path
      imageAlt: data.imageAlt || data.title,  // Image alt text for accessibility
      draft: Boolean(data.draft),
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
        if (!post || !isVisible(post.draft)) return null

        // Return only metadata (no content) for listing
        return {
          title: post.title,
          date: post.date,
          author: post.author,
          slug: post.slug,
          excerpt: post.excerpt,
          tags: post.tags,
          image: post.image,  // Include for social sharing previews
          imageAlt: post.imageAlt,
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
          if (!isVisible(data.draft)) return null
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
        return isVisible(data.draft) ? data.slug : null
      })
    )
    
    return slugs.filter(Boolean)
  } catch (error) {
    console.error('Error getting post slugs:', error)
    return []
  }
}
