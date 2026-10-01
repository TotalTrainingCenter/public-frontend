import type { App } from 'vue'

import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'

/**
 * ⚠️ 이 사이트는 비로그인 공개 사이트라 실제로는 쓰이지 않는다.
 *    @layouts 템플릿 코드가 useAbility() 를 호출하기 때문에 남겨 둘 뿐이며,
 *    항상 빈 ability 로 초기화된다(권한은 토큰에 없고, 여기서는 `/v1/auth/me` 를 부르지 않는다).
 *    이걸 근거로 라우트를 막는 코드를 추가하지 말 것 — 색인이 죽는다.
 */
export default function (app: App) {
  app.use(abilitiesPlugin, createMongoAbility([]), {
    useGlobalProperties: true,
  })
}
