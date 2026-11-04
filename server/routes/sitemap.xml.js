/**
 * XML sitemap for search engines, served at /sitemap.xml (where robots.txt
 * points) and prerendered with the rest of the site.
 *
 * Fragment URLs like /#solutions are left out: search engines drop the
 * fragment, so they are all the homepage.
 */

import { getAllPosts } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const posts = await getAllPosts()
  const newest = posts[0]?.date

  const urls = [
    { loc: '/', changefreq: 'monthly', priority: 1.0 },
    { loc: '/blog', lastmod: newest, changefreq: 'weekly', priority: 0.8 },
    ...posts.map(post => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'yearly',
      priority: 0.7
    }))
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc === '/' ? '' : url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  return sitemap
})
