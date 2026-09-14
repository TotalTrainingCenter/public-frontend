import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { siteConfig } from '@variables/site'

export interface SeoOptions {

  /** 페이지 고유 제목. "제목 | 종합 훈련 센터" 형태로 조합된다. */
  title: string

  /** 페이지 고유 설명. 검색결과 스니펫으로 쓰이므로 페이지마다 달라야 한다. */
  description: string

  /** OG 이미지 경로(절대/상대). 미지정 시 사이트 기본값. */
  image?: string

  /** 검색 색인 제외 여부. */
  noindex?: boolean

  /** 추가 JSON-LD 구조화 데이터. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * 페이지별 메타/OG/canonical/JSON-LD 를 설정한다.
 *
 * ⚠️ 모든 공개 페이지는 반드시 이 컴포저블을 호출해야 한다.
 *    호출하지 않으면 index.html 의 기본 메타를 그대로 쓰게 되어
 *    검색엔진이 중복 페이지로 판단한다.
 */
export const useSeo = (options: SeoOptions) => {
  const route = useRoute()

  const canonical = `${siteConfig.url}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`
  const title = `${options.title} | ${siteConfig.name}`

  const image = options.image
    ? (options.image.startsWith('http') ? options.image : `${siteConfig.url}${options.image}`)
    : `${siteConfig.url}${siteConfig.ogImage}`

  const jsonLdList = options.jsonLd
    ? (Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd])
    : []

  useHead({
    title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: options.description },
      { name: 'robots', content: options.noindex ? 'noindex, nofollow' : 'index, follow' },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:locale', content: siteConfig.locale },
      { property: 'og:title', content: title },
      { property: 'og:description', content: options.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: options.description },
      { name: 'twitter:image', content: image },
    ],
    script: jsonLdList.map(item => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(item),
    })),
  })
}

/** 사이트 전역 Organization / WebSite 구조화 데이터. 랜딩에서 1회만 사용. */
export const organizationJsonLd = () => ([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteConfig.name,
    'alternateName': siteConfig.nameEn,
    'url': siteConfig.url,
    'logo': `${siteConfig.url}/ttc_logo.png`,
    'description': siteConfig.description,
    'sameAs': Object.values(siteConfig.sns).filter(Boolean),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': siteConfig.name,
    'url': siteConfig.url,
    'inLanguage': 'ko-KR',
  },
])
