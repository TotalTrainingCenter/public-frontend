// Ported from [Nuxt](https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/cookie.ts)

import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es'
import { parse, serialize } from 'cookie-es'
import { destr } from 'destr'

type _CookieOptions = Omit<CookieSerializeOptions & CookieParseOptions, 'decode' | 'encode'>

export interface CookieOptions<T = any> extends _CookieOptions {
  decode?(value: string): T
  encode?(value: T): string
  default?: () => T | Ref<T>
  watch?: boolean | 'shallow'
}

export type CookieRef<T> = Ref<T>

const CookieDefaults: CookieOptions<any> = {
  path: '/',
  sameSite: 'lax',
  ...(import.meta.env.PROD && { domain: import.meta.env.VITE_COOKIE_BASE_URL, secure: true }),
  watch: true,
  decode: val => {
    try {
      return destr(decodeURIComponent(val))
    }
    catch {
      return destr(val)
    }
  },
  encode: val => {
    try {
      return encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val))
    }
    catch {
      return String(val)
    }
  },
}

const cookieRefs = new Map<string, CookieRef<any>>()

export const useCookie = <T = string | null | undefined>(name: string, _opts?: CookieOptions<T>): CookieRef<T> => {
  const existingCookie = cookieRefs.get(name)
  if (existingCookie)
    return existingCookie as CookieRef<T>

  const opts = { ...CookieDefaults, ..._opts || {} }
  const cookies = parse(document.cookie, opts)

  const cookie = ref<T | undefined>(cookies[name] as any ?? opts.default?.())

  if (cookies[name] === undefined && opts.default)
    document.cookie = serializeCookie(name, cookie.value, opts)

  watch(cookie, () => {
    document.cookie = serializeCookie(name, cookie.value, opts)
  })

  const cookieRef = cookie as CookieRef<T>

  cookieRefs.set(name, cookieRef)

  return cookieRef
}

function serializeCookie(name: string, value: any, opts: CookieSerializeOptions = {}) {
  if (value === null || value === undefined)
    return serialize(name, value, { ...opts, maxAge: -1 })

  return serialize(name, value, { ...opts, maxAge: 60 * 60 * 24 * 30 })
}
