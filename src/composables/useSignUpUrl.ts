import { siteConfig } from '@variables/site'
import { withSignupChannel } from '@/utils/signupChannel'

/**
 * 가입 화면 주소. 가입 경로(SNS 링크의 ?from=채널)를 받아 둔 방문자면 가입 화면 주소에도 같은 표시를 붙여 넘긴다.
 *
 * 쿠키는 서브도메인끼리 같이 쓰므로 표시가 없어도 이어지지만, 주소에도 실어 두면 쿠키가 막힌 브라우저에서도 이어진다.
 * 미리 그린 HTML(프리렌더)에는 표시 없는 주소가 들어가고, 화면이 붙은 뒤(onMounted)에만 바꾼다 — 프리렌더와 어긋나지 않게.
 */
export const useSignUpUrl = () => {
  const url = ref<string>(siteConfig.signUpUrl)

  onMounted(() => {
    url.value = withSignupChannel(siteConfig.signUpUrl)
  })

  return url
}
