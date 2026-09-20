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
import { COMMON_ACTIVITY_GROUP_ID, TARGET_LABELS, activityMeta } from '../src/@variables/activity-meta.js'
import { BOARD_ATTRIBUTE_KEY, PUBLIC_CATEGORY } from '../src/@variables/public-category.js'
import { membershipMeta } from '../src/@variables/membership-meta.js'
import { extractText, renderTiptap } from './tiptap-html.mjs'
import type { TiptapNode } from './tiptap-html.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const generatedDir = resolve(root, 'src/@variables/generated')

/** 로케일별 생성물 위치. 루트에는 세 언어를 묶는 배럴만 둔다. */
const localeOutDir = (locale: Locale) => resolve(generatedDir, locale)
const imageDir = resolve(root, 'public/content')

const API_BASE = process.env.VITE_API_BASE_URL
  ?? process.env.API_BASE_URL
  ?? 'https://api.training-center.org'

/**
 * 수집할 로케일.
 *
 * 프론트의 SUPPORTED_LOCALES(src/plugins/i18n/index.ts) 와 짝을 이룬다.
 * 언어를 쿠키로 바꾸는 구조라 클라이언트가 세 언어를 모두 들고 있어야 한다.
 *
 * ⚠️ [SOURCE_LOCALE] 은 원문이다. 맨 먼저 수집해야 한다.
 *    활동 메타·멤버십 메타가 한국어 값을 키로 쓰기 때문에, 번역본만으로는
 *    메타를 찾지 못한다. (main 의 metaKeyByPlanId 주석 참고)
 */
const LOCALES = ['ko', 'ja', 'en'] as const

type Locale = typeof LOCALES[number]

const SOURCE_LOCALE: Locale = 'ko'

/** 카테고리별 목록 엔드포인트. 경로가 한 곳에만 있도록 모아 둔다. */
const contentsUrl = (category: string, locale: Locale) =>
  `/v1/public/contents?category=${category}&locale=${locale}`

const fail = (message: string): never => {
  console.error(`\n❌ 콘텐츠 수집 실패 — ${message}`)
  console.error('   빌드를 중단한다. 이대로 배포하면 공개 사이트에서 글이 사라진다.\n')
  process.exit(1)
}

