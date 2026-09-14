# 작업 기록 — 공개 검색 노출(SEO) 대응

> 목적: 종합 훈련 센터를 구글·네이버에 검색 노출시키고 대중 접근성을 확보한다.

---

## 1. 문제 진단 (착수 전 상태)

`total.training-center.org` 는 검색엔진에 색인될 수 없는 상태였다.

| # | 문제 | 영향 |
|---|---|---|
| 1 | `/` 접근 시 비로그인 사용자를 auth 로 리다이렉트 (`additional-routes.ts`) | **크롤러가 볼 본문이 0바이트** |
| 2 | Vue SPA(CSR) — 정적 HTML 에 본문 없음 | 네이버 Yeti 는 JS 를 거의 실행하지 않아 **영구 미노출** |
| 3 | 전 페이지가 `index.html` 의 메타 1벌 공유 | 색인돼도 중복 페이지 처리 |
| 4 | `sitemap.xml` 이 SPA fallback HTML 반환 (200 이지만 내용은 HTML) | 제출 시 오류 처리 |
| 5 | `robots.txt` 에 `Sitemap:` 줄 없음 | 사이트맵 자동 발견 불가 |
| 6 | `og:image` 누락 | 카톡·SNS 공유 시 썸네일 없음 |
| 7 | apex/www 가 total 로 301 | 공개 사이트를 놓을 자리가 없음 |

이미 되어 있던 것: 네이버 소유확인 HTML 2개, GA4(`G-M6K6CZGYTB`), canonical, 루트 도메인 301.

---

## 2. 결정한 구조

| 도메인 | 역할 | 색인 |
|---|---|---|
| `training-center.org` (apex) | **공개 소개 사이트** (신규) | ✅ 정본 |
| `www.training-center.org` | apex 로 301 | — |
| `total.training-center.org` | 기존 플랫폼 앱 | ❌ `noindex` |

**판단 근거**: 로그인 앱에 SEO 를 억지로 붙이는 것보다 공개 사이트를 분리하는 편이
인증 가드와 얽히지 않고, 정적 HTML 생성이 자유로우며, 유지보수가 싸다.
apex 를 정본으로 둔 이유는 한국 사용자가 www 를 잘 입력하지 않기 때문.

---

## 3. 수행한 작업

### 3-1. 신규 프로젝트 `github/public-frontend`

레퍼런스 `기본 프로젝트 구조`(Vuexy)의 `front-pages` 를 베이스로 스캐폴딩하고,
개발 규약은 `github/total-frontend` 에 맞췄다.

**걷어낸 것**: 데모 페이지 전체, fake-api/MSW, 관리자 셸 레이아웃(`default.vue`),
`src/navigation`, 데모 다이얼로그·뷰, Docker/nginx 설정, pnpm-lock.

**total-frontend 규약 정렬**
- 별칭 `@entity` / `@variables` 추가 (tsconfig + vite)
- 개발 포트 **7307** `strictPort` — `VITE_AUTH_DEV_PORTS`(7300~7306)와 미충돌
- `deferInitialCss` 플러그인, `build.target: ['es2018','safari13']`
- scripts: `dev / build / deploy / preview / typecheck / lint / build:icons`
- `.env` / `.env.example` / `.env.production` 3종, `VERSION`, `.gitignore`
- `.eslintrc.cjs` indent 규칙, `gtag.ts`, `useApi.ts`, i18n(ko)

### 3-2. SEO 엔진

| 파일 | 역할 |
|---|---|
| `src/composables/useSeo.ts` | 페이지별 title/description/canonical/OG/JSON-LD 일괄 처리 |
| `src/plugins/3.head.ts` | `@unhead/vue` 등록 |
| `scripts/routes.mts` | **프리렌더 + 사이트맵이 공유하는 단일 라우트 목록** |
| `scripts/prerender.mts` | 헤드리스 크롬으로 전 라우트 정적 HTML 스냅샷 생성 |
| `scripts/generate-sitemap.mts` | `sitemap.xml` + `rss.xml`(네이버 제출용) |
| `public/robots.txt` | Yeti·Daumoa 명시 + Sitemap 선언 |

