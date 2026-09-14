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

export const formatNumber = (value?: number, fractionDigits: number = 0) => value ? Number(value).toFixed(fractionDigits).toLocaleString() : '0'

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