const api = async <T>(path: string): Promise<T> => {
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
  `'${String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n')}'`

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

/**
 * 한 로케일분을 수집해 `generated/<locale>/` 에 쓴다.
 *
 * @param metaKeyByPlanId 멤버십 플랜 id → **한국어** 플랜명.
 *   membershipMeta 는 한국어 이름을 키로 쓴다. 번역된 이름으로 찾으면 전부 빗나가고,
 *   기능 목록과 추천 배지가 통째로 사라진 채 배포된다. 원문 패스에서 만든 표를 넘겨받는다.
 */
const collectAndWrite = async (locale: Locale, metaKeyByPlanId: Map<number, string>) => {
  const outDir = localeOutDir(locale)
  mkdirSync(outDir, { recursive: true })

  // ── 공지
  const noticeRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.notice.key, locale))
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

  writeFileSync(resolve(outDir, 'notices.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.notice.key, locale)}`)}
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
  const faqRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.faq.key, locale))

  const faqs = faqRaw.list.map(item => ({
    question: item.subject ?? '',
    answer: (item.content ?? '').trim(),
  })).filter(f => f.question && f.answer)

  writeFileSync(resolve(outDir, 'faqs.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.faq.key, locale)}`)}
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
  const storyRaw = await api<{ total: number; list: PublicContent[] }>(contentsUrl(PUBLIC_CATEGORY.story.key, locale))
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

  writeFileSync(resolve(outDir, 'stories.ts'), `${header(`공개 API ${contentsUrl(PUBLIC_CATEGORY.story.key, locale)}`)}
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
  const activities = await api<PublicActivity[]>(`/v1/public/activities?locale=${locale}`)
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
    if (/영상/.test(proof))
      return '동영상'
    if (/사진|캡처|이미지|스크린샷|인증샷/.test(proof))
      return '이미지'

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

  writeFileSync(resolve(outDir, 'activities.ts'), `${header(`공개 API /v1/public/activities?locale=${locale}`)}
import type { IPublicActivityGroup, IPublicActivityItem } from '@entity/PublicActivity'

/** 회원 등록 시 전원에게 자동 부여되는 공통 활동. 주제 페이지를 만들지 않는다. */
export const commonActivities: IPublicActivityItem[] = [
${renderItems(common?.items ?? []).replace(/^ {6}/gm, '  ')}
]

export const activityGroups: IPublicActivityGroup[] = [
${groups.map(group => {
  const meta = activityMeta[group.id]
  const names = group.items.map(i => i.title).filter(Boolean).slice(0, 4).join(', ')
  const category = meta.category[locale]
  const count = group.items.length

  /*
   * 제목·설명·인트로는 여기서 조립한다. 문장 틀이 언어마다 다르므로
   * 한 곳에 몰아 두지 않으면 ja/en 파일에 한국어가 섞여 들어간다.
   */
  const title = locale === 'ko'
    ? (category.endsWith('활동') ? category : `${category} 활동`)
    : category

  const description = locale === 'ja'
    ? `${names} など${count}種類。${category}のアクティビティを実行して、認証として残してみましょう。`
    : locale === 'en'
      ? `${names} and ${count} more. Take on the ${category} activities and log them as verified records.`
      : `${names} 등 ${count}가지. ${category} 주제의 활동을 수행하고 인증으로 남겨 보세요.`

  const intro = locale === 'ja'
    ? `${category}のテーマには${count}個のアクティビティがあります。`
      + 'アクティビティごとに何を認証すべきか決まっているので、何をするか悩む必要はありません。選んで実行するだけです。'
    : locale === 'en'
      ? `There are ${count} activities under ${category}. `
        + 'Each one states what you need to submit as proof, so there is nothing to work out — just pick one and do it.'
      : `${category} 주제에는 ${count}개의 활동이 있습니다. `
        + '활동마다 무엇을 인증해야 하는지 정해져 있어, 무엇을 할지 고민할 필요 없이 고르고 수행하면 됩니다.'

  return `  {
    slug: ${q(meta.slug)},
    title: ${q(title)},
    category: ${q(category)},
    description: ${q(description)},
    intro: ${q(intro)},
    date: '2026-01-01',
    targets: [${meta.targets.map(label => q(TARGET_LABELS[label]?.[locale] ?? label)).join(', ')}],
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
  const plans = await api<PublicMembershipPlan[]>(`/v1/public/membership-plans?locale=${locale}`)

  /*
   * 가격·기간 표기는 로케일마다 다르다.
   * 화면에서 $t 로 풀지 않고 여기서 굽는 이유: 이 값들은 이미 로케일별 파일로
   * 나뉘어 생성되고, 통화 표기는 Intl 이 로케일을 알아야 제대로 나온다.
   */
  const FREE_LABEL: Record<Locale, string> = { ko: '무료', ja: '無料', en: 'Free' }
  const INTL_LOCALE: Record<Locale, string> = { ko: 'ko-KR', ja: 'ja-JP', en: 'en-US' }

  const priceLabel = (price: string | null) => {
    const value = Number(price ?? 0)

    return value === 0 ? FREE_LABEL[locale] : `₩${value.toLocaleString(INTL_LOCALE[locale])}`
  }

  const periodLabel = (plan: PublicMembershipPlan) => {
    const days = plan.durationInDays
    const months = plan.durationInMonths ?? 1

    if (locale === 'ja') return days ? `${days}日` : `${months}か月`
    // ⚠️ 영어는 단수/복수를 구분한다. 1 months 는 곧바로 어색해 보인다.
    if (locale === 'en') {
      return days
        ? `${days} ${days === 1 ? 'day' : 'days'}`
        : `${months} ${months === 1 ? 'month' : 'months'}`
    }

    return days ? `${days}일` : `${months}개월`
  }

  writeFileSync(resolve(outDir, 'membership.ts'), `${header(`공개 API /v1/public/membership-plans?locale=${locale}`)}
import type { IPublicMembershipPlan } from '@entity/PublicMembershipPlan'

export const membershipPlans: IPublicMembershipPlan[] = [
${plans.map(plan => {
  // ⚠️ 번역된 이름이 아니라 원문(한국어) 이름으로 찾는다. collectAndWrite 주석 참고.
  const metaKey = metaKeyByPlanId.get(plan.id) ?? plan.name ?? ''
  const meta = membershipMeta[metaKey] ?? { recommended: false, features: [] }

  return `  {
    code: ${q(plan.name)},
    name: ${q(plan.name)},
    price: ${q(priceLabel(plan.price))},
    period: ${q(periodLabel(plan))},
    summary: ${q(plan.shortDescription)},
    features: [
${meta.features.map(f => `      { labelKey: ${q(f.labelKey)}, available: ${f.available} },`).join('\n')}
    ],
    recommended: ${meta.recommended},
  },`
}).join('\n')}
]
`, 'utf-8')

  console.log(`  [${locale}] 공지 ${notices.length} · FAQ ${faqs.length} · 후기 ${stories.length} `
    + `· 활동 ${groups.length}그룹 · 멤버십 ${plans.length}`)

  // 원문 패스에서 메타 조회용 표를 만들어 둔다. 번역 패스가 이 값을 쓴다.
  return new Map<number, string>(plans.map(plan => [plan.id, plan.name ?? '']))
}

/**
 * 세 언어를 묶는 배럴을 쓴다.
 *
 * ⚠️ 루트 이름(notices, activityGroups …)은 **원문(한국어)** 을 가리킨다.
 *    scripts/routes.mts 가 Node 에서 이 이름들을 임포트해 사이트맵을 만드는데,
 *    Node 에는 vue-i18n 도 쿠키도 없어서 현재 언어라는 개념 자체가 없다.
 *    화면에서 언어를 따라가려면 <name>ByLocale 을 쓴다.
 */
const writeBarrels = () => {
  const barrels: { file: string; names: string[] }[] = [
    { file: 'notices.ts', names: ['notices', 'findNotice'] },
    { file: 'faqs.ts', names: ['faqs'] },
    { file: 'stories.ts', names: ['stories', 'findStory'] },
    { file: 'activities.ts', names: ['commonActivities', 'activityGroups', 'findActivityGroup'] },
    { file: 'membership.ts', names: ['membershipPlans'] },
  ]

  for (const { file, names } of barrels) {
    const imports = LOCALES
      .map(locale => `import * as ${locale} from './${locale}/${file.replace(/\.ts$/, '')}'`)
      .join('\n')

    const byLocale = names
      .filter(name => !name.startsWith('find'))
      .map(name => `export const ${name}ByLocale = {\n`
        + LOCALES.map(locale => `  ${locale}: ${locale}.${name},`).join('\n')
        + `\n} as const\n`)
      .join('\n')

    writeFileSync(resolve(generatedDir, file), `${header(`generated/<locale>/${file}`)}
${imports}

/** 원문(한국어). Node 스크립트와 기존 임포트가 이 이름을 쓴다. */
export * from './${SOURCE_LOCALE}/${file.replace(/\.ts$/, '')}'

${byLocale}`, 'utf-8')
  }
}

const main = async () => {
  console.log(`콘텐츠 수집 — ${API_BASE}`)

  // 이미지는 로케일과 무관하다. 루프 밖에서 한 번만 비운다.
  rmSync(imageDir, { recursive: true, force: true })
  mkdirSync(generatedDir, { recursive: true })

  // 원문을 먼저 수집해야 한다. 메타 조회 표가 여기서 나온다.
  const metaKeyByPlanId = await collectAndWrite(SOURCE_LOCALE, new Map())

  for (const locale of LOCALES) {
    if (locale === SOURCE_LOCALE) continue
    await collectAndWrite(locale, metaKeyByPlanId)
  }

  writeBarrels()

  console.log(`✅ ${LOCALES.length}개 로케일 수집 완료 · 이미지 ${downloaded.size}장`)
}

await main()
