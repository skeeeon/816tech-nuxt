/**
 * RSS feed generation for 816tech blog
 * Generates XML feed for blog subscribers and feed readers
 * GET /api/feed.xml
 */

import { getAllPosts } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://816tech.com'
  
  try {
    // Get all published posts
    const posts = await getAllPosts()
    
    // Filter out future-dated posts
    const publishedPosts = posts.filter(post => {
      return new Date(post.date) <= new Date()
    })
    
    // Sort by date descending (most recent first)
    const sortedPosts = publishedPosts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    
    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>816tech Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Enterprise technology insights, system integration best practices, and open-source solutions from 816tech - Kansas City's trusted technology partner</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
    <generator>816tech Nuxt Blog</generator>
    <webMaster>info@816tech.com (816tech Team)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} 816tech. All rights reserved.</copyright>
    <category>Technology</category>
    <category>Enterprise Software</category>
    <category>System Integration</category>
    <image>
      <url>${baseUrl}/images/816tech-logo.png</url>
      <title>816tech Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
${sortedPosts.map(post => {
  // Escape XML special characters
  const escapeXml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  const title = escapeXml(post.title)
  const excerpt = escapeXml(post.excerpt)
  const author = escapeXml(post.author || '816tech Team')
  const postUrl = `${baseUrl}/blog/${post.slug}`
  
  // Build category tags
  const categoryTags = post.tags 
    ? post.tags.map(tag => `      <category>${escapeXml(tag)}</category>`).join('\n')
    : ''
  
  return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${excerpt}</description>
      <dc:creator>${author}</dc:creator>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${categoryTags}
    </item>`
}).join('\n')}
  </channel>
</rss>`

    // Set appropriate headers
    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')
    
    return rss
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate RSS feed'
    })
  }
})
