/**
 * TipTap 문서(JSON) → HTML 변환기.
 *
 * @tiptap/html 의 generateHTML 을 쓰지 않고 직접 만든 이유:
 *   1. 결과 HTML 이 v-html 로 들어간다. 여기서 만들어 내는 태그만 나갈 수 있도록
 *      **허용 목록 방식**이어야 안전하다. 텍스트는 전부 이스케이프한다.
 *   2. 이미지 src 를 로컬 경로로 바꿔치기해야 하는데, 이 방식이면 그 지점이 명확하다.
 *   3. 서버 사이드에서 돌리려면 DOM 이 필요한데, 그 의존을 들이지 않아도 된다.
 *
 * 새 노드 타입이 필요하면 여기에 명시적으로 추가할 것.
 * 모르는 노드는 조용히 버리지 않고 자식만 렌더한다(내용 유실 방지).
 */

export interface TiptapNode {
  type?: string
  text?: string
  attrs?: Record<string, any>
  marks?: { type: string; attrs?: Record<string, any> }[]
  content?: TiptapNode[]
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const escapeAttr = (value: string): string => escapeHtml(value).replace(/'/g, '&#39;')

/** 텍스트 노드의 마크(굵게/기울임/링크 등)를 감싼다. */
const applyMarks = (text: string, marks: TiptapNode['marks']): string => {
  if (!marks?.length)
    return text

  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case 'bold': case 'strong': return `<strong>${acc}</strong>`
      case 'italic': case 'em': return `<em>${acc}</em>`
      case 'underline': return `<u>${acc}</u>`
      case 'strike': return `<s>${acc}</s>`
      case 'code': return `<code>${acc}</code>`
      case 'highlight': return `<mark>${acc}</mark>`
      case 'subscript': return `<sub>${acc}</sub>`
      case 'superscript': return `<sup>${acc}</sup>`
      case 'link': {
        const href = String(mark.attrs?.href ?? '')

        // javascript: 같은 스킴이 들어오면 링크를 만들지 않는다.
        if (!/^(https?:\/\/|mailto:|\/)/i.test(href))
          return acc

        const external = /^https?:\/\//i.test(href)

        return `<a href="${escapeAttr(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${acc}</a>`
      }
      default: return acc
    }
  }, text)
}

const alignStyle = (attrs?: Record<string, any>): string =>
  attrs?.textAlign && attrs.textAlign !== 'left' ? ` style="text-align:${escapeAttr(String(attrs.textAlign))}"` : ''

export interface RenderOptions {
  /** 이미지 src 를 바꿔치기한다. 빌드 때 내려받은 로컬 경로를 돌려주면 된다. */
  resolveImageSrc?: (src: string) => string
}

export const renderTiptap = (node: TiptapNode | null | undefined, options: RenderOptions = {}): string => {
  if (!node)
    return ''

  const children = (): string => (node.content ?? []).map(child => renderTiptap(child, options)).join('')

  switch (node.type) {
    case 'doc':
      return children()

    case 'text':
      return applyMarks(escapeHtml(node.text ?? ''), node.marks)

    case 'paragraph': {
      const inner = children()

      // 빈 문단은 줄바꿈으로 쓰이므로 유지한다.
      return `<p${alignStyle(node.attrs)}>${inner || '<br>'}</p>`
    }

    case 'heading': {
      // 본문 안의 제목은 h2 부터 시작한다. 페이지의 h1 은 제목이 이미 차지하고 있다.
      const level = Math.min(6, Math.max(2, Number(node.attrs?.level ?? 2) + 1))

      return `<h${level}${alignStyle(node.attrs)}>${children()}</h${level}>`
    }

    case 'bulletList': return `<ul>${children()}</ul>`
    case 'orderedList': return `<ol>${children()}</ol>`
    case 'listItem': return `<li>${children()}</li>`
    case 'blockquote': return `<blockquote>${children()}</blockquote>`
    case 'codeBlock': return `<pre><code>${children()}</code></pre>`
    case 'horizontalRule': return '<hr>'
    case 'hardBreak': return '<br>'

    case 'table': return `<div class="table-scroll"><table>${children()}</table></div>`
    case 'tableRow': return `<tr>${children()}</tr>`
    case 'tableHeader': return `<th>${children()}</th>`
    case 'tableCell': return `<td>${children()}</td>`

    case 'image': {
      const raw = String(node.attrs?.src ?? '')
      if (!raw)
        return ''

      const src = options.resolveImageSrc ? options.resolveImageSrc(raw) : raw
      const alt = escapeAttr(String(node.attrs?.alt ?? ''))

      // 본문 이미지는 항상 지연 로딩. 공지 한 건에 이미지가 여러 장 붙는 경우가 있다.
      return `<img src="${escapeAttr(src)}" alt="${alt}" loading="lazy" decoding="async">`
    }

    default:
      // 모르는 노드 타입 — 자식은 살린다.
      return children()
  }
}

/** 본문에서 텍스트만 뽑는다. 메타 설명(description) 생성에 쓴다. */
export const extractText = (node: TiptapNode | null | undefined): string => {
  if (!node)
    return ''
  if (node.type === 'text')
    return node.text ?? ''

  const inner = (node.content ?? []).map(extractText).join('')

  return node.type === 'paragraph' || node.type === 'heading' ? `${inner} ` : inner
}
