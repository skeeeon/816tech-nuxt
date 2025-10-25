/**
 * Markdown processing utilities for 816tech blog
 * Configures marked with syntax highlighting and GFM support
 */

import { marked } from 'marked'
import hljs from 'highlight.js'

/**
 * Configure marked with custom renderer and options
 * Supports syntax highlighting, GFM, and smart typography
 */
export function configureMarked() {
  // Create custom renderer for additional control
  const renderer = new marked.Renderer()
  
  // Customize heading rendering to add IDs for anchor links
  renderer.heading = function({ text, depth }) {
    // In marked v5+, heading receives a token object with text and depth properties
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    return `<h${depth} id="${escapedText}">${text}</h${depth}>`
  }
  
  // Customize code block rendering with syntax highlighting
  renderer.code = function({ text, lang }) {
    // In marked v5+, code receives a token object with text and lang properties
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
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    pedantic: false,
    smartLists: true,
    smartypants: true, // Smart quotes and dashes
    xhtml: false
  })
}

/**
 * Parse markdown string to HTML
 * @param {string} markdown - Raw markdown string
 * @returns {string} HTML string
 */
export async function parseMarkdown(markdown) {
  // Ensure marked is configured
  configureMarked()
  
  // Parse markdown to HTML
  return marked.parse(markdown)
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
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
 * Extract reading time from markdown content
 * @param {string} content - Markdown content
 * @returns {number} Estimated reading time in minutes
 */
export function getReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
