import type { App } from 'vue'
import { createGtag, set } from 'vue-gtag'
import { router } from './1.router'

/**
 * Google 애널리틱스에 보내는 주소에서 검색어(?…)와 # 뒤를 뗀다.
 *
 * ⚠️ 비밀번호 재설정·보호자 동의(?token=)·이메일 인증(?code=) 링크처럼 주소에 일회용 값이 실리는 화면이 있다.
 *    vue-gtag 는 page_location 을 window.location.href 로 채우고(utm_ 만 거른다), gtag 도 스크롤 같은 자동 이벤트에
 *    현재 주소를 그대로 싣는다 — 그래서 페이지 보기와 공통 값(set) 둘 다 깨끗한 주소로 덮는다(10/27, document#80 ①).
 * 미리 그리기(공개 사이트 prerender)는 window 가 없으니 undefined — vue-gtag 가 서버에서는 아무것도 보내지 않는다.
 */
const cleanLocation = () =>
  typeof window === 'undefined' ? undefined : `${window.location.origin}${window.location.pathname}`

export default function (app: App) {
  if (process.env.NODE_ENV === 'production') {
    const gtag = createGtag({
      tagId: 'G-C5YKE4N0RY',
      config: { page_location: cleanLocation() },
      hooks: {
        'router:track:before': () => set({ page_location: cleanLocation() }),
      },
      pageTracker: {
        router,
        template: route => ({
          page_path: route.path,
          page_location: cleanLocation(),
          ...(route.name ? { page_title: String(route.name) } : {}),
        }),
      },
    })

    app.use(gtag)
  }
}
