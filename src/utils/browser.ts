import URI from 'urijs'

// 개발 모드에서는 서브도메인 대신 포트로 프로젝트를 구분한다.
const DEFAULT_DEV_PORTS: Record<string, number> = {
  auth: 7300,
  policy: 7301,
  mypage: 7302,
  total: 7303,
  esoteric: 7304,
  employee: 7305,
  owner: 7306,
}

const KNOWN_PROJECTS = new Set(Object.keys(DEFAULT_DEV_PORTS))

export const stabilizeBrowser = async () => {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
}

const isDevMode = () => !import.meta.env.PROD

const isLocalHostname = (hostname: string) =>
  /^(?:localhost|127\.0\.0\.1|\[::1\]|::1|0\.0\.0\.0)$/i.test(hostname)

const isTrainingCenterHostname = (hostname: string) =>
  /(?:^|\.)training-center\.org$/i.test(hostname)

const isKnownTrainingCenterHostname = (hostname: string) => {
  const normalizedHostname = hostname.toLowerCase()

  if (normalizedHostname === 'training-center.org')
    return true

  if (!normalizedHostname.endsWith('.training-center.org'))
    return false

  const project = normalizedHostname.slice(0, -'.training-center.org'.length)

  return KNOWN_PROJECTS.has(project)
}

const getDevPorts = () => {
  const ports = { ...DEFAULT_DEV_PORTS }
  const rawPorts = import.meta.env.VITE_AUTH_DEV_PORTS

  if (!rawPorts)
    return ports

  try {
    const parsed = JSON.parse(rawPorts) as Record<string, unknown>

    Object.entries(parsed).forEach(([project, port]) => {
      const parsedPort = Number(port)

      if (Number.isInteger(parsedPort) && parsedPort > 0)
        ports[project.toLowerCase()] = parsedPort
    })
  }
  catch {}

  return ports
}

// 개발 모드: http://localhost:<port>/ , 운영 모드: https://<project>.training-center.org/
const buildProjectUrl = (project: string, path = '/') => {
  const normalizedProject = project.toLowerCase().trim()

  if (!KNOWN_PROJECTS.has(normalizedProject))
    return null

  if (isDevMode()) {
    const port = getDevPorts()[normalizedProject]

    if (!port)
      return null

    return `${window.location.protocol}//${window.location.hostname}:${port}${path}`
  }

  return new URI()
    .subdomain(normalizedProject)
    .path(path)
    .toString()
}

export const isTrainingCenterHost = () => {
  if (typeof window === 'undefined')
    return false

  const { hostname } = window.location

  if (isDevMode())
    return isLocalHostname(hostname) || isTrainingCenterHostname(hostname)

  return isTrainingCenterHostname(hostname)
}

// 운영은 서브도메인, 개발은 포트로 현재 프로젝트를 판별한다.
export const getCurrentProject = () => {
  if (typeof window === 'undefined')
    return ''

  if (isDevMode()) {
    const ports = getDevPorts()
    const port = Number(window.location.port)

    return Object.keys(ports).find(project => ports[project] === port) ?? ''
  }

  return new URI().subdomain()
}

// 이미 그 프로젝트에 있다면 자기 자신으로의 전체 새로고침을 막는다.
const isOnProjectOrigin = (project: string) =>
  getCurrentProject().toLowerCase() === project.toLowerCase()

export const redirectToAuthLogin = (to = window.location.href) => {
  if (!isTrainingCenterHost() || isOnProjectOrigin('auth'))
    return false

  const loginUrl = buildProjectUrl('auth', '/login')

  if (!loginUrl)
    return false

  window.location.replace(new URI(loginUrl).setQuery({ to }).toString())

  return true
}

// 로그아웃 후 auth 프로젝트의 로그인 페이지로 이동한다.
// 이미 auth 프로젝트라면 false 를 반환하므로 호출부에서 라우터로 이동하면 된다.
export const redirectToAuthLogout = () => {
  if (!isTrainingCenterHost() || isOnProjectOrigin('auth'))
    return false

  const loginUrl = buildProjectUrl('auth', '/login')

  if (!loginUrl)
    return false

  window.location.replace(loginUrl)

  return true
}

// 다른 프로젝트로 이동한다. 이미 그 프로젝트라면 false 를 반환하므로
// 호출부에서 라우터로 이동하면 된다.
export const redirectToProject = (project: string, path = '/', newWindow = false) => {
  if (!isTrainingCenterHost() || isOnProjectOrigin(project))
    return false

  const url = buildProjectUrl(project, path)

  if (!url)
    return false

  if (newWindow)
    window.open(url, '_blank', 'noopener,noreferrer')
  else
    window.location.href = url

  return true
}

export const isSafeTrainingCenterUrl = (url: string) => {
  if (typeof window === 'undefined')
    return false

  try {
    const target = new URL(url, window.location.origin)

    if (!/^https?:$/.test(target.protocol))
      return false

    if (isKnownTrainingCenterHostname(target.hostname))
      return true

    // 개발 모드에서는 등록된 포트의 로컬 주소만 허용한다.
    if (isDevMode() && isLocalHostname(target.hostname)) {
      const port = Number(target.port)

      return Object.values(getDevPorts()).includes(port)
    }

    return false
  }
  catch {
    return false
  }
}

export const navigateAfterAuth = (to: string, fallback = '/') => {
  const target = to || fallback

  if (/^https?:\/\//i.test(target) && isSafeTrainingCenterUrl(target)) {
    window.location.replace(target)

    return true
  }

  return false
}
