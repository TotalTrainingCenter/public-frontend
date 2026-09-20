import { DateTime } from 'luxon'
import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'
import { getI18n } from '@/plugins/i18n'

/*
 * 검증 메시지 번역.
 *
 * 컴포저블이 아니라 일반 모듈이라 useI18n() 을 쓸 수 없다.
 * i18n 인스턴스에서 직접 꺼내 쓰되, 호출 시점에 평가해야 현재 언어가 나온다.
 * 모듈 최상위에서 미리 풀어 두면 값이 굳어 언어를 바꿔도 안 바뀐다.
 */
const tr = (key: string, params?: Record<string, unknown>) =>
  getI18n().global.t(key, params ?? {})

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return tr('valid.requiredSelect')

  if (typeof value === 'object')
    return !!value || tr('valid.required')

  return !!String(value).trim().length || tr('valid.required')
}

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || tr('valid.email')

  return re.test(String(value)) || tr('valid.email')
}

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return validPassword || tr('valid.password')
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>

  value === target || tr('valid.confirmed')

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || tr('valid.between', { min, max })
}

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || tr('valid.integer')

  return /^-?\d+$/.test(String(value)) || tr('valid.integer')
}

// 👉 Regex Validator
export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true

  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || tr('valid.regex')
}

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || tr('valid.alpha')
}

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^https?:\/\/[^\s$.?#].\S*$/

  return re.test(String(value)) || tr('valid.url')
}

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || tr('valid.length', { n: length })
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[\w-]*$/.test(valueAsString) || tr('valid.alphaDash')
}

// 👉 Birthday Validator
export const birthdayValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const today = DateTime.now()

  const birthday = Date.parse(String(value))
  const birthdayDate = DateTime.fromMillis(birthday)

  let age = today.year - birthdayDate.year
  const m = today.month - birthdayDate.month

  if (m < 0 || (m === 0 && today.day < birthdayDate.day))
    age--

  return age >= 8 || tr('valid.minAge', { age: 8 })
}
