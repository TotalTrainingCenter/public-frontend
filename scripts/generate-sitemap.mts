import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/@variables/site'
import { getRoutes } from './routes.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = process.env.SITEMAP_OUT_DIR ?? resolve(root, 'dist')
const today = new Date().toISOString().slice(0, 10)

const allRoutes = getRoutes()

// noindex 페이지는 사이트맵에 넣지 않는다. 넣으면 서치콘솔에서 경고가 난다.
const routes = allRoutes.filter(route => !route.excludeFromSitemap)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${siteConfig.url}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${route.lastmod ?? today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`

/**
 * 네이버 서치어드바이저는 사이트맵과 별개로 RSS 제출을 지원한다.
 * 공지/후기처럼 계속 쌓이는 콘텐츠는 RSS 로도 제출해야 수집이 빠르다.
 */
const feedItems = routes
  .filter(route => route.path.startsWith('/stories/') || route.path.startsWith('/notice/'))
  .map(route => `    <item>
      <link>${siteConfig.url}${route.path}</link>
      <guid>${siteConfig.url}${route.path}</guid>
      <pubDate>${new Date(route.lastmod ?? today).toUTCString()}</pubDate>
    </item>`)
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>ko</language>
${feedItems}
  </channel>
</rss>
`

mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8')
writeFileSync(resolve(outDir, 'rss.xml'), rss, 'utf-8')

console.log(`✅ sitemap.xml (${routes.length}/${allRoutes.length} URLs) / rss.xml 생성 완료 → ${outDir}`)
