import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/@variables/site'
import { activityGroups } from '../src/@variables/activities.js'
import { notices } from '../src/@variables/notices.js'
import { stories } from '../src/@variables/stories.js'
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
 * RSS 피드.
 *
 * 네이버 서치어드바이저는 사이트맵과 별개로 RSS 제출을 지원하고, 공지·후기처럼
 * 계속 쌓이는 콘텐츠는 RSS 로도 제출해야 수집이 빠르다.
 *
 * ⚠️ 아이템이 하나도 없으면 네이버가 "RSS 형식이 아니다"라며 제출을 거부한다.
 *    각 아이템에 title / description / pubDate / guid 가 모두 있어야 한다.
 *
 * 공지·후기가 아직 없을 때는 활동 주제 페이지로 채운다. 빈 피드를 내보내는 것보다
 * 낫고, 활동 주제도 계속 늘어나는 콘텐츠라 피드에 어울린다.
 */
const rfc822 = (value: string) => new Date(`${value}T09:00:00+09:00`).toUTCString()

const xmlEscape = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

interface FeedEntry {
  path: string
  title: string
  description: string
  date: string
}

const postEntries: FeedEntry[] = [
  ...notices.map(item => ({
    path: `/notice/${item.slug}`,
    title: item.title,
    description: item.description,
    date: item.date,
  })),
  ...stories.map(item => ({
    path: `/stories/${item.slug}`,
    title: item.title,
    description: item.description,
    date: item.date,
  })),
].sort((a, b) => b.date.localeCompare(a.date))

const activityEntries: FeedEntry[] = activityGroups.map(group => ({
  path: `/activities/${group.slug}`,
  title: group.title,
  description: group.description,
  date: group.date,
}))

const feedEntries = postEntries.length > 0 ? postEntries : activityEntries

if (feedEntries.length === 0)
  console.warn('⚠️ RSS 에 담을 항목이 없다. 네이버가 제출을 거부한다.')

const feedItems = feedEntries.map(entry => `    <item>
      <title>${xmlEscape(entry.title)}</title>
      <link>${siteConfig.url}${entry.path}</link>
      <description>${xmlEscape(entry.description)}</description>
      <guid isPermaLink="true">${siteConfig.url}${entry.path}</guid>
      <pubDate>${rfc822(entry.date)}</pubDate>
    </item>`).join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${xmlEscape(siteConfig.description)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>
`

mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8')
writeFileSync(resolve(outDir, 'rss.xml'), rss, 'utf-8')

console.log(`✅ sitemap.xml (${routes.length}/${allRoutes.length} URLs) / rss.xml (${feedEntries.length} items) 생성 완료 → ${outDir}`)
