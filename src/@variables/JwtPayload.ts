/**
 * 액세스 토큰의 내용. 계정 번호와 아이디만 있다.
 * 역할·권한은 토큰에 없다 — `@/utils/authProfile` 로 받는다.
 */
export interface JwtPayload {
  sub: string
  iat: number
  exp: number
  account: {
    id: number
    username: string
  }
}
