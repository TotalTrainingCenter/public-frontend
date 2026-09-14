import type { IContentEntry } from './ContentEntry'

/** 인증 수단. 활동마다 무엇을 올려야 인정되는지가 다르다. */
export type ProofType = '이미지' | '동영상' | '텍스트'

/** 활동 그룹에 속한 개별 활동. */
export interface IPublicActivityItem {

  /** 활동명. */
  name: string

  /** 이 활동을 왜 하는지. */
  description: string

  /** 무엇을 어떻게 올려야 인증되는지. */
  proof: string

  /** 인증 수단. */
  proofType: ProofType

  /** 기본(필수) 활동 여부. false 면 선택 활동. */
  required: boolean
}

/**
 * 활동 그룹 = 공개 사이트의 URL 한 개.
 *
 * ⚠️ 이 목록이 검색 유입의 핵심 자산이다.
 *    그룹 하나 = 페이지 하나 = 키워드 한 묶음.
 */
/**
 * 활동 그룹은 게시글이 아니라 카탈로그 항목이라 본문 HTML 이 없다.
 * 그래서 IContentEntry 에서 html 만 제외해 재사용한다.
 */
export interface IPublicActivityGroup extends Omit<IContentEntry, 'html'> {

  /** 화면에 노출되는 그룹명 (예: 건강 · 생활 습관). */
  category: string

  /** 추천 대상 (예: 일반, 직장인, 학생). */
  targets: string[]

  /** 그룹 상세 페이지 도입부. */
  intro: string

  /** 개별 활동 목록. */
  items: IPublicActivityItem[]
}
