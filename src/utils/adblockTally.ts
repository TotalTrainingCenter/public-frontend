/*
 * 광고 차단기 하루 합계(2026-11-19 대표 결정). 분석 도구(Google 애널리틱스)가 광고 차단기 때문에 빠지는 비율을 보려는 것이다.
 *
 * - 브라우저에 미끼 요소(광고 차단 목록이 숨기는 이름의 빈 상자)를 잠깐 넣어 숨겨졌는지만 본다.
 * - 결과는 '차단됐다/아니다' 하나만 서버 하루 합계에 더한다(/v1/public/adblock-tally). 개인별로 남기지 않는다 —
 *   계정·토큰·기기 정보를 싣지 않고(쿠키도 보내지 않는다), 서버도 날짜별 숫자만 올린다.
 * - 같은 브라우저는 하루 한 번만 보낸다. 보낸 날짜만 이 기기의 localStorage 에 둔다. 서버가 받지 못하면(오류) 적지 않는다.
 * - 운영 설정 기록 시작일(처리방침 새 판 시행일) 전에는 확인도 전송도 하지 않는다(/v1/public/access-features 의 recording).
 * - 무엇이 실패해도 화면에 알리지 않는다(통계일 뿐이다).
 */

import { fetchAccessFeatures } from '@/utils/accessFeatures'

const STORAGE_KEY = 'ttc.adblockTallyDay'

/** 광고 차단 목록(EasyList 등)의 요소 숨김 규칙에 걸리는 이름들. */
const BAIT_CLASSES = 'adsbox ad-banner ad-placement pub_300x250 textads banner-ads'

const seoulToday = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())

const readSentDay = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  }
  catch {
    return null
  }
}

const writeSentDay = (day: string) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, day)
  }
  catch {
    // 저장소를 못 쓰면(사생활 보호 모드 등) 다음 방문에 다시 보낼 수 있다 — 통계 오차로 둔다
  }
}

/** 미끼 요소를 넣고 잠시 뒤 숨겨졌는지 본다. */
export const detectAdblock = (waitMs = 300): Promise<boolean> => new Promise(resolve => {
  const bait = document.createElement('div')

  bait.className = BAIT_CLASSES
  bait.setAttribute('aria-hidden', 'true')
  bait.style.cssText = 'position:absolute;left:-10000px;top:-10000px;width:1px;height:10px;pointer-events:none;'
  bait.innerHTML = '&nbsp;'
  document.body.appendChild(bait)

  window.setTimeout(() => {
    const style = window.getComputedStyle(bait)

    const hidden = !bait.isConnected || bait.offsetHeight === 0 || bait.offsetParent === null
      || style.display === 'none' || style.visibility === 'hidden'

    bait.remove()
    resolve(hidden)
  }, waitMs)
})

/** 오늘 아직 안 보냈으면 확인해 보낸다. 미리 그리기(prerender)에서는 아무것도 하지 않는다. */
export const reportAdblockTallyOncePerDay = async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return

  const today = seoulToday()
  if (readSentDay() === today)
    return

  try {
    if (!(await fetchAccessFeatures()).recording)
      return

    const blocked = await detectAdblock()
    const base = import.meta.env.VITE_API_BASE_URL || '/api'

    const response = await fetch(`${base}/v1/public/adblock-tally`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocked }),
      credentials: 'omit',
      keepalive: true,
    })

    if (response.ok)
      writeSentDay(today)
  }
  catch {
    // 통계일 뿐이다
  }
}
