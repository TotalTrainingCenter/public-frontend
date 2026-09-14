/**
 * 공개 API 에서 콘텐츠를 가져와 `src/@variables/generated/*.ts` 로 기록한다.
 *
 * ══════════════════════════════════════════════════════════════
 *  왜 빌드 타임에 가져오는가
 *
 *  이 사이트는 프리렌더된 정적 HTML 이라야 네이버에 노출된다.
 *  런타임에 API 를 부르면 크롤러가 보는 HTML 에는 본문이 없다.
 *  그래서 빌드 시점에 한 번 가져와 코드로 굽는다.
 *
 *  ⚠️ 실패하면 빌드를 중단한다. 조용히 빈 목록으로 넘어가면
 *     공개 사이트에서 글이 통째로 사라지고, 그 상태가 그대로 색인된다.
 * ══════════════════════════════════════════════════════════════
 */
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { activityMeta, COMMON_ACTIVITY_GROUP_ID } from '../src/@variables/activity-meta.js'
import { BOARD_ATTRIBUTE_KEY, PUBLIC_CATEGORY } from '../src/@variables/public-category.js'
import { membershipMeta } from '../src/@variables/membership-meta.js'
import { extractText, renderTiptap } from './tiptap-html.mjs'
import type { TiptapNode } from './tiptap-html.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'src/@variables/generated')
const imageDir = resolve(root, 'public/content')

const API_BASE = process.env.VITE_API_BASE_URL
  ?? process.env.API_BASE_URL
  ?? 'https://api.training-center.org'

/** 카테고리별 목록 엔드포인트. 경로가 한 곳에만 있도록 모아 둔다. */
const contentsUrl = (category: string) => `/v1/public/contents?category=${category}`

const fail = (message: string): never => {
  console.error(`\n❌ 콘텐츠 수집 실패 — ${message}`)
  console.error('   빌드를 중단한다. 이대로 배포하면 공개 사이트에서 글이 사라진다.\n')
  process.exit(1)
}

const api = async <T,>(path: string): Promise<T> => {
  const url = `${API_BASE}${path}`

  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  }
  catch (error) {
    return fail(`${url} 호출 불가 — ${(error as Error).message}`)
  }

  if (!response.ok)
    return fail(`${url} → HTTP ${response.status}`)

  const body = await response.json() as { data?: T; message?: string }

  if (body.data === undefined || body.data === null)
    return fail(`${url} 응답에 data 가 없다 (${body.message ?? '이유 불명'})`)

  return body.data
}

// ── 이미지: 서명 URL 은 600초면 만료된다. 빌드 때 받아서 정적 자산으로 둔다.
const downloaded = new Map<string, string>()

const downloadImage = async (rawSrc: string): Promise<string> => {
  const cached = downloaded.get(rawSrc)
  if (cached)
    return cached

  const absolute = rawSrc.startsWith('http') ? rawSrc : `${API_BASE}${rawSrc}`

  let response: Response
  try {
    response = await fetch(absolute)
  }
  catch (error) {
    return fail(`이미지 다운로드 실패 ${absolute} — ${(error as Error).message}`)
  }

  if (!response.ok)
    return fail(`이미지 다운로드 실패 ${absolute} → HTTP ${response.status}`)

  const buffer = Buffer.from(await response.arrayBuffer())

  // 파일명은 원본 URL 해시. 서명 파라미터가 매 빌드 달라지므로 경로만 해싱한다.
  const pathOnly = absolute.split('?')[0]
  const hash = createHash('sha1').update(pathOnly).digest('hex').slice(0, 16)
  const ext = extname(pathOnly) || '.bin'
  const fileName = `${hash}${ext}`

  mkdirSync(imageDir, { recursive: true })
  writeFileSync(resolve(imageDir, fileName), buffer)

  const localPath = `/content/${fileName}`

  downloaded.set(rawSrc, localPath)

  return localPath
}

/** 본문에 들어 있는 이미지 src 를 모아 미리 받아 둔다(렌더는 동기 함수라서). */
const collectImageSources = (node: TiptapNode | null | undefined, found: string[] = []): string[] => {
  if (!node)
    return found
  if (node.type === 'image' && node.attrs?.src)
    found.push(String(node.attrs.src))
  ;(node.content ?? []).forEach(child => collectImageSources(child, found))

  return found
}

// ── 응답 타입
interface PublicContent {
  id: number
  slug: string | null
  subject: string | null
  content: string | null
  summary: string | null
  attributes: Record<string, string | null>
  createdAt: string | null
  updatedAt: string | null
}

interface PublicActivity {
  id: number
  title: string | null
  description: string | null
  required: boolean
  items: PublicActivity[]
}

interface PublicMembershipPlan {
  id: number
  name: string | null
  price: string | null
  durationInDays: number | null
  durationInMonths: number | null
  shortDescription: string | null
  description: string | null
}

const q = (value: string | null | undefined): string =>
  `'${String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')}'`

