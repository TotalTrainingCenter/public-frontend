/*
 * 서버가 알려 주는 접속 관련 기능 상태(GET /v1/public/access-features, 2026-11-19).
 * - recording: 접속 위치·경로 기록을 하는 때인지(운영 설정 기록 시작일 이후). 아니면 광고 차단 합계도 보내지 않는다.
 * - regionNotice: 이 접속이 서비스 지역(한국) 밖으로 판별돼 '대한민국에서만 제공' 안내를 보여야 하는지(#88, 막지 않음).
 * 계정·토큰·쿠키를 싣지 않는다. 실패하면 둘 다 false(아무것도 안 함). 한 화면에서 한 번만 묻는다.
 */

export interface AccessFeatures {
  recording: boolean
  regionNotice: boolean
}

const NONE: AccessFeatures = { recording: false, regionNotice: false }

let pending: Promise<AccessFeatures> | null = null

export const fetchAccessFeatures = (): Promise<AccessFeatures> => {
  if (typeof window === 'undefined')
    return Promise.resolve(NONE)

  if (pending)
    return pending

  const base = import.meta.env.VITE_API_BASE_URL || '/api'

  pending = fetch(`${base}/v1/public/access-features`, { credentials: 'omit' })
    .then(async response => {
      if (!response.ok)
        return NONE

      const body = await response.json()

      return { recording: body?.data?.recording === true, regionNotice: body?.data?.regionNotice === true }
    })
    .catch(() => NONE)

  return pending
}
