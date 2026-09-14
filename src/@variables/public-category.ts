/**
 * 공개 사이트가 읽어가는 게시판 카테고리 키.
 *
 * 백엔드의 `org.training_center.common.constants.PublicCategory` 와 **같은 값**이어야 한다.
 * 한쪽만 바꾸면 조용히 빈 목록이 내려오고, 그 상태가 그대로 색인된다.
 *
 * ⚠️ 키에 하이픈을 쓸 수 없다. 관리자 화면의 카테고리 키 입력이 영문자만 허용한다
 *    (owner-frontend 의 alphaValidator).
 */
export const PUBLIC_CATEGORY = {
  notice: { key: 'publicnotice', label: '공개 공지' },
  faq: { key: 'publicfaq', label: '공개 FAQ' },
  story: { key: 'publicstory', label: '공개 후기' },
} as const

/**
 * 게시글 속성 키.
 * 백엔드의 `BoardAttributeKey` 와 같은 값이어야 한다.
 */
export const BOARD_ATTRIBUTE_KEY = {
  slug: 'slug',
  subject: 'subject',
  content: 'content',
  summary: 'summary',

  /** 후기에서 관련 활동 그룹 slug 를 가리킨다. 후기 카테고리에만 있다. */
  relatedActivity: 'relatedActivity',
} as const