`npm run build` = `vite build` → `prerender` → `sitemap`. **순서 의존**.

### 3-3. 정보 구조 (21 URL)

```
/                      랜딩
/about                 서비스 소개
/features              주요 기능 (5단계 흐름)
/activities            활동 주제 목록
/activities/{slug}     활동 그룹 상세 × 6
/guide                 이용 가이드 (6단계)
/membership            멤버십 안내
/partnership           제휴 문의
/faq                   자주 묻는 질문
/notice, /notice/{slug}    공지 × 2
/stories, /stories/{slug}  활동 후기 × 2
/policy                약관 허브 (noindex, 원문은 policy.training-center.org)
```

### 3-4. 콘텐츠 (실제 사내 자료 기반)

| 출처 | 반영 위치 |
|---|---|
| ~~`document/routine/종훈센_활동_정리_전체.xlsx`~~ | **폐기** — 운영 DB 로 대체 (§8 참고) |
| ~~`document/platform/멤버십등급_기능비교표.xlsx`~~ | **폐기** — 실제 요금과 불일치 (§8 참고) |
| **`common.activity` (운영 DB)** | `@variables/activities.ts` — **30그룹 188활동 + 공통활동 3** |
| `document/SNS 공식 플랫폼 고정글.txt` | `/about` 브랜드 서사 |
| `document/이걸 하면 좋은점 정리.txt` | `/about` "왜 만들었나" |
| `github/policy-frontend` 정책 8종 | `/policy` 외부 링크 |
| `SNS/sns-agent/references/…` | 공식 SNS 계정 주소 |

랜딩 섹션(Hero/Features/Activities/Stats/Membership/Stories/FAQ/CTA/Contact)의
Vuexy 데모 영문 카피는 전부 실제 한국어 콘텐츠로 교체했다.

프리렌더 결과 **21페이지 총 23,593자**의 고유 본문 확보.

### 3-5. 브랜드 (로고 신규 제작)

기존 로고는 Vuexy 템플릿 기본 마크(V)를 그대로 쓰고 있어 서비스 정체성이 없었다.

**컨셉**: 분절된 원(하루치 기록) + 열린 틈(끝나지 않음) + 틈을 뚫고 상승하는 체크(인증)

산출물: `logo-mark.svg`, `logo-lockup.svg`, `favicon.ico`(16/32/48),
`icon-192/512.png`, `apple-touch-icon.png`, `og-image.png`(1200×630)

### 3-6. 기존 프로젝트 정리 — `total-frontend`

- `index.html`: `robots` → `noindex, follow`, canonical → `https://training-center.org/`
- `public/robots.txt`: 크롤링 **허용** + Sitemap 선언

### 3-7. 인프라

`deploy/apache-training-center.conf` — www→apex 301, 프리렌더 스냅샷 우선 서빙,
정적 자산 장기 캐시 / HTML 무캐시. 배포는 기존 EC2 Apache 에 vhost 추가.

```
/var/www/total     ← total-frontend
/var/www/public    ← public-frontend (신규)
```

---

## 4. 작업 중 발견해 고친 것

### 4-1. 프리렌더 스냅샷 오염 (치명)
정적 서버가 SPA fallback 으로 `dist/index.html` 을 읽는데, 프리렌더가 그 파일을
`/` 스냅샷으로 **덮어쓴 뒤**였다. 이후 모든 라우트가 `/` 페이지의 JSON-LD 를 물려받았다.
→ 원본 `index.html` 을 메모리에 확보해 서빙하도록 수정. HTML 은 항상 원본 우선.

### 4-2. `robots.txt` Disallow + noindex 충돌
`total-frontend` 를 `Disallow: /` 로 막으면 크롤러가 `noindex` 메타를 **읽지 못해**
기존 색인이 "robots.txt 로 차단됨" 상태로 남는다.
→ 크롤링 허용 + noindex 조합으로 수정. 색인이 빠진 뒤 차단 여부를 재검토.

