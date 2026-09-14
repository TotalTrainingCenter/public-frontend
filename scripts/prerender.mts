/**
 * 프리렌더(정적 HTML 스냅샷) 스크립트.
 *
 * ══════════════════════════════════════════════════════════════
 *  이 스크립트가 이 프로젝트의 존재 이유다.
 *
 *  Vue SPA는 빌드 결과가 빈 index.html + JS 번들이다.
 *  구글은 JS를 실행해 주지만 후순위이고,
 *  네이버 Yeti 봇은 JS를 거의 실행하지 않는다.
 *  → 프리렌더 없이 배포하면 네이버 검색에는 영원히 노출되지 않는다.
 *
 *  동작: 빌드된 dist 를 로컬 서버로 띄우고, 헤드리스 크롬으로
 *        각 라우트를 방문해 렌더링 완료된 HTML을
 *        dist/<route>/index.html 로 저장한다.
 * ══════════════════════════════════════════════════════════════
 *
 * 사전 준비: npm i -D puppeteer
 */
import { createServer } from 'node:http'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { getRoutes } from './routes.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const PORT = Number(process.env.PRERENDER_PORT ?? 4173)

/**
 * ⚠️ 원본 index.html 을 메모리에 먼저 확보한다.
 *
 * 프리렌더는 dist/index.html 을 '/' 스냅샷으로 덮어쓴다.
 * 그 뒤 라우트들이 SPA fallback 으로 덮어쓴 파일을 받으면
 * '/' 페이지의 JSON-LD 같은 정적 태그를 그대로 물려받아
 * 모든 페이지에 섞여 들어간다. 반드시 원본을 서빙할 것.
 */
const pristineIndexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

// dist 를 SPA fallback 방식으로 서빙하는 최소 정적 서버
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
  const filePath = join(distDir, urlPath)

  try {
    // 이전 라우트에서 생성된 스냅샷을 다시 읽지 않도록 HTML 은 항상 원본
    if (extname(filePath) === '.html' || urlPath === '/')
      throw new Error('fallback')

    const body = readFileSync(filePath)

    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' })
    res.end(body)
  }
  catch {
    // SPA fallback — 덮어쓰기 전의 원본을 서빙한다 (위 주석 참고)
    res.writeHead(200, { 'Content-Type': MIME['.html'] })
    res.end(pristineIndexHtml)
  }
})

await new Promise<void>(done => server.listen(PORT, done))

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const routes = getRoutes()

let failed = 0

for (const route of routes) {
  const page = await browser.newPage()

  try {
    /*
     * ⚠️ waitUntil 로 'networkidle0' 을 쓰지 말 것.
     *    이 앱은 폰트 로더·아이콘·테마 스크립트 때문에 네트워크가 완전히 조용해지지 않아
     *    매 라우트마다 타임아웃까지 매달리고, 전체 빌드가 사실상 멈춘다.
     *    판단 기준은 '네트워크가 한가한가'가 아니라 '본문이 그려졌는가'여야 한다.
     */
    await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })

    // 본문이 그려질 때까지 대기. h1 은 모든 공개 페이지에 정확히 하나씩 있다.
    await page.waitForSelector('h1', { timeout: 20_000 })

    // 렌더 직후 한 틱 더 — 같은 프레임에 붙는 하위 요소까지 포함시킨다.
    await new Promise(resolve => { setTimeout(resolve, 250) })

    const html = await page.content()

    const outPath = route.path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.path, 'index.html')

    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html, 'utf-8')

    console.log(`  ✔ ${route.path}`)
  }
  catch (error) {
    failed++
    console.error(`  ✘ ${route.path} — ${(error as Error).message}`)
  }
  finally {
    await page.close()
  }
}

await browser.close()
server.close()

/*
 * Apache 의 ErrorDocument 는 /404.html 을 찾는다.
 * 프리렌더 결과(dist/404/index.html)를 그 경로로도 복사해 둔다.
 */
const notFoundSnapshot = join(distDir, '404', 'index.html')
if (existsSync(notFoundSnapshot)) {
  copyFileSync(notFoundSnapshot, join(distDir, '404.html'))
  console.log('  ✔ 404.html')
}

if (failed > 0) {
  console.error(`\n❌ ${failed}개 라우트 프리렌더 실패. 배포를 중단한다.`)
  process.exit(1)
}

console.log(`\n✅ ${routes.length}개 라우트 프리렌더 완료`)
