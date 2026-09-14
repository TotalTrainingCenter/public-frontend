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

  locale: 'ko_KR',
  ogImage: '/og-image.png',

  contact: {
    /** 제휴·문의 대표 메일. */
    email: 'contact@training-center.org',
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
  title: string
  to?: string
  href?: string
  children?: NavItem[]
}

/** 상단 GNB. TheNavbar 와 sitemap 생성 스크립트가 공유한다. */
export const navigation: NavItem[] = [
  {
    title: '소개',
    to: '/about',
    children: [
      { title: '서비스 소개', to: '/about' },
      { title: '주요 기능', to: '/features' },
    ],
  },
  {
    title: '활동',
    to: '/activities',
    children: [
      { title: '활동 주제', to: '/activities' },
      { title: '이용 가이드', to: '/guide' },
    ],
  },
  { title: '멤버십', to: '/membership' },
  {
    title: '소식',
    to: '/notice',
    children: [
      { title: '공지사항', to: '/notice' },
      { title: '활동 후기', to: '/stories' },
    ],
  },
  { title: '제휴 문의', to: '/partnership' },
  { title: 'FAQ', to: '/faq' },
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
  { title: '서비스 이용약관', href: `${siteConfig.policyUrl}/policy2` },
  { title: '개인정보 수집 및 처리방침', href: `${siteConfig.policyUrl}/policy1` },
  { title: '유료서비스 및 환불정책', href: `${siteConfig.policyUrl}/policy3` },
  { title: '콘텐츠 및 커뮤니티 운영정책', href: `${siteConfig.policyUrl}/policy4` },
  { title: '성인 콘텐츠 및 연령확인 정책', href: `${siteConfig.policyUrl}/policy5` },
  { title: '위치기반서비스 이용약관', href: `${siteConfig.policyUrl}/policy6` },
  { title: '청소년 보호정책', href: `${siteConfig.policyUrl}/policy7` },
  { title: '마케팅 정보 수신 동의', href: `${siteConfig.policyUrl}/policy8` },
]

/** 푸터 하단 법적 고지 링크. */
export const policyLinks: NavItem[] = [
  { title: '서비스 이용약관', href: `${siteConfig.policyUrl}/policy2` },
  { title: '개인정보 수집 및 처리방침', href: `${siteConfig.policyUrl}/policy1` },
  { title: '약관 및 정책 전체', to: '/policy' },
]
