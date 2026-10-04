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

  /** 입문 플랜 여부. 홈 멤버십 영역에는 이것만 싣는다(나머지는 /membership). */
  entry: boolean

  /**
   * 기능 비교 항목. `true` 는 제공, `false` 는 미제공.
   *
   * ⚠️ 문구가 아니라 i18n 키를 담는다. 이 파일은 scripts/fetch-content.mts 가
   *    Node 에서 임포트하므로 여기에 $t 나 번역문을 두면 안 된다. 화면에서 푼다.
   */
  features: { labelKey: string; labelParams?: Record<string, string>; available: boolean }[]
}

export const membershipMeta: Record<string, IMembershipMeta> = {
  'LVL.0': {
    recommended: false,
    entry: true,
    features: [
      { labelKey: 'member.featAllTopics', available: true },
      { labelKey: 'member.featRecord', available: true },
      { labelKey: 'member.featUnlimited', available: false },
    ],
  },
  'LVL.1': {
    recommended: true,
    entry: true,
    features: [
      { labelKey: 'member.featAllTopics', available: true },
      { labelKey: 'member.featRecord', available: true },
      { labelKey: 'member.featUnlimited', available: true },
    ],
  },
}

/**
 * LVL.2 부터는 누적형 사다리다. 윗 플랜이 바로 아래 플랜의 기능을 전부 포함하고 기능이 하나씩 더해진다.
 * 카드에는 '아래 플랜의 모든 기능' + '이 플랜에서 더해지는 기능' 두 줄을 싣는다.
 *
 * ⚠️ 운영 DB 에 플랜이 새로 생기면 여기에 한 줄 더할 것. 빠지면 카드의 기능 목록이 비어 나간다.
 *    순서는 사다리 순서 그대로(바로 앞 항목이 '아래 플랜'이 된다).
 */
const LADDER: [plan: string, addedFeatureKey: string][] = [
  ['LVL.2', 'member.featMsgDirect'],
  ['LVL.3', 'member.featMsgGroup'],
  ['LVL.4', 'member.featMsgAttach'],
  ['LVL.5', 'member.featAiChat'],
  ['LVL.6', 'member.featAiVoice'],
  ['LVL.7', 'member.featAiDocs'],
  ['LVL.8', 'member.featAiWeb'],
  ['LVL.9', 'member.featAiImage'],
  ['LVL.10', 'member.featAiGroup'],
  ['LVL.11', 'member.featAiPremium'],
  ['LVL.12', 'member.featSnsBasic'],
  ['LVL.13', 'member.featSnsPlus'],
]

LADDER.forEach(([plan, addedFeatureKey], index) => {
  const below = index === 0 ? 'LVL.1' : LADDER[index - 1][0]

  membershipMeta[plan] = {
    recommended: false,
    entry: false,
    features: [
      { labelKey: 'member.featIncludes', labelParams: { plan: below }, available: true },
      { labelKey: addedFeatureKey, available: true },
    ],
  }
})
