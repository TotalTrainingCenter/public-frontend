import { DateTime } from 'luxon'
import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return '이 필드는 필수 선택 항목입니다.'

  if (typeof value === 'object')
    return !!value || '이 필드는 필수 입력 항목입니다.'

  return !!String(value).trim().length || '이 필드는 필수 입력 항목입니다.'
}

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || '이메일 형식이 올바르지 않습니다.'

  return re.test(String(value)) || '이메일 형식이 올바르지 않습니다.'
}

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return validPassword || '대문자, 소문자, 특수 문자 및 숫자가 최소 8자 이상 포함되어야 합니다.'
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>

  value === target || '비밀번호가 일치하지 않습니다'

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `${min} 에서 ${max} 까지만 입력 가능합니다.`
}

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || '이 필드는 숫자만 입력가능합니다.'

  return /^-?\d+$/.test(String(value)) || '이 필드는 숫자만 입력가능합니다.'
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

  return regeX.test(String(value)) || 'The Regex field format is invalid'
}

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'The Alpha field may only contain alphabetic characters'
}

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^https?:\/\/[^\s$.?#].\S*$/

  return re.test(String(value)) || 'URL is invalid'
}

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `"The length of the Characters field must be ${length} characters."`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[\w-]*$/.test(valueAsString) || 'All Character are not valid'
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

  return age >= 8 || '만 8세 이상만 가입 가능합니다.'
}
