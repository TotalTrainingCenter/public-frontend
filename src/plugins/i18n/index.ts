import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { parse } from 'cookie-es'
import { namespaceConfig } from '@layouts/stores/config'
import { themeConfig } from '@themeConfig'

/**
 * 지원 로케일. themeConfig.app.i18n.langConfig 와 짝을 이룬다.
 * 여기에 추가하면 locales/<코드>.json 도 같이 만들어야 한다.
 */
export const SUPPORTED_LOCALES = ['ko', 'ja', 'en'] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

const isSupported = (value: unknown): value is SupportedLocale =>
  typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)

const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(10, -5), value.default]),
)

/**
 * 저장된 언어를 '읽기만' 한다.
 *
 * cookieRef 를 쓰지 않는 이유: useCookie 는 쿠키가 없을 때 기본값을 즉시
 * document.cookie 에 써 버린다. 여기서 그러면 브라우저 감지가 돌기도 전에
 * 빈 값이 박히고, 이름으로 캐시되는 ref 라서 initCore 쪽 기본값과도 엇갈린다.
 * 쓰기는 initCore 의 _syncAppRtl 워처 한 곳에서만 한다.
 */
const storedLocale = (): string | null => {
  if (typeof document === 'undefined')
    return null

  const raw = parse(document.cookie)[namespaceConfig('language')]

  return raw ? decodeURIComponent(raw) : null
}

/**
 * 브라우저가 알려주는 선호 언어를 지원 로케일로 환산한다.
 *
 * navigator.languages 는 사용자가 OS/브라우저에 설정한 우선순위 목록이다.
 * 'ja-JP' → 'ja' 처럼 지역 꼬리표를 떼고 맨 앞에서부터 맞춰 본다.
 * 하나도 못 맞추면 null 을 돌려주고, 호출부가 기본 로케일로 떨어진다.
 */
export const detectBrowserLocale = (): SupportedLocale | null => {
  if (typeof navigator === 'undefined')
    return null

  const preferences = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  for (const preference of preferences) {
    const base = preference?.toLowerCase().split('-')[0]
    if (isSupported(base))
      return base
  }

  return null
}

/**
 * ⚠️ 프리렌더(헤드리스 크롬)에서는 브라우저 감지를 쓰면 안 된다.
 *
 * puppeteer 의 navigator.language 는 기본이 'en-US' 다. 감지를 그대로 두면
 * 정적 HTML 이 영어로 구워져서 한국어 페이지가 검색에서 통째로 사라진다.
 * prerender.mts 가 window.__PRERENDER_LOCALE__ 을 심어 주면 그 값을 따른다.
 */
const prerenderLocale = (): SupportedLocale | null => {
  if (typeof window === 'undefined')
    return null

  const injected = (window as any).__PRERENDER_LOCALE__

  return isSupported(injected) ? injected : null
}

/**
 * 최종 로케일 결정 순서:
 *   1. 프리렌더가 지정한 값 (정적 HTML 을 구울 때만)
 *   2. 쿠키에 남은 값 — 첫 방문 때 감지 결과가, 그 뒤엔 사용자가 고른 값이 들어간다
 *   3. 브라우저 선호 언어 (쿠키가 없는 첫 방문)
 *   4. themeConfig 의 기본 로케일
 */
export const resolveLocale = (): SupportedLocale => {
  const forced = prerenderLocale()
  if (forced)
    return forced

  const stored = storedLocale()
  if (isSupported(stored))
    return stored

  const detected = detectBrowserLocale()
  if (detected)
    return detected

  const fallback = themeConfig.app.i18n.defaultLocale

  return isSupported(fallback) ? fallback : 'en'
}

/**
 * 우리가 직접 만든 i18n 키의 모양. `action.save` 처럼 ASCII 네임스페이스 + 점이다.
 * 아직 추출하지 않은 한국어 원문과 구분하는 데 쓴다.
 */
const TRANSLATION_KEY_PATTERN = /^[a-z][\w-]*\./i

let _i18n: any = null

export const getI18n = () => {
  if (_i18n === null) {
    const locale = resolveLocale()

    /*
     * App 이 마운트되기 전에 <html lang> 을 맞춰 둔다.
     * 마운트 뒤로는 initCore 의 _syncAppRtl 워처가 계속 동기화한다.
     */
    if (typeof document !== 'undefined')
      document.documentElement.setAttribute('lang', locale)

    _i18n = createI18n({
      legacy: false,
      locale,
      fallbackLocale: themeConfig.app.i18n.defaultLocale ?? 'en',
      messages,

      /*
       * ⚠️ 경고는 '진짜 키'에만 낸다.
       *
       * Vuexy 레이아웃(@layouts/utils.ts 의 getDynamicI18nProps)은 네비 제목을
       * 그대로 i18n 키로 넘긴다. 아직 추출하지 않은 화면은 제목이 한국어 원문이라
       * 페이지 하나 열 때마다 "Not found '계정 관련' key" 가 수십 건씩 쏟아진다.
       * 그 소음에 묻히면 정작 오타 난 키를 못 본다.
       *
       * 그래서 `namespace.key` 꼴(ASCII + 점)인 키가 없을 때만 경고한다.
       * 한국어 원문은 조용히 키 그대로 표시된다 — 추출 전까지의 정상 동작이다.
       * 문자열 추출이 끝나면 이 두 줄을 지워 전체 경고를 되살릴 것.
       */
      missingWarn: TRANSLATION_KEY_PATTERN,
      fallbackWarn: TRANSLATION_KEY_PATTERN,
    })
  }

  return _i18n
}

/**
 * 언어를 바꾼다.
 *
 * 쿠키 저장·<html lang>·RTL 반영은 initCore 의 _syncAppRtl 워처가
 * locale 변화를 보고 한꺼번에 처리한다. 여기서 또 쓰면 로직이 두 곳으로
 * 갈라져서 나중에 반드시 어긋난다.
 */
export const setLocale = (locale: SupportedLocale) => {
  getI18n().global.locale.value = locale
}

export default function (app: App) {
  app.use(getI18n())
}
