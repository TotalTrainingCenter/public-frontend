import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { getI18n } from '@/plugins/i18n'
import { siteConfig } from '@variables/site'

/** vue-i18n 로케일 → og:locale 표기. */
const OG_LOCALE: Record<string, string> = {
  ko: 'ko_KR',
  ja: 'ja_JP',
  en: 'en_US',
}

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

  /*
   * 사이트명은 화면에 보이는 문자열이라 로케일을 따른다.
   *
   * ⚠️ 이 값은 setup 시점에 한 번 정해진다. 페이지 안에서 언어를 바꿔도
   *    <title> 은 새로고침 전까지 그대로다. 프리렌더는 __PRERENDER_LOCALE__ 로
   *    ko 가 강제되므로 색인용 HTML 은 언제나 한국어다.
   */
  const { t, locale } = useI18n()

  /* og:locale 은 언어_지역 형식이라 로케일 코드를 그대로 쓸 수 없다. */
  const ogLocale = OG_LOCALE[locale.value] ?? OG_LOCALE.en

  const canonical = `${siteConfig.url}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`
  const title = `${options.title} | ${t('site.name')}`

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
      { property: 'og:site_name', content: t('site.name') },
      { property: 'og:locale', content: ogLocale },
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

/*
 * 사이트 전역 Organization / WebSite 구조화 데이터. 랜딩에서 1회만 사용.
 *
 * 컴포저블이 아니라 i18n 인스턴스에서 직접 꺼낸다.
 * ⚠️ Organization.name 은 법인/브랜드 식별자라 번역하지 않는다.
 *    영문 표기는 alternateName 이 맡는다. 설명문과 사이트 표시명만 로케일을 따른다.
 */
export const organizationJsonLd = () => ([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteConfig.name,
    'alternateName': siteConfig.nameEn,
    'url': siteConfig.url,
    'logo': `${siteConfig.url}/ttc_logo.png`,
    'description': getI18n().global.t('site.description'),
    'sameAs': Object.values(siteConfig.sns).filter(Boolean),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': getI18n().global.t('site.name'),
    'url': siteConfig.url,
    'inLanguage': 'ko-KR',
  },
])
