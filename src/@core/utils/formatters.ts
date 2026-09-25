import { DateTime } from 'luxon'
import { isToday } from './helpers'
import type { IRole } from '@entity/Role'
import type { OptionSelection } from '@variables/OptionSelection'

export const avatarText = (value: string) => {
  if (!value)
    return ''
  const nameArray = value.split(' ')

  return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
}

// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = (num: number) => {
  const regex = /\B(?=(\d{3})+(?!\d))/g

  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}

/**
 * Format and return date in Humanize format
 * Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 * Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {string} value date to format
 * @param {Intl.DateTimeFormatOptions} formatting Intl object to format with
 */
export const formatDate = (value: string, formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value)
    return value

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 * Return short human friendly month representation of date
 * Can also convert date to only time if date is of today (Better UX)
 * @param {string} value date to format
 * @param {boolean} toTimeForCurrentDay Shall convert to time if day is today/current
 */
export const formatDateToMonthShort = (value: string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Record<string, string> = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date))
    formatting = { hour: 'numeric', minute: 'numeric' }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const prefixWithPlus = (value: number) => value > 0 ? `+${value}` : value

export const formatDateTime = (value: string, format: string = 'yyyy-MM-dd HH:mm') => DateTime.fromISO(value).toFormat(format)

export const formatOptionText = (options: OptionSelection[], value: string) => options.find((option: OptionSelection) => option.value === value)?.title

export const formatBoolean = (value: boolean, tv: string, fv: string) => value ? tv : fv

/** 지금 화면 언어. i18n 플러그인이 <html lang> 에 넣어 둔다. */
const numberLocale = (): string => {
  if (typeof document === 'undefined')
    return 'ko'

  return document.documentElement.getAttribute('lang') || 'ko'
}

/**
 * 숫자를 사람이 읽는 꼴로. 천 단위를 끊는다.
 *
 * ⚠️ 예전 구현은 **아무것도 하지 않았다.**
 *
 *      Number(value).toFixed(digits).toLocaleString()
 *
 *    toFixed 가 문자열을 돌려주는데, 문자열의 toLocaleString 은 숫자와 달리 자릿수를
 *    끊지 않는다(그냥 자기 자신을 돌려준다). 그래서 10개 프로젝트 어디에도 콤마가 없었다.
 *    타입이 슬쩍 바뀌는 바람에 아무도 눈치채지 못한 종류의 버그다.
 *
 * ⚠️ 로케일은 화면 언어를 따른다. 자릿수 구분 기호가 언어마다 다르기 때문이다
 *    (ko·ja·en 은 모두 콤마지만, 나중에 유럽 언어가 들어오면 점·공백이 된다).
 *    i18n 플러그인이 <html lang> 을 맞춰 주므로 그것을 읽는다 —
 *    plugins/i18n 을 import 하면 core 가 plugins 에 기대게 되고 순환이 생길 수 있다.
 *
 * @param value 숫자. 문자열로 와도(BigDecimal 이 문자열로 직렬화되는 경우) 받는다.
 * @param fractionDigits 소수 자릿수. 기본 0.
 */
export const formatNumber = (value?: number | string | null, fractionDigits: number = 0): string => {
  const numeric = typeof value === 'string' ? Number(value) : value

  // null·undefined·NaN 은 0 으로 본다. 화면에 "NaN" 이 뜨는 것보다 낫다.
  if (numeric === null || numeric === undefined || Number.isNaN(numeric))
    return (0).toLocaleString(numberLocale(), { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })

  return numeric.toLocaleString(numberLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export const formatFileName = (name: string, maxLength: number = 20) => {
  if (name.length <= maxLength)
    return name

  const extension = name.split('.').pop() || ''
  const baseName = name.slice(0, maxLength - extension.length - 3) // -3 for the ellipsis

  return `${baseName}...${extension}`
}

export const formatFileSize = (size: number): string => {
  if (size < 1000)
    return `${size} B`
  const kb = size / 1000
  if (kb < 1000)
    return `${kb.toFixed(2)} KB`
  const mb = kb / 1000
  if (mb < 1000)
    return `${mb.toFixed(2)} MB`
  const gb = mb / 1000

  return `${gb.toFixed(2)} GB`
}

export const formatRoleIds = (roles: IRole[]): number[] => {
  return roles.map((role: IRole) => role.id)
}

export const formatRoleNames = (roles: IRole[]): string[] => {
  return roles.map((role: IRole) => role.name)
}

export const formatStringCase = (value: string, upper: boolean, lower: boolean): string => {
  if (upper)
    return value.toUpperCase()

  if (lower)
    return value.toLowerCase()

  return value
}
