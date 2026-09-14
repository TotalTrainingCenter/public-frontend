import type { OptionSelection } from './OptionSelection'

const GENDER: OptionSelection[] = [
  { value: 'MALE', title: '남성' },
  { value: 'FEMALE', title: '여성' },
]

const IDENTITY: OptionSelection[] = [
  { value: 'STUDENT', title: '학생' },
  { value: 'WORKER', title: '직장인' },
  { value: 'PERSON', title: '일반인' },
]

const EXPERIENCE: OptionSelection[] = [
  { value: 'Y', title: '있음' },
  { value: 'N', title: '없음' },

]

const TOILET: OptionSelection[] = [
  { value: 'Y', title: '가능' },
  { value: 'N', title: '불가능' },
]

const EXERCISE: OptionSelection[] = [
  { value: 'Y', title: '하고있음' },
  { value: 'N', title: '하지않음' },
]

const CONTROL: OptionSelection[] = [
  { value: 'Y', title: '통제를 원함' },
  { value: 'N', title: '자율을 원함' },
]

const LEARNING: OptionSelection[] = [
  { value: 'Y', title: '가능' },
  { value: 'N', title: '불가' },
]

const accountOrderBy: OptionSelection[] = [
  { value: '', title: '기본' },
  { value: 'startDate', title: '구독시작일' },
  { value: 'endDate', title: '구독종료일' },
  { value: 'identity', title: '신분' },
  { value: 'gender', title: '성별' },
  { value: 'loginTime', title: '최근 로그인 시간' },

]

const accountActivated: OptionSelection[] = [
  { value: true, title: '활성화' },
  { value: false, title: '비활성화' },
]

const accountBanned: OptionSelection[] = [
  { value: true, title: '정지' },
  { value: false, title: '정상' },
]

const membershipPlanStatus: OptionSelection[] = [
  { value: 'ACTIVE', title: '판매중' },
  { value: 'INACTIVE', title: '판매중지' },
]

const subscriptionStatus: OptionSelection[] = [
  { value: 'ACTIVE', title: '진행중' },
  { value: 'PAUSED', title: '중지됨' },
  { value: 'CANCELLED', title: '취소됨' },
  { value: 'EXPIRED', title: '만료됨' },
]

const os: OptionSelection[] = [
  { title: '활성화', value: true },
  { title: '비활성화', value: false },
]

const transactionType: OptionSelection[] = [
  { title: '지급', value: 'AWARD' },
  { title: '환수', value: 'REVOKE' },
]

export {
  accountActivated, accountBanned, accountOrderBy, CONTROL, EXERCISE, EXPERIENCE, GENDER,
  IDENTITY, LEARNING, membershipPlanStatus, os, subscriptionStatus, TOILET, transactionType,
}
