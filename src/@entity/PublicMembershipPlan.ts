export interface IPublicMembershipFeature {
  labelKey: string
  available: boolean
}

/**
 * 공개 소개 사이트의 멤버십 카드 모델.
 *
 * `@entity/MembershipPlan` 은 플랫폼 API 응답(IMembershipPlan) 이라 별개다.
 * 이쪽은 화면 표기용으로 가공된 값만 담는다.
 *
 * ⚠️ 등급명은 운영 DB 값(LVL.0 / LVL.1)을 그대로 노출한다.
 *    '체험' '정회원' 같은 마케팅 표기로 바꾸지 말 것 — 플랫폼 화면과 등급명이 달라지면
 *    이용자가 혼란스러워진다. (2026-09-14 확인)
 */
export interface IPublicMembershipPlan {

  /** 운영 DB(common.membership_plan)의 plan 이름. */
  code: string

  /** 노출명. 현재는 code 와 동일하다. */
  name: string

  /** 요금 표기. 0원은 '무료'. */
  price: string

  /** 과금 주기 또는 이용 기간. */
  period: string
  summary: string
  features: IPublicMembershipFeature[]
  recommended: boolean
}
