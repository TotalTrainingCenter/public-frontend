/**
 * 공개 소개 사이트 전역 설정.
 * 네비게이션 / 푸터 / 사이트맵 / 메타가 모두 이 파일을 단일 출처로 사용한다.
 */

/**
 * import.meta.env 안전 접근.
 *
 * 이 파일은 Vite 번들뿐 아니라 Node 에서 실행되는
 * scripts/generate-sitemap.mts 에서도 임포트된다.
 * Node 에는 import.meta.env 가 없으므로 반드시 이 헬퍼를 거칠 것.
 */
const env = (key: string): string | undefined =>
  (import.meta as unknown as { env?: Record<string, string> }).env?.[key]

export const siteConfig = {
  name: '종합 훈련 센터',
  nameEn: 'Total Training Center',
  shortName: 'TTC',
  slogan: '일상을 루틴으로, 일상을 훈련으로',
  description:
    '종합 훈련 센터는 일상 속 행동과 습관을 활동 주제로 제시하고, 수행 후 기록하고 인증받는 기록형 커뮤니티 플랫폼입니다.',

  /** 공개 사이트 정본 주소 (apex). www 는 여기로 301. */
  url: env('VITE_SITE_URL') || 'https://training-center.org',

  /** 로그인이 필요한 공식 플랫폼(기존 SPA) 주소. */
  platformUrl: env('VITE_PLATFORM_URL') || 'https://total.training-center.org',

  /**
   * 사이트맵/RSS 등 로케일 개념이 없는 산출물의 기본값.
   * ⚠️ 페이지 메타의 og:locale 은 이걸 쓰지 않는다. useSeo 가 현재 언어로 만든다.
   */
  locale: 'ko_KR',
  ogImage: '/og-image.png',

  contact: {
    /** 제휴·문의 대표 메일. */
    email: 'contact@training-center.org',
  },

  /**
   * 앱 내려받기(/download).
   * ℹ️ 맥 설치 파일 주소는 판이 바뀌어도 그대로인 고정 링크다. 새 판을 올리면 version·크기·sha256 만 바꾼다.
   */
  apps: {
    mac: {
      url: 'https://training-center.org/downloads/mac/TTC.dmg',
      version: '1.0.1',
      sizeBytes: 90_951_899,
      sha256: 'd76cc51d223e5f34fcbfafdadb0b99f1516c068c1f9db41fd4f94ff6caac5435',
    },

    /** iPhone 앱(App Store). 아이패드에서도 돌지만 아이폰 화면을 키운 것이라 안내는 iPhone 으로만 한다. */
    ios: {
      url: 'https://apps.apple.com/kr/app/id6823595030',
      version: '1.0.1',
      minOs: '17.0',
    },
  },

  /** 약관·정책 원문이 있는 곳. 공개 사이트는 중복 게시하지 않고 이곳으로 보낸다. */
  policyUrl: 'https://policy.training-center.org',

  sns: {
    instagram: 'https://www.instagram.com/kr.ttc.ceo.ktm',
    threads: 'https://www.threads.com/@kr.ttc.ceo.ktm',
    facebook: 'https://www.facebook.com/kr.ttc.ceo.ktm',
    x: 'https://x.com/KRTTC0001',

    // TODO: 네이버 검색 대응의 핵심. 개설 후 주소를 채울 것.
    naverBlog: '',
    naverCafe: '',
  },
} as const

export interface NavItem {

  /**
   * i18n 메시지 키. 화면에 그릴 때 컴포넌트가 $t() 로 푼다.
   *
   * ⚠️ 이 파일은 scripts/generate-sitemap.mts 에서도 임포트된다.
   *    Node 에는 vue-i18n 이 없으므로 여기에 번역문이나 $t 를 두면 안 된다.
   *    사이트맵은 `to` 만 읽으므로 키만 들고 있어도 문제없다.
   */
  titleKey: string
  to?: string
  href?: string
  children?: NavItem[]
}

/** 상단 GNB. TheNavbar 와 sitemap 생성 스크립트가 공유한다. */
export const navigation: NavItem[] = [
  {
    titleKey: 'nav.about',
    to: '/about',
    children: [
      { titleKey: 'nav.aboutService', to: '/about' },
      { titleKey: 'nav.features', to: '/features' },
      { titleKey: 'nav.download', to: '/download' },
      { titleKey: 'nav.changelog', to: '/changelog' },
    ],
  },
  {
    titleKey: 'nav.activities',
    to: '/activities',
    children: [
      { titleKey: 'nav.activityTopics', to: '/activities' },
      { titleKey: 'nav.guide', to: '/guide' },
    ],
  },
  { titleKey: 'nav.membership', to: '/membership' },
  {
    titleKey: 'nav.news',
    to: '/notice',
    children: [
      { titleKey: 'nav.notice', to: '/notice' },
      { titleKey: 'nav.stories', to: '/stories' },
    ],
  },
  { titleKey: 'nav.partnership', to: '/partnership' },
  { titleKey: 'nav.faq', to: '/faq' },
]

/**
 * 약관·정책 문서.
 *
 * ⚠️ 원문은 policy.training-center.org 한 곳에만 둔다.
 *    공개 사이트에 같은 내용을 복제하면
 *    (1) 두 도메인 간 중복 콘텐츠로 평가가 깎이고
 *    (2) 법적 문서가 두 벌이 되어 개정 시 어긋난다.
 */
export const policyDocuments: NavItem[] = [
  { titleKey: 'policy.terms', href: `${siteConfig.policyUrl}/policy2` },
  { titleKey: 'policy.privacy', href: `${siteConfig.policyUrl}/policy1` },
  { titleKey: 'policy.refund', href: `${siteConfig.policyUrl}/policy3` },
  { titleKey: 'policy.community', href: `${siteConfig.policyUrl}/policy4` },
  { titleKey: 'policy.adult', href: `${siteConfig.policyUrl}/policy5` },
  { titleKey: 'policy.location', href: `${siteConfig.policyUrl}/policy6` },
  { titleKey: 'policy.youth', href: `${siteConfig.policyUrl}/policy7` },
  { titleKey: 'policy.marketing', href: `${siteConfig.policyUrl}/policy8` },
]

/** 푸터 하단 법적 고지 링크. */
export const policyLinks: NavItem[] = [
  { titleKey: 'policy.terms', href: `${siteConfig.policyUrl}/policy2` },
  { titleKey: 'policy.privacy', href: `${siteConfig.policyUrl}/policy1` },
  { titleKey: 'policy.all', to: '/policy' },
]
