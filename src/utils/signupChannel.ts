import { parse, serialize } from 'cookie-es'

/*
 * 가입 경로(유입 채널) — SNS 링크 끝의 `?from=<채널>` 표시(2026-11-18 대표 결정).
 *
 * - 형식: `https://training-center.org/?from=youtube` 처럼 주소 끝에 from=채널 하나. 값은 아래 허용 목록만 받고 나머지는 버린다.
 *   ⚠️ auth 의 `?from=app`(iOS 앱 표시, utils/appFlow.ts)과 이름이 같다. 값이 겹치지 않으니 채널 값일 때만 받고 그때만 주소에서 뗀다.
 * - 보관: 첫 방문 때 받은 값을 쿠키 `signupChannel` 에 7일 둔다. 이미 있으면 덮어쓰지 않는다(첫 방문 기준).
 *   공개 사이트 → 가입 화면(auth)으로 넘어가도 이어져야 하므로 네임스페이스 없는 공유 쿠키다(오리진에 묶이는 값이 아니다 —
 *   기억 'ttc-cross-site-cookie-scope'). localStorage 는 오리진마다 따로라 쓰지 않는다.
 * - 가입할 때 auth 가 이 값을 `/v1/account/register` 의 signupChannel 로 보내고, 가입이 끝나면 지운다.
 * - 채널 이름 하나만 다룬다. 기기 식별·광고 추적 도구로 보내지 않는다(애널리틱스로 가는 주소는 gtag.ts 가 검색어를 뗀다).
 *
 * public·total·auth 세 프론트가 같은 파일을 쓴다. 고치면 세 곳을 같이, 채널 목록은 백엔드 SignupChannel 과 같이 고친다.
 */

export const SIGNUP_CHANNELS = ['youtube', 'instagram', 'threads', 'x', 'facebook', 'tiktok', 'naver', 'kakao'] as const
export type SignupChannel = typeof SIGNUP_CHANNELS[number]

/** 링크에 붙이는 이름. */
export const SIGNUP_CHANNEL_PARAM = 'from'

const COOKIE_NAME = 'signupChannel'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const cookieOptions = () => ({
  path: '/',
  sameSite: 'lax' as const,
  ...(import.meta.env.PROD && import.meta.env.VITE_COOKIE_BASE_URL
    ? { domain: import.meta.env.VITE_COOKIE_BASE_URL, secure: true }
    : {}),
})

/** 허용 목록에 있는 채널이면 그 값, 아니면 null. */
export const normalizeSignupChannel = (raw: unknown): SignupChannel | null => {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value !== 'string')
    return null

  const channel = value.trim().toLowerCase()

  return (SIGNUP_CHANNELS as readonly string[]).includes(channel) ? channel as SignupChannel : null
}

/** 받아 둔 채널. 없거나 목록에 없는 값이면 null. */
export const readSignupChannel = (): SignupChannel | null => {
  if (typeof document === 'undefined')
    return null

  try {
    return normalizeSignupChannel(parse(document.cookie)[COOKIE_NAME])
  }
  catch {
    return null
  }
}

/** 주소의 채널 표시를 받아 둔다. 이미 받아 둔 값이 있으면 그대로 둔다(첫 방문 기준, 7일). */
export const rememberSignupChannel = (raw: unknown): SignupChannel | null => {
  const channel = normalizeSignupChannel(raw)
  if (!channel || typeof document === 'undefined')
    return channel

  if (!readSignupChannel())
    document.cookie = serialize(COOKIE_NAME, channel, { ...cookieOptions(), maxAge: MAX_AGE_SECONDS })

  return channel
}

/** 가입이 끝나면 지운다. */
export const clearSignupChannel = () => {
  if (typeof document === 'undefined')
    return

  document.cookie = serialize(COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 })
}

/** 받아 둔 채널이 있으면 주소에 `?from=채널` 을 붙인다(공개 사이트 → 가입 화면). */
export const withSignupChannel = (url: string): string => {
  const channel = readSignupChannel()
  if (!channel)
    return url

  try {
    const target = new URL(url, typeof window === 'undefined' ? undefined : window.location.href)

    target.searchParams.set(SIGNUP_CHANNEL_PARAM, channel)

    return target.toString()
  }
  catch {
    return url
  }
}

/**
 * 라우터 beforeEach 맨 앞에서 부른다. 주소에 채널 표시가 있으면 받아 두고, 표시를 뗀 주소로 바꿔 보낸다.
 * 채널 값이 아니면(예: from=app) 손대지 않고 undefined.
 */
export const captureSignupChannelFromRoute = <T extends { query: Record<string, unknown> }>(to: T): (T & { replace: true }) | undefined => {
  if (!normalizeSignupChannel(to.query[SIGNUP_CHANNEL_PARAM]))
    return undefined

  rememberSignupChannel(to.query[SIGNUP_CHANNEL_PARAM])

  const query = { ...to.query }

  delete query[SIGNUP_CHANNEL_PARAM]

  return { ...to, query, replace: true }
}
