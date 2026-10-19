/** 변경 기록이 대상으로 하는 플랫폼. 저장소 README 의 `platforms` 값과 같다. */
export type ReleasePlatform = 'web' | 'ios' | 'android' | 'mac'

export interface IReleaseSection {

  /** `###` 제목(새로 생긴 것 / 바뀐 것 / 고친 것). 비어 있으면 제목 없이 그린다. */
  title: string

  /**
   * 본문 HTML.
   *
   * ⚠️ v-html 로 렌더된다. scripts/fetch-changelog.mts 가 허용 목록 방식으로
   *    만든 것만 들어온다(ul·li·p·strong·em·https 링크, 글자는 이스케이프).
   */
  html: string
}

/** 배포 하루치 변경 기록. 출처는 GitHub TotalTrainingCenter/changelog 의 releases/YYYY-MM-DD.md. */
export interface IRelease {

  /** YYYY-MM-DD */
  date: string
  title: string
  platforms: ReleasePlatform[]
  sections: IReleaseSection[]
}