const header = (source: string) => `/**
 * ⚠️ 자동 생성 파일 — 직접 고치지 말 것.
 *    \`npm run fetch:content\` 가 매 빌드마다 덮어쓴다.
 *    내용을 바꾸려면 관리자 화면에서 글을 수정하고 다시 배포한다.
 *
 * 출처: ${source}
 * 생성: ${new Date().toISOString().slice(0, 10)}
 */
`

const dateOf = (item: PublicContent): string =>
  (item.createdAt ?? new Date().toISOString()).slice(0, 10)

/** 본문(TipTap JSON 또는 평문)을 HTML 로. 이미지는 미리 받아 로컬 경로로 치환한다. */
const toHtml = async (raw: string | null): Promise<{ html: string; text: string }> => {
  if (!raw)
    return { html: '', text: '' }

  let doc: TiptapNode | null = null
  try {
    const parsed = JSON.parse(raw)

    doc = (parsed?.original ?? parsed) as TiptapNode
  }
  catch {
    // 에디터가 아닌 평문(textarea) 필드
    const paragraphs = raw.split(/\r?\n{2,}/).filter(Boolean)

    return {
      html: paragraphs.map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br>')}</p>`).join(''),
      text: raw,
    }
  }

  const sources = collectImageSources(doc)
  const map = new Map<string, string>()
  for (const src of sources)
    map.set(src, await downloadImage(src))

  return {
    html: renderTiptap(doc, { resolveImageSrc: src => map.get(src) ?? src }),
    text: extractText(doc).replace(/\s+/g, ' ').trim(),
  }
}

const summarize = (item: PublicContent, text: string): string => {
  const summary = item.summary?.trim()
  if (summary)
    return summary

  return text.length > 120 ? `${text.slice(0, 120)}…` : text
}

/** slug 누락·중복은 URL 을 깨뜨린다. 조용히 넘어가지 않고 빌드를 세운다. */
const assertSlugs = (items: { slug: string }[], label: string) => {
  const seen = new Set<string>()
  for (const item of items) {
    if (!item.slug)
      fail(`${label} 에 slug 가 비어 있는 글이 있다.`)
    if (seen.has(item.slug))
      fail(`${label} 에 slug 가 중복된다: ${item.slug} — 관리자에서 고쳐야 한다.`)
    seen.add(item.slug)
  }
}

const main = async () => {
  console.log(`콘텐츠 수집 — ${API_BASE}`)

  rmSync(imageDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })

  // ── 공지
  const noticeRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.notice.key))
  const notices: { slug: string; title: string; description: string; date: string; html: string }[] = []
  for (const item of noticeRaw.list) {
    const { html, text } = await toHtml(item.content)

    notices.push({
      slug: item.slug ?? String(item.id),
      title: item.subject ?? '(제목 없음)',
      description: summarize(item, text),
      date: dateOf(item),
      html,
    })
  }
  assertSlugs(notices, `${PUBLIC_CATEGORY.notice.label}(${PUBLIC_CATEGORY.notice.key})`)

  writeFileSync(resolve(outDir, 'notices.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.notice.key)}`)}
import type { INotice } from '@entity/ContentEntry'

export const notices: INotice[] = [
${notices.map(n => `  {
    slug: ${q(n.slug)},
    title: ${q(n.title)},
    description: ${q(n.description)},
    date: ${q(n.date)},
    html: ${q(n.html)},
  },`).join('\n')}
]

export const findNotice = (slug: string) => notices.find(item => item.slug === slug)
`, 'utf-8')

  // ── FAQ
  const faqRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.faq.key))
  const faqs = faqRaw.list.map(item => ({
    question: item.subject ?? '',
    answer: (item.content ?? '').trim(),
  })).filter(f => f.question && f.answer)

  writeFileSync(resolve(outDir, 'faqs.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.faq.key)}`)}
export interface IFaq {
  question: string
  answer: string
}

export const faqs: IFaq[] = [
${faqs.map(f => `  {
    question: ${q(f.question)},
    answer: ${q(f.answer)},
  },`).join('\n')}
]
`, 'utf-8')

  // ── 후기
  const storyRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.story.key))
  const stories: { slug: string; title: string; description: string; date: string; html: string; relatedActivity: string }[] = []
  for (const item of storyRaw.list) {
    const { html, text } = await toHtml(item.content)

    stories.push({
      slug: item.slug ?? String(item.id),
      title: item.subject ?? '(제목 없음)',
      description: summarize(item, text),
      date: dateOf(item),
      html,
      relatedActivity: item.attributes?.[BOARD_ATTRIBUTE_KEY.relatedActivity] ?? '',
    })
  }
  assertSlugs(stories, `${PUBLIC_CATEGORY.story.label}(${PUBLIC_CATEGORY.story.key})`)

  writeFileSync(resolve(outDir, 'stories.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.story.key)}`)}
import type { IStory } from '@entity/ContentEntry'

export const stories: IStory[] = [
${stories.map(s => `  {
    slug: ${q(s.slug)},
    title: ${q(s.title)},
    description: ${q(s.description)},
    date: ${q(s.date)},
    html: ${q(s.html)},
    relatedActivity: ${q(s.relatedActivity)},
  },`).join('\n')}
]

