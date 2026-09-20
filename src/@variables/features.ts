/**
 * 서비스 핵심 흐름과 기능 설명.
 * 랜딩(FeaturesSection)과 /features 페이지가 함께 사용한다.
 *
 * ⚠️ 문구가 아니라 **i18n 키**를 담는다.
 *    번역문을 직접 넣으면 언어가 늘 때마다 이 파일이 배로 불어나고,
 *    로케일별로 어느 쪽이 최신인지 알 수 없게 된다. 화면에서 $t 로 푼다.
 */

export interface IServiceStep {
  titleKey: string

  /** 랜딩 카드용 한 줄 요약. */
  summaryKey: string

  /** /features 페이지용 본문. 검색 노출을 위해 충분한 분량을 유지할 것. */
  bodyKey: string

  /** 앵커 링크용 id. 번역 대상이 아니다 — URL 조각이라 언어가 바뀌어도 같아야 한다. */
  anchor: string
}

export const serviceSteps: IServiceStep[] = [
  { anchor: 'topic', titleKey: 'step.topicTitle', summaryKey: 'step.topicSummary', bodyKey: 'step.topicBody' },
  { anchor: 'perform', titleKey: 'step.performTitle', summaryKey: 'step.performSummary', bodyKey: 'step.performBody' },
  { anchor: 'record', titleKey: 'step.recordTitle', summaryKey: 'step.recordSummary', bodyKey: 'step.recordBody' },
  { anchor: 'verify', titleKey: 'step.verifyTitle', summaryKey: 'step.verifySummary', bodyKey: 'step.verifyBody' },
  { anchor: 'accumulate', titleKey: 'step.accumulateTitle', summaryKey: 'step.accumulateSummary', bodyKey: 'step.accumulateBody' },
]

/** 습관 앱과의 차이. /about 과 /features 에서 사용. */
export const differentiators = [
  { titleKey: 'diff.proofTitle', bodyKey: 'diff.proofBody' },
  { titleKey: 'diff.pickTitle', bodyKey: 'diff.pickBody' },
  { titleKey: 'diff.togetherTitle', bodyKey: 'diff.togetherBody' },
  { titleKey: 'diff.beyondTitle', bodyKey: 'diff.beyondBody' },
]
