import type { RouteNamedMap, _RouterTyped } from 'unplugin-vue-router'
import { captureSignupChannelFromRoute } from '@/utils/signupChannel'

/**
 * ⚠️ 이 프로젝트에는 인증 가드가 없다. 추가하지 말 것.
 *
 * total-frontend 는 여기서 비로그인 사용자를 auth 로 리다이렉트한다.
 * 그게 바로 검색엔진이 본문을 못 보던 원인이고, 이 사이트가 따로 존재하는 이유다.
 * 로그인이 필요한 기능은 전부 total.training-center.org 의 몫이다.
 */
export const setupGuards = (router: _RouterTyped<RouteNamedMap & { [key: string]: any }>) => {
  // 가입 경로(SNS 링크의 ?from=채널)만 받아 두고 주소에서 뗀다. 인증 가드가 아니다 — 어느 화면도 막지 않는다.
  router.beforeEach(to => captureSignupChannelFromRoute(to))
}
