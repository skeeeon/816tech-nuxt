/**
 * Dynamic sitemap generation for 816tech
 * Generates XML sitemap for search engines
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://816tech.com'
  
  // Define the pages and their priorities
  const routes = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString()
    },
    {
      url: '/#solutions',
      changefreq: 'monthly', 
      priority: 0.9,
      lastmod: new Date().toISOString()
    },
    {
      url: '/#approach',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    {
      url: '/#about',
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    },
    {
      url: '/#contact',
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: new Date().toISOString()
    }
  ]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Set appropriate headers
  setHeader(event, 'content-type', 'application/xml')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')
  
  return sitemap
})