### 4-3. 접힌 아코디언이 DOM 에 없음
FAQ 를 `VExpansionPanel` 로 만들면 접힌 답변이 DOM 에 렌더되지 않아
프리렌더 HTML 에 본문이 빠진다. → `eager` 속성 적용.

### 4-4. `import.meta.env` 가 Node 에서 undefined
`site.ts` 를 `generate-sitemap.mts`(Node) 가 임포트하는데 `import.meta.env` 가 없어 크래시.
→ 안전 접근 헬퍼 `env()` 경유로 변경.

### 4-5. OG 이미지 마크가 검게 채워짐
루트 `<svg>` 에 `fill="none"` 이 없어 arc path 가 기본 fill(black)로 칠해졌다.
→ `<g fill="none">` 추가.

### 4-6. 개발 포트 충돌
최초 7300 으로 잡았으나 `VITE_AUTH_DEV_PORTS` 의 `auth:7300` 과 충돌. → 7307.

---

## 5. 검증 결과

```
✅ vite build          성공
✅ prerender           21/21 라우트 정적 HTML 생성
✅ sitemap             20/21 URL (noindex 페이지 1건 제외)
✅ 페이지별 고유 title/description/canonical
✅ 페이지당 h1 정확히 1개
✅ JSON-LD             Organization / WebSite / HowTo / FAQPage / Article / BlogPosting / ItemList
✅ 본문 총 23,593자    JS 실행 없이 정적 HTML 에서 읽힘
```

---

## 6. 판단이 필요했던 지점

**공개 범위**: `document/` 의 기획 자료에는 성인향·통제 관련 활동과
CONTROLLER / SYSTEM HOLDER 등급이 포함돼 있다. 공개 사이트에는 싣지 않았다.

- 네이버에 유해사이트로 분류되면 **도메인 전체가 검색에서 빠진다**
- 기존 SNS 운영 기준(`SNS/sns-agent/references/ttc-service-observations.md`)이
  이미 "secret/adult 자료를 공개 소재로 쓰지 않는다"고 못박고 있어 그에 맞췄다
- 해당 등급은 `/partnership` 개별 문의로 안내

이 판단을 바꾸시려면 `@variables/membership.ts` 주석을 참고해 수정하면 된다.

**정책 문서**: `policy-frontend` 의 8개 정책을 복제하지 않고 링크로 연결했다.
두 도메인에 같은 법적 문서가 있으면 중복 콘텐츠 감점 + 개정 시 어긋날 위험이 있다.

---

## 7. 배포 전 남은 일 (사람이 해야 하는 것)

### 인프라
- [ ] apex/www → total 로 걸린 **기존 301 제거** ← 이거 안 하면 vhost 가 안 먹는다
- [ ] `deploy/apache-training-center.conf` 를 서버에 반영
- [ ] `public-frontend/.deploy.env` 작성 후 `npm run deploy`
- [ ] `total-frontend` 재배포 (noindex 반영)
- [ ] `npm i -D puppeteer` (프리렌더 필수)

### 검색엔진 등록
- [ ] 구글 서치콘솔 — DNS TXT 도메인 속성 등록 → sitemap 제출
- [ ] 네이버 서치어드바이저 — apex 소유확인 → 사이트맵 + **RSS** 제출 → 수집 요청
- [ ] 다음(카카오) 검색등록
- [ ] 빙 웹마스터 — 서치콘솔에서 가져오기

### 콘텐츠 (지속)
- [ ] 활동 주제 확충 (실서비스엔 30개+ 카테고리 존재, 현재 6개만 반영)
- [ ] 후기 주 2~3편 발행
- [ ] **네이버 블로그·카페 개설** ← 네이버 검색은 사이트보다 블로그·카페가 지배한다
- [ ] 푸터 사업자 정보 표기 (통신판매업 신고 시 법적 의무)

### 환경 문제
- [ ] `sudo chown -R 501:20 ~/.npm` — npm 캐시에 root 소유 파일이 있어 `npm i` 가 EACCES 로 실패한다
      (작업 중에는 임시 캐시로 우회했음)


---

