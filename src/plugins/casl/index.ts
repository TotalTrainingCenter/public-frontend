import type { App } from 'vue'

import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'
import { jwtDecode } from 'jwt-decode'
import type { Actions, Subjects } from './ability'
import type { IPermission } from '@entity/Permission'
import type { JwtPayload } from '@variables/JwtPayload'

/**
 * ⚠️ 이 사이트는 비로그인 공개 사이트라 실제로는 쓰이지 않는다.
 *    @layouts 템플릿 코드가 useAbility() 를 호출하기 때문에 남겨 둘 뿐이며,
 *    토큰이 없으면 빈 ability 로 초기화된다.
 *    이걸 근거로 라우트를 막는 코드를 추가하지 말 것 — 색인이 죽는다.
 */
export default function (app: App) {
  const accessToken = useCookie('accessToken').value || ''
  const payload = accessToken !== '' ? jwtDecode<JwtPayload>(accessToken) : null
  const permissions = payload?.account.permissions ?? []

  const initialAbility = createMongoAbility(permissions.flatMap((permission: IPermission) =>
    permission.actions.map((action: string) => ({
      action: action as Actions,
      subject: permission.subject as Subjects,
    })),
  ))

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}
