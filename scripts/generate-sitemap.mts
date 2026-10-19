import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/@variables/site'
import { activityGroups } from '../src/@variables/activities.js'
import { faqs } from '../src/@variables/faqs.js'
import { membershipPlans } from '../src/@variables/membership.js'
import { notices } from '../src/@variables/notices.js'
import { stories } from '../src/@variables/stories.js'

// ESM 에서는 .mts 를 .mjs 로 적어야 tsx 가 찾는다. 린트 규칙과 맞지 않아 이 줄만 끈다.
// eslint-disable-next-line import/extensions
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

/**
 * llms.txt — AI 검색(ChatGPT·Perplexity·Gemini 등)이 사이트를 요약할 때 읽는 안내문.
 *
 * 형식은 https://llmstxt.org 의 제안을 따른다: H1 서비스명 → 인용문 한 줄 요약 → 섹션별 링크 목록.
 * 사이트맵과 같은 데이터(운영 DB 에서 빌드 때 수집한 것)로 만들어 내용이 어긋나지 않게 한다.
 * ⚠️ 공개 사이트에 이미 실린 내용만 넣는다. 비공개 활동·등급을 여기에 더하지 말 것.
 */
const totalActivities = activityGroups.reduce((sum, group) => sum + group.items.length, 0)

const llms = `# ${siteConfig.name} (${siteConfig.nameEn})

> ${siteConfig.description}

- 슬로건: ${siteConfig.slogan}
- 활동 주제 ${activityGroups.length}개, 세부 활동 ${totalActivities}개. 활동마다 인증 수단(사진·영상·텍스트)이 정해져 있고, 수행 직후의 원본만 인증으로 인정한다.
- 공식 플랫폼(로그인 필요): ${siteConfig.platformUrl}
- 문의: ${siteConfig.contact.email}

## 소개

- [서비스 소개](${siteConfig.url}/about)
- [주요 기능](${siteConfig.url}/features): 활동 제시 → 수행 → 기록 → 인증 → 누적
- [이용 가이드](${siteConfig.url}/guide)
- [앱 다운로드](${siteConfig.url}/download): Mac 앱(Apple 실리콘), iPhone·Android 앱은 준비 중
- [변경 기록](${siteConfig.url}/changelog): 웹 서비스·앱 배포별 새 기능·변경·수정 내역
- [제휴 문의](${siteConfig.url}/partnership): 기업·학교·공공기관 단체 운영

## 멤버십

${membershipPlans.map(plan => `- ${plan.name}: ${plan.price} / ${plan.period} — ${plan.summary}`).join('\n')}

자세한 내용: ${siteConfig.url}/membership

## 활동 주제

${activityGroups.map(group => `- [${group.title}](${siteConfig.url}/activities/${group.slug}): ${group.description}`).join('\n')}

## 자주 묻는 질문

${faqs.map(faq => `- ${faq.question} ${faq.answer}`).join('\n')}

## 선택

- [공지사항](${siteConfig.url}/notice)
- [약관 및 정책](${siteConfig.policyUrl})
`

mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8')
writeFileSync(resolve(outDir, 'rss.xml'), rss, 'utf-8')
writeFileSync(resolve(outDir, 'llms.txt'), llms, 'utf-8')

console.log(`✅ sitemap.xml (${routes.length}/${allRoutes.length} URLs) / rss.xml (${feedEntries.length} items) / llms.txt 생성 완료 → ${outDir}`)
