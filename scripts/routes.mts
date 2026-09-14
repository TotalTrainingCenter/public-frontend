import { activityGroups } from '../src/@variables/activities'
import { notices } from '../src/@variables/notices'
import { stories } from '../src/@variables/stories'

export interface RouteEntry {
  path: string
  /** true 면 프리렌더는 하되 sitemap.xml 에는 넣지 않는다 (noindex 페이지). */
  excludeFromSitemap?: boolean
  /** 사이트맵 우선순위 (0.0 ~ 1.0). */
  priority: number
  /** 변경 주기. */
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  /** 최종 수정일 (YYYY-MM-DD). */
  lastmod?: string
}

/**
 * 프리렌더 + 사이트맵이 공유하는 단일 라우트 목록.
 *
 * ⚠️ 새 페이지를 만들면 반드시 여기에 추가할 것.
 *    누락되면 정적 HTML이 생성되지 않아 네이버에서 영원히 안 잡힌다.
 */
export const getRoutes = (): RouteEntry[] => [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/features', priority: 0.9, changefreq: 'monthly' },
  { path: '/activities', priority: 0.9, changefreq: 'weekly' },
  { path: '/guide', priority: 0.8, changefreq: 'monthly' },
  { path: '/membership', priority: 0.8, changefreq: 'monthly' },
  { path: '/partnership', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },

  // 정책 원문은 policy.training-center.org 에 있다. 중복 색인을 피해 사이트맵에서 제외.
  { path: '/policy', priority: 0.3, changefreq: 'yearly', excludeFromSitemap: true },
  { path: '/notice', priority: 0.7, changefreq: 'weekly' },
  { path: '/stories', priority: 0.8, changefreq: 'weekly' },

  ...activityGroups
    .filter(item => !item.noindex)
    .map(item => ({ path: `/activities/${item.slug}`, priority: 0.8, changefreq: 'monthly' as const, lastmod: item.date })),

  ...notices
    .filter(item => !item.noindex)
    .map(item => ({ path: `/notice/${item.slug}`, priority: 0.5, changefreq: 'yearly' as const, lastmod: item.date })),

  ...stories
    .filter(item => !item.noindex)
    .map(item => ({ path: `/stories/${item.slug}`, priority: 0.7, changefreq: 'yearly' as const, lastmod: item.date })),
]