## 8. 운영 DB 연동 — 로컬 자료가 실제와 달랐음

사용자가 "로컬에 있는 데이터는 실제 데이터가 아님"이라고 지적해 운영 DB 를 직접 확인했다.
**로컬 엑셀 자료는 실제의 일부이자 일부는 완전히 달랐다.**

### 접속 경로
DataGrip MCP 는 세션에 연결돼 있지 않아(레지스트리에도 없음) `pymysql` 로 **읽기 전용** 접속했다.
- `database.training-center.org:3306` (MySQL, EC2 43.200.187.253)
- 스키마: `auth`(9) / `common`(59) / `main`(5) / `personal`(13)
- 자격증명: `backend/scripts/run-local.jvm.local.sh` (gitignored). `source` 하면 끝줄의 `./gradlew bootRun` 이
  실행되므로 **export 줄만 파싱**해서 읽는다.

### 암호화
`common.activity` 의 `title` / `description` 은 AES 암호화 저장.
`core/utils/.../AESUtil.java` 와 동일하게 **AES/ECB/PKCS5Padding + MySQL 호환 키 폴딩**(키를 16바이트로 XOR 접기)
으로 복호화했다. 조회 범위는 상품 카탈로그(`common.activity` / `category` / `membership_plan`)로 한정했고,
`personal` · `auth` 스키마(개인정보)에는 접근하지 않았다.

### 실제와 로컬의 차이

| | 로컬 엑셀 | 운영 DB |
|---|---|---|
| 활동 그룹 | 6개 | **30개** (+ 공통 활동 1) |
| 세부 활동 | 44개 | **188개** (+ 공통 3) |
| 멤버십 | GUEST/BASIC/PREMIUM/CONTROLLER/SYSTEM HOLDER<br>₩9,900 / ₩19,900 | LVL.0(₩0, 7일) / LVL.1(₩4,512/월)<br>+ 평일반·주말반·주간반·야간반·오전반·오후반·일반·무반 (₩60,000~₩300,000/월) |

엑셀에만 있던 6개 그룹은 DB 에도 그대로 있었고(id 2~7), 나머지 24개 그룹(id 55~216)이 로컬에 없었다.
즉 엑셀은 **초기 버전에서 멈춘 자료**였다.

### 반영 결과
- `@variables/activities.ts` 를 DB 에서 **자동 생성**으로 전환 (손으로 고치지 않음)
- 공개 URL **21 → 45개**, 본문 총 **23,593자 → 54,075자**
- 활동 상세 페이지 6 → **30개** ← 롱테일 검색 유입이 5배로 늘어난다
- 공통 활동(기상 인사 / 취침 인사 / 감상평)을 `/guide` 에 단계로 추가

### 활동 데이터 재생성 절차
운영 DB 의 활동이 바뀌면 다시 생성해야 한다. `scratchpad` 의 `db.py` / `crypto.py` / `meta.py` 를
프로젝트 `scripts/` 로 옮겨 정식 스크립트화하는 것을 권장한다. (현재는 1회성 생성)
`meta.py` 의 slug 는 **URL 이므로 절대 바꾸지 말 것**. 새 그룹이 생기면 slug 만 추가한다.

### 멤버십 — LVL.0 / LVL.1 만 공개 (2026-09-14 사용자 확인)
활동과 연결된 플랜은 LVL.0 / LVL.1 뿐이다(`activity_membership_plans` 에 각 31개 그룹 매핑).
평일반·주말반·주간반·야간반·오전반·오후반·일반·무반 8개 플랜은 활동 매핑이 전혀 없는
**별개 상품군**이라 공개 멤버십 페이지에 싣지 않고 `/partnership` 문의로 넘겼다.

| 공개 표기 | DB 원본 |
|---|---|
| `LVL.0` — 무료 / 7일 | price 0, duration_in_days 7 |
| `LVL.1` — ₩4,512 / 월 | price 4512, duration_in_months 1 |