export const findStory = (slug: string) => stories.find(item => item.slug === slug)
`, 'utf-8')

  // ── 활동
  const activities = await api<PublicActivity[]>('/v1/public/activities')
  const common = activities.find(g => g.id === COMMON_ACTIVITY_GROUP_ID)
  const groups = activities.filter(g => g.id !== COMMON_ACTIVITY_GROUP_ID)

  const missing = groups.filter(g => !activityMeta[g.id])
  if (missing.length) {
    fail(`활동 그룹 메타가 없다: ${missing.map(g => `${g.id}(${g.title})`).join(', ')}\n`
      + '   src/@variables/activity-meta.ts 에 slug 를 추가할 것.')
  }

  // DB 의 description 은 "설명 / 인증방법" 형태다.
  const splitDescription = (value: string | null) => {
    const [description, proof] = String(value ?? '').split(' / ')

    return { description: (description ?? '').trim(), proof: (proof ?? '').trim() }
  }

  const proofType = (proof: string): string => {
    if (/영상/.test(proof)) return '동영상'
    if (/사진|캡처|이미지|스크린샷|인증샷/.test(proof)) return '이미지'

    return '텍스트'
  }

  const renderItems = (items: PublicActivity[]) => items.map(item => {
    const { description, proof } = splitDescription(item.description)

    return `      {
        name: ${q(item.title)},
        description: ${q(description)},
        proof: ${q(proof || '활동 화면의 안내를 따릅니다')},
        proofType: ${q(proofType(proof))},
        required: ${item.required},
      },`
  }).join('\n')

  writeFileSync(resolve(outDir, 'activities.ts'), `${header('공개 API /v1/public/activities')}
import type { IPublicActivityGroup, IPublicActivityItem } from '@entity/PublicActivity'

/** 회원 등록 시 전원에게 자동 부여되는 공통 활동. 주제 페이지를 만들지 않는다. */
export const commonActivities: IPublicActivityItem[] = [
${renderItems(common?.items ?? []).replace(/^ {6}/gm, '  ')}
]

export const activityGroups: IPublicActivityGroup[] = [
${groups.map((group) => {
  const meta = activityMeta[group.id]
  const names = group.items.map(i => i.title).filter(Boolean).slice(0, 4).join(', ')
  const title = meta.category.endsWith('활동') ? meta.category : `${meta.category} 활동`
  const description = `${names} 등 ${group.items.length}가지. ${meta.category} 주제의 활동을 수행하고 인증으로 남겨 보세요.`
  const intro = `${meta.category} 주제에는 ${group.items.length}개의 활동이 있습니다. `
    + '활동마다 무엇을 인증해야 하는지 정해져 있어, 무엇을 할지 고민할 필요 없이 고르고 수행하면 됩니다.'

  return `  {
    slug: ${q(meta.slug)},
    title: ${q(title)},
    category: ${q(meta.category)},
    description: ${q(description)},
    intro: ${q(intro)},
    date: '2026-01-01',
    targets: [${meta.targets.map(t => q(t)).join(', ')}],
    items: [
${renderItems(group.items)}
    ],
  },`
}).join('\n')}
]

export const findActivityGroup = (slug: string) =>
  activityGroups.find(group => group.slug === slug)

export const totalActivityCount = activityGroups
  .reduce((sum, group) => sum + group.items.length, 0)
`, 'utf-8')

  // ── 멤버십
  const plans = await api<PublicMembershipPlan[]>('/v1/public/membership-plans')

  const priceLabel = (price: string | null) => {
    const value = Number(price ?? 0)

    return value === 0 ? '무료' : `₩${value.toLocaleString('ko-KR')}`
  }
  const periodLabel = (plan: PublicMembershipPlan) =>
    plan.durationInDays ? `${plan.durationInDays}일` : `${plan.durationInMonths ?? 1}개월`

  writeFileSync(resolve(outDir, 'membership.ts'), `${header('공개 API /v1/public/membership-plans')}
import type { IPublicMembershipPlan } from '@entity/PublicMembershipPlan'

export const membershipPlans: IPublicMembershipPlan[] = [
${plans.map((plan) => {
  const meta = membershipMeta[plan.name ?? ''] ?? { recommended: false, features: [] }

  return `  {
    code: ${q(plan.name)},
    name: ${q(plan.name)},
    price: ${q(priceLabel(plan.price))},
    period: ${q(periodLabel(plan))},
    summary: ${q(plan.shortDescription)},
    features: [
${meta.features.map(f => `      { label: ${q(f.label)}, available: ${f.available} },`).join('\n')}
    ],
    recommended: ${meta.recommended},
  },`
}).join('\n')}
]
`, 'utf-8')

  console.log(`✅ 공지 ${notices.length} · FAQ ${faqs.length} · 후기 ${stories.length} `
    + `· 활동 ${groups.length}그룹 · 멤버십 ${plans.length} · 이미지 ${downloaded.size}장`)
}

await main()
