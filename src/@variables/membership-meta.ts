/**
 * 멤버십 플랜의 공개 사이트 표기.
 *
 * 요금·기간·설명은 운영 DB(common.membership_plan)가 원본이다.
 * 여기에는 DB 에 없는 편집 정보(강조 여부, 기능 비교 문구)만 둔다.
 *
 * ⚠️ 등급명은 DB 값(LVL.0 / LVL.1)을 그대로 노출한다.
 *    '체험' '정회원' 같은 마케팅 표기로 바꾸지 말 것 — 플랫폼 화면과 등급명이 달라지면
 *    이용자가 혼란스러워진다. (2026-09-14 확인)
 */
export interface IMembershipMeta {

  /** 추천 강조 여부. */
  recommended: boolean

  /**
   * 기능 비교 항목. `true` 는 제공, `false` 는 미제공.
   *
   * ⚠️ 문구가 아니라 i18n 키를 담는다. 이 파일은 scripts/fetch-content.mts 가
   *    Node 에서 임포트하므로 여기에 $t 나 번역문을 두면 안 된다. 화면에서 푼다.
   */
  features: { labelKey: string; available: boolean }[]
}

export const membershipMeta: Record<string, IMembershipMeta> = {
  'LVL.0': {
    recommended: false,
    features: [
      { labelKey: 'member.featAllTopics', available: true },
      { labelKey: 'member.featRecord', available: true },
      { labelKey: 'member.featUnlimited', available: false },
    ],
  },
  'LVL.1': {
    recommended: true,
    features: [
      { labelKey: 'member.featAllTopics', available: true },
      { labelKey: 'member.featRecord', available: true },
      { labelKey: 'member.featUnlimited', available: true },
    ],
  },
}
