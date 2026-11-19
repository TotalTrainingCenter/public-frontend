import type { App } from 'vue'
import { reportAdblockTallyOncePerDay } from '@/utils/adblockTally'

/**
 * 광고 차단기 하루 합계 보내기(utils/adblockTally.ts). 첫 화면을 그린 뒤 몇 초 기다렸다가 한 번 — 화면 그리기를 늦추지 않는다.
 * 미리 그리기(prerender)·서버에서는 돌지 않는다.
 */
export default function (_: App) {
  if (typeof window === 'undefined')
    return

  window.setTimeout(() => {
    reportAdblockTallyOncePerDay()
  }, 3000)
}
