export interface IContentEntry {

  /** URL 슬러그. 관리자에서 입력한 slug 속성, 없으면 게시글 id. */
  slug: string

  /** 목록/상세 h1 및 <title> 에 쓰인다. */
  title: string

  /** 검색결과 스니펫. 페이지마다 반드시 달라야 한다. */
  description: string

  /** 발행일 (YYYY-MM-DD). 사이트맵 lastmod 와 Article 스키마에 사용. */
  date: string

  /**
   * 본문 HTML.
   *
   * ⚠️ v-html 로 렌더된다. 값은 scripts/tiptap-html.mts 가 허용 목록 방식으로
   *    만들어 낸 것만 들어온다(텍스트는 이스케이프, 태그는 생성한 것만).
   *    다른 출처의 HTML 을 여기에 넣지 말 것.
   */
  html: string

  /** 검색 색인 제외 여부. */
  noindex?: boolean
}

export interface INotice extends IContentEntry {}

export interface IStory extends IContentEntry {

  /** 관련 활동 그룹 slug. 비어 있으면 연결 카드를 그리지 않는다. */
  relatedActivity: string

  /** 회원 후기를 운영진이 다듬었는지. true 면 "일부 표현을 다듬었습니다" 를 붙인다(#78, 표시광고법). */
  refined?: boolean
}
