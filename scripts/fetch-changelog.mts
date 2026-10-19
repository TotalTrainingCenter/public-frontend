/**
 * 변경 기록(/changelog)을 GitHub 공개 저장소에서 가져와
 * `src/@variables/generated/changelog.ts` 로 기록한다.
 *
 * ══════════════════════════════════════════════════════════════
 *  출처: https://github.com/TotalTrainingCenter/changelog
 *        releases/YYYY-MM-DD.md — 머리말(date·title·platforms) + 마크다운 본문
 *
 *  fetch-content.mts 와 같은 이유로 빌드 때 굽는다.
 *  네이버 Yeti 는 JS 를 실행하지 않으므로 본문이 프리렌더 HTML 에 들어 있어야 한다.
 *
 *  ⚠️ fetch-content 와 달리 실패해도 빌드를 세우지 않는다.
 *     변경 기록은 서비스 본문이 아니고, GitHub 장애로 배포가 막히면 안 된다.
 *     가져오지 못하면 직전에 만든 파일을 그대로 두고(없으면 빈 목록을 쓴다) 경고만 남긴다.
 * ══════════════════════════════════════════════════════════════
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Token, Tokens } from 'marked'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = resolve(root, 'src/@variables/generated/changelog.ts')

const REPO = 'TotalTrainingCenter/changelog'
const LIST_URL = `https://api.github.com/repos/${REPO}/contents/releases`
const rawUrl = (name: string) => `https://raw.githubusercontent.com/${REPO}/main/releases/${name}`

const PLATFORMS = ['web', 'ios', 'android', 'mac'] as const

type Platform = typeof PLATFORMS[number]

interface ReleaseSection {
  title: string
  html: string
}

interface Release {
  date: string
  title: string
  platforms: Platform[]
  sections: ReleaseSection[]
}

const FILE_NAME = /^\d{4}-\d{2}-\d{2}\.md$/

// ── HTML 만들기
// marked 의 렌더러를 쓰지 않고 토큰을 직접 걷는다. 허용한 태그만 나갈 수 있게 하려는 것이다.
// 허용 태그: ul, li, p, strong, em, a[href^="https://"]  (h3 는 화면이 직접 그린다)
// 그 밖의 토큰(원시 HTML·이미지·코드 블록·표 …)은 글자로만 내보낸다.

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

/** 토큰의 글자만. 허용하지 않는 토큰을 평문으로 내보낼 때 쓴다. */
const plainText = (token: Token): string => {
  const children = (token as { tokens?: Token[] }).tokens
  if (children?.length)
    return children.map(plainText).join('')

  return (token as { text?: string }).text ?? (token as { raw?: string }).raw ?? ''
}