**등급명은 DB 값을 그대로 노출한다.** 처음에 '체험 / 정회원'으로 바꿔 놓았으나
사용자 확인 결과 원래 표기를 쓰기로 했다(2026-09-14). 플랫폼 화면과 등급명이 달라지면
이용자가 혼란스러워지므로 마케팅 표기로 바꾸지 말 것. 본문 카피의 등급 지칭도 전부 통일했다.

두 플랜의 활동 접근 범위는 동일하다(`membership_plan_features` 매핑 없음). 차이는 **기간뿐**이며,
멤버십 페이지 본문도 그렇게 정정했다. 엑셀 기반의 "기본/선택/특수 활동" 3단 구분은 근거가 없어 제거.

`@variables/membership.ts` 의 `code` 는 DB 원본 값이므로 바꾸지 말 것. 표기만 바꾸려면 `name` 을 수정한다.

### 표기명·가격 확정 (2026-09-14 사용자 확인)
- 등급명 `LVL.0` / `LVL.1` **그대로 노출**.
- **₩4,512/월** 이 실제 청구 금액으로 확정. 임시값 아님.

---

## 9. DataGrip MCP

세션에 연결돼 있지 않았고 커넥터 레지스트리에도 없어서, 이번 작업은 `pymysql` 읽기 전용 접속으로 진행했다.
사용자가 알려준 설정을 프로젝트 루트 `.mcp.json` 에 등록해 두었다.

```json
{ "mcpServers": { "datagrip": { "type": "http", "url": "http://127.0.0.1:64402/stream" } } }
```

엔드포인트는 검증됨 (`DataGrip MCP Server 2026.2.5`, protocol 2025-06-18).
새로 추가한 MCP 서버는 세션이 다시 읽어야 도구로 잡히므로, 다음 세션부터 사용 가능하다.


---

## 10. 콘텐츠 운영을 관리자 화면으로 이관

"공지·FAQ·활동 전부 너를 거쳐야 하냐"는 질문에서 출발했다. 답은 "그랬다"였고, 고쳤다.

### 관리 UI 를 새로 만들지 않은 이유
owner-frontend 의 게시판 화면(`src/pages/board/[key]/*`)이 **이미 카테고리마다 범용으로 동작**한다.
카테고리를 추가하고 `category_attribute` 로 필드를 구성하면 목록·작성·수정 화면이 그대로 생긴다.
입력 방식도 `text / textarea / editer(TipTap) / file / thumbnail / selectbox` 가 이미 지원된다.
→ 전용 관리 화면·테이블·CRUD API 를 새로 짜는 대신, 조회 전용 공개 API 하나만 추가했다.

### 만든 것

**백엔드** (`github/backend`)
- `apps/api/.../logics/common/PublicContentController.kt` — `/v1/public/{contents,content,activities,membership-plans}`
- `apps/api/.../logics/common/PublicContentService.kt` — 읽기 전용. 조회는 기존 `BoardRepository` 재사용
- `core/dto/.../response/PublicContentResponse.kt`, `PublicActivityResponse.kt`
- `BoardRepository.findByCategoryOrderByIdDesc` 추가
- `SecurityConfig.kt` + `AuthenticationFilter.kt` 양쪽에 `/v1/public` 허용

**운영 DB** (관리자 화면에서 직접 입력)
- 카테고리 3개: `publicnotice` / `publicfaq` / `publicstory` (public=true, dashboard=false)
- 속성 10개: 공지 3 · FAQ 2 · 후기 5

**owner-frontend** — 사이드바에 "공개 사이트" 그룹 (신규 페이지 없음)

**public-frontend**
- `scripts/fetch-content.mts` — 공개 API 수집 → 이미지 다운로드 → `src/@variables/generated/*.ts`
- `scripts/tiptap-html.mts` — TipTap JSON → HTML (허용 목록 방식)
- `src/@variables/activity-meta.ts`, `membership-meta.ts` — 저장소가 관리하는 편집 정보
- `build` = `fetch:content → vite build → prerender → sitemap`

### 설계 판단

**공개 게이트를 이중으로** — 키가 `public` 으로 시작 + `category_setting.public = true`.
기존 `notice` 카테고리에 `시크릿` 관련 글이 2건 섞여 있어 플래그만으로는 거를 수 없었다.

