import type { RouteRecordRaw } from 'vue-router/auto'

/**
 * 파일 기반 라우팅으로 커버되지 않는 리다이렉트만 여기에 둔다.
 * 공개된 URL 이 바뀌면 여기에 리다이렉트를 추가해 색인을 잃지 않게 한다.
 *
 * ⚠️ total-frontend 와 달리 '/' 리다이렉트가 없다. 루트는 랜딩 페이지다.
 */
export const redirects: RouteRecordRaw[] = []

export const routes: RouteRecordRaw[] = []