const renderInline = (tokens: Token[] = []): string => tokens.map(token => {
  switch (token.type) {
    case 'text':
      return (token as Tokens.Text).tokens
        ? renderInline((token as Tokens.Text).tokens)
        : escapeHtml((token as Tokens.Text).text)
    case 'escape':
    case 'codespan':
      return escapeHtml((token as Tokens.Codespan).text)
    case 'strong':
      return `<strong>${renderInline((token as Tokens.Strong).tokens)}</strong>`
    case 'em':
      return `<em>${renderInline((token as Tokens.Em).tokens)}</em>`
    case 'br':
      return ' '
    case 'link': {
      const link = token as Tokens.Link
      const label = renderInline(link.tokens)

      // https 만 링크로 둔다. javascript:·http:·상대 경로는 글자만 남긴다.
      if (!/^https:\/\/[^\s"'<>]+$/i.test(link.href))
        return label

      return `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    }
    default:
      return escapeHtml(plainText(token))
  }
}).join('')

const renderBlocks = (tokens: Token[]): string => tokens.map(token => {
  switch (token.type) {
    case 'space':
      return ''
    case 'paragraph':
      return `<p>${renderInline((token as Tokens.Paragraph).tokens)}</p>`
    case 'list':
      // 붙어 있는 목록의 항목은 text 토큰으로 온다. 문단 없이 글자만 둔다(아래 'text' 가 아니라 여기서 처리).
      return `<ul>${(token as Tokens.List).items.map(item => `<li>${item.tokens.map(child => child.type === 'text'
        ? renderInline((child as Tokens.Text).tokens ?? [child])
        : renderBlocks([child])).join('')}</li>`).join('')}</ul>`
    case 'text':
      return `<p>${renderInline((token as Tokens.Text).tokens ?? [token])}</p>`
    default: {
      const text = plainText(token).trim()

      return text ? `<p>${escapeHtml(text)}</p>` : ''
    }
  }
}).join('')

/** 본문을 `###` 제목 단위로 자른다. 첫 제목 앞의 글은 제목 없는 칸이 된다. */
const toSections = (body: string): ReleaseSection[] => {
  const sections: { title: string; tokens: Token[] }[] = []

  for (const token of marked.lexer(body)) {
    if (token.type === 'heading') {
      sections.push({ title: plainText(token).trim(), tokens: [] })
      continue
    }
    if (!sections.length)
      sections.push({ title: '', tokens: [] })
    sections[sections.length - 1].tokens.push(token)
  }

  return sections
    .map(section => ({ title: section.title, html: renderBlocks(section.tokens) }))
    .filter(section => section.html)
}

/** 머리말 날짜는 YAML 이 Date 로 읽기도 한다. 문자열로 맞춘다. */
const dateString = (value: unknown): string => {
  if (value instanceof Date)
    return value.toISOString().slice(0, 10)

  return String(value ?? '').trim()
}

const parseRelease = (name: string, source: string): Release => {
  const { data, content } = matter(source)

  const date = dateString(data.date)
  if (`${date}.md` !== name)
    throw new Error(`머리말 date(${date}) 가 파일명과 다르다`)

  const title = String(data.title ?? '').trim()
  if (!title)
    throw new Error('머리말 title 이 비어 있다')

  const platforms = (Array.isArray(data.platforms) ? data.platforms : [])
    .map(value => String(value).trim().toLowerCase())
    .filter((value): value is Platform => (PLATFORMS as readonly string[]).includes(value))

  return { date, title, platforms, sections: toSections(content) }
}

// ── 가져오기

const getText = async (url: string, accept: string): Promise<string> => {
  const response = await fetch(url, {
    headers: { 'Accept': accept, 'User-Agent': 'training-center-public-frontend' },
    signal: AbortSignal.timeout(15_000),
  })

  if (!response.ok)
    throw new Error(`${url} → HTTP ${response.status}`)

  return response.text()
}

const collect = async (): Promise<Release[]> => {
  const listing = JSON.parse(await getText(LIST_URL, 'application/vnd.github+json')) as { name: string; type: string }[]

  if (!Array.isArray(listing))
    throw new Error(`${LIST_URL} 응답이 목록이 아니다`)

  const names = listing
    .filter(entry => entry.type === 'file' && FILE_NAME.test(entry.name))
    .map(entry => entry.name)

  const releases: Release[] = []
  for (const name of names) {
    try {
      releases.push(parseRelease(name, await getText(rawUrl(name), 'text/plain')))
    }
    catch (error) {
      // 파일 하나가 잘못됐다고 나머지를 버리지 않는다.
      console.warn(`⚠️ 변경 기록 ${name} 건너뜀 — ${(error as Error).message}`)
    }
  }

  return releases.sort((a, b) => b.date.localeCompare(a.date))
}

const write = (releases: Release[], source: string) => {
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, `/**
 * ⚠️ 자동 생성 파일 — 직접 고치지 말 것.
 *    \`npm run fetch:content\` 가 매 빌드마다 덮어쓴다.
 *    내용을 바꾸려면 https://github.com/${REPO} 의 releases/ 를 고친다.
 *
 * 출처: ${source}
 * 생성: ${new Date().toISOString().slice(0, 10)}
 */
import type { IRelease } from '@entity/Release'

export const releases: IRelease[] = ${JSON.stringify(releases, null, 2)}
`, 'utf-8')
}

const main = async () => {
  console.log(`변경 기록 수집 — ${LIST_URL}`)

  try {
    const releases = await collect()

    write(releases, `GitHub ${REPO}`)
    console.log(`✅ 변경 기록 ${releases.length}건`)
  }
  catch (error) {
    console.warn(`⚠️ 변경 기록을 가져오지 못했다 — ${(error as Error).message}`)

    if (existsSync(outFile)) {
      console.warn('   직전에 만든 파일을 그대로 쓴다.')
    }
    else {
      write([], '수집 실패 — 빈 목록')
      console.warn('   직전 파일이 없어 빈 목록으로 만든다. /changelog 는 "기록 없음" 으로 나간다.')
    }
  }
}

await main()