**정책 원문처럼 이미지도 복제하지 않으려 했으나** 불가능했다. `FileUrlSigner` 의 서명 URL 은
TTL 600초라(`application-fileupload.properties:18`) 프리렌더 HTML 에 구우면 10분 뒤 전부 깨진다.
→ 빌드 시점에 내려받아 `public/content/` 에 정적 자산으로 둔다. 공개 파일 서빙 엔드포인트를
새로 뚫지 않아도 되고 런타임 의존도 사라진다.

**작성자 정보 차단** — 기존 `BoardResponse` / `BoardListResponse` 는 `accountId` / `accountUsername` 를
담는다. 공개 응답은 별도 DTO 로 매핑해 계정 정보가 나가지 않게 했다.

**본문은 v-html 로 렌더된다** — 그래서 TipTap → HTML 변환을 `@tiptap/html` 대신 직접 만들었다.
텍스트는 전부 이스케이프하고, 내가 생성하는 태그만 나갈 수 있는 허용 목록 방식이다.
`javascript:` 스킴 링크는 링크로 만들지 않는다.

### 작업 중 막힌 것들

**카테고리 키에 하이픈 불가** — 관리자 화면의 키 입력이 영문자만 허용한다(`alphaValidator`).
`public-notice` 가 거부돼 `publicnotice` 로 바꿨고, 백엔드 접두사 상수도 `public` 으로 맞췄다.

**내장 브라우저가 native confirm() 을 차단** — 관리자 UI 의 모든 등록/수정이 "취소" 처리됐다.
콘솔에 `Page dialog suppressed (confirm)` 이 찍혀 원인을 찾았다.
해당 탭에서만 `window.confirm = () => true` 로 스텁 처리해 진행했다(권한 우회 아님, 인증은 그대로).

**접힌 아코디언과 같은 부류의 함정** — `IActivityGroup` 이 `IContentEntry` 를 상속하면서
본문 `html` 을 요구하게 됐다. 활동 그룹은 게시글이 아니라 카탈로그 항목이라
`Omit<IContentEntry, 'html'>` 으로 바꿨다.

**생성 파일 lint 오탐** — 후기가 0건일 때 `sonarjs/no-empty-collection` 이 에러를 냈다.
생성 산출물이라 `.eslintrc.cjs` 의 `ignorePatterns` 에서 제외했다.

### 검증한 것 / 못 한 것

✅ 백엔드 컴파일 · 카테고리/속성/공개플래그 DB 확인 · 프론트 typecheck · lint
✅ **로컬 스텁 API 로 전체 파이프라인 검증** — 운영 DB 의 실제 활동 30그룹/멤버십 2건과
   기존 공지의 실제 TipTap 본문을 스텁으로 서빙해 수집 → 빌드 → 프리렌더 43라우트 → 사이트맵 42URL.
   관리자 글이 정적 HTML 본문 792자로 굳는 것까지 확인했다.

❌ **실제 공개 API 는 아직 검증 못 함.** 백엔드가 미배포다.
   로컬 기동으로 확인하려 했으나 기본 프로파일의 JDBC URL 이 `localhost` 라 운영 DB 에 붙지 않고,
   운영 DB 를 가리키도록 오버라이드해 띄우는 것은 권한 정책상 차단됐다.
   → **백엔드 배포 후 아래를 반드시 확인할 것.**

### 배포 후 확인 목록
1. 토큰 없이 `GET /v1/public/activities` → 200, 30그룹
2. 토큰 없이 `GET /v1/public/contents?category=publicnotice` → 200
3. `category=notice` (접두사 없음) → 400 "공개 대상 카테고리가 아닙니다"
4. 토큰 없이 `GET /v1/board/getBoardList` → 여전히 401
5. 공개 응답 JSON 에 `account` / `username` 문자열이 없는지 grep
6. 관리자에서 `publicnotice` 에 글 작성 → `npm run build` → `dist/notice/<slug>/index.html` 생성 확인
