/**
 * 활동 그룹의 공개 사이트 메타.
 *
 * 활동의 **내용**은 운영 DB 가 원본이지만, URL(slug)·표기명·추천 대상은
 * 검색 노출을 위한 편집 정보라 저장소에서 관리한다.
 *
 * ⚠️ slug 는 공개 URL 이다. 한 번 색인된 뒤에 바꾸면 검색 순위가 초기화되므로 고정할 것.
 * ⚠️ 운영 DB 에 새 활동 그룹이 생기면 여기에 항목을 추가해야 한다.
 *    빠뜨리면 빌드가 실패한다(조용히 누락되면 페이지가 통째로 사라지기 때문).
 */
export interface IActivityMeta {
  slug: string

  /** 화면 표기명. DB 의 '건강/생활 습관' 같은 슬래시 표기를 다듬은 것. */
  category: string
  targets: string[]
}

export const activityMeta: Record<number, IActivityMeta> = {
  2: { slug: 'health-habits', category: '건강 · 생활 습관', targets: ['일반', '직장인', '대학'] },
  3: { slug: 'tidying-cleaning', category: '정리 · 청소', targets: ['일반', '학생', '자취'] },
  4: { slug: 'meal-cooking', category: '식사 · 요리', targets: ['일반', '자취', '직장인'] },
  5: { slug: 'learning-growth', category: '학습 · 자기계발', targets: ['학생', '대학', '직장인'] },
  6: { slug: 'social-connection', category: '사회적 활동', targets: ['일반', '학생', '직장인'] },
  7: { slug: 'emotional-care', category: '감성 · 정서 안정', targets: ['일반', '학생', '직장인'] },
  55: { slug: 'goal-projects', category: '목표 · 성과 프로젝트', targets: ['직장인', '대학', '창업'] },
  62: { slug: 'digital-ai', category: '디지털 · AI 활용 역량', targets: ['직장인', '대학', '학생'] },
  69: { slug: 'money-spending', category: '돈 · 소비 관리', targets: ['직장인', '대학', '자취'] },
  76: { slug: 'career-portfolio', category: '커리어 · 포트폴리오', targets: ['직장인', '대학', '이직준비'] },
  83: { slug: 'creation-content', category: '창작 · 콘텐츠 제작', targets: ['일반', '대학', '크리에이터'] },
  90: { slug: 'exploration', category: '탐방 · 경험 확장', targets: ['일반', '학생', '대학'] },
  97: { slug: 'sleep-recovery', category: '수면 · 회복 루틴', targets: ['직장인', '일반', '수험생'] },
  104: { slug: 'mindfulness', category: '마음챙김 · 스트레스 관리', targets: ['직장인', '일반', '학생'] },
  111: { slug: 'light-movement', category: '가벼운 운동 · 움직임', targets: ['일반', '직장인', '시니어'] },
  118: { slug: 'household', category: '집안일 · 생활 관리', targets: ['자취', '일반', '신혼'] },
  125: { slug: 'relationship', category: '관계 · 소통 훈련', targets: ['일반', '직장인', '학생'] },
  132: { slug: 'time-focus', category: '시간관리 · 집중력', targets: ['수험생', '직장인', '대학'] },
  139: { slug: 'reading-literacy', category: '독서 · 문해력', targets: ['학생', '대학', '일반'] },
  146: { slug: 'language-expression', category: '언어 · 표현 연습', targets: ['학생', '대학', '직장인'] },
  153: { slug: 'hobby-play', category: '창의 놀이 · 취미', targets: ['일반', '학생', '가족'] },
  160: { slug: 'eco-saving', category: '환경 · 절약 실천', targets: ['일반', '학생', '가족'] },
  167: { slug: 'local-outing', category: '동네 · 외출 미션', targets: ['일반', '학생', '가족'] },
  174: { slug: 'safety-hygiene', category: '안전 · 위생 습관', targets: ['일반', '가족', '자취'] },
  181: { slug: 'self-grooming', category: '자기관리 · 외모 정돈', targets: ['일반', '직장인', '대학'] },
  188: { slug: 'problem-solving', category: '문제해결 · 생활 개선', targets: ['일반', '직장인', '대학'] },
  195: { slug: 'digital-detox', category: '디지털 디톡스 · 미디어', targets: ['학생', '직장인', '일반'] },
  202: { slug: 'food-control', category: '음식 · 간식 조절', targets: ['일반', '직장인', '다이어트'] },
  209: { slug: 'study-work-prep', category: '학업 · 업무 준비', targets: ['수험생', '학생', '직장인'] },
  216: { slug: 'records-archive', category: '기록 · 아카이브', targets: ['일반', '직장인', '대학'] },
}

/**
 * 활동 그룹이 아니라 전 회원에게 자동 부여되는 공통 활동.
 * 이 id 는 페이지를 만들지 않고 /guide 에서만 소개한다.
 */
export const COMMON_ACTIVITY_GROUP_ID = 1
