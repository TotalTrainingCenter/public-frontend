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

  /**
   * 화면 표기명. DB 의 '건강/생활 습관' 같은 슬래시 표기를 다듬은 것.
   *
   * ⚠️ 로케일별로 들고 있어야 한다. fetch-content.mts 가 이 값으로 제목·설명 문장을
   *    조립하기 때문에, 한국어 하나만 두면 ja/en 생성 파일에도 한국어가 구워진다.
   */
  category: Record<'ko' | 'ja' | 'en', string>

  /** 추천 대상. 한국어 라벨을 키로 쓰고 [TARGET_LABELS] 로 로케일 표기를 찾는다. */
  targets: string[]
}

export const activityMeta: Record<number, IActivityMeta> = {
  2: { slug: 'health-habits', category: { ko: '건강 · 생활 습관', ja: '健康・生活習慣', en: 'Health & daily habits' }, targets: ['일반', '직장인', '대학'] },
  3: { slug: 'tidying-cleaning', category: { ko: '정리 · 청소', ja: '整理・掃除', en: 'Tidying & cleaning' }, targets: ['일반', '학생', '자취'] },
  4: { slug: 'meal-cooking', category: { ko: '식사 · 요리', ja: '食事・料理', en: 'Meals & cooking' }, targets: ['일반', '자취', '직장인'] },
  5: { slug: 'learning-growth', category: { ko: '학습 · 자기계발', ja: '学習・自己啓発', en: 'Learning & growth' }, targets: ['학생', '대학', '직장인'] },
  6: { slug: 'social-connection', category: { ko: '사회적 활동', ja: '社会的活動', en: 'Social activity' }, targets: ['일반', '학생', '직장인'] },
  7: { slug: 'emotional-care', category: { ko: '감성 · 정서 안정', ja: '感性・情緒の安定', en: 'Emotional wellbeing' }, targets: ['일반', '학생', '직장인'] },
  55: { slug: 'goal-projects', category: { ko: '목표 · 성과 프로젝트', ja: '目標・成果プロジェクト', en: 'Goals & projects' }, targets: ['직장인', '대학', '창업'] },
  62: { slug: 'digital-ai', category: { ko: '디지털 · AI 활용 역량', ja: 'デジタル・AI活用スキル', en: 'Digital & AI skills' }, targets: ['직장인', '대학', '학생'] },
  69: { slug: 'money-spending', category: { ko: '돈 · 소비 관리', ja: 'お金・支出の管理', en: 'Money & spending' }, targets: ['직장인', '대학', '자취'] },
  76: { slug: 'career-portfolio', category: { ko: '커리어 · 포트폴리오', ja: 'キャリア・ポートフォリオ', en: 'Career & portfolio' }, targets: ['직장인', '대학', '이직준비'] },
  83: { slug: 'creation-content', category: { ko: '창작 · 콘텐츠 제작', ja: '創作・コンテンツ制作', en: 'Creating & content' }, targets: ['일반', '대학', '크리에이터'] },
  90: { slug: 'exploration', category: { ko: '탐방 · 경험 확장', ja: '探訪・経験を広げる', en: 'Exploring & new experiences' }, targets: ['일반', '학생', '대학'] },
  97: { slug: 'sleep-recovery', category: { ko: '수면 · 회복 루틴', ja: '睡眠・回復ルーティン', en: 'Sleep & recovery' }, targets: ['직장인', '일반', '수험생'] },
  104: { slug: 'mindfulness', category: { ko: '마음챙김 · 스트레스 관리', ja: 'マインドフルネス・ストレス管理', en: 'Mindfulness & stress' }, targets: ['직장인', '일반', '학생'] },
  111: { slug: 'light-movement', category: { ko: '가벼운 운동 · 움직임', ja: '軽い運動・体を動かす', en: 'Light movement' }, targets: ['일반', '직장인', '시니어'] },
  118: { slug: 'household', category: { ko: '집안일 · 생활 관리', ja: '家事・暮らしの管理', en: 'Housework & home life' }, targets: ['자취', '일반', '신혼'] },
  125: { slug: 'relationship', category: { ko: '관계 · 소통 훈련', ja: '人間関係・コミュニケーション', en: 'Relationships & communication' }, targets: ['일반', '직장인', '학생'] },
  132: { slug: 'time-focus', category: { ko: '시간관리 · 집중력', ja: '時間管理・集中力', en: 'Time & focus' }, targets: ['수험생', '직장인', '대학'] },
  139: { slug: 'reading-literacy', category: { ko: '독서 · 문해력', ja: '読書・読解力', en: 'Reading & literacy' }, targets: ['학생', '대학', '일반'] },
  146: { slug: 'language-expression', category: { ko: '언어 · 표현 연습', ja: '言語・表現の練習', en: 'Language & expression' }, targets: ['학생', '대학', '직장인'] },
  153: { slug: 'hobby-play', category: { ko: '창의 놀이 · 취미', ja: '創造的な遊び・趣味', en: 'Creative play & hobbies' }, targets: ['일반', '학생', '가족'] },
  160: { slug: 'eco-saving', category: { ko: '환경 · 절약 실천', ja: '環境・節約の実践', en: 'Environment & saving' }, targets: ['일반', '학생', '가족'] },
  167: { slug: 'local-outing', category: { ko: '동네 · 외출 미션', ja: 'まち・おでかけミッション', en: 'Neighbourhood & outings' }, targets: ['일반', '학생', '가족'] },
  174: { slug: 'safety-hygiene', category: { ko: '안전 · 위생 습관', ja: '安全・衛生の習慣', en: 'Safety & hygiene' }, targets: ['일반', '가족', '자취'] },
  181: { slug: 'self-grooming', category: { ko: '자기관리 · 외모 정돈', ja: 'セルフケア・身だしなみ', en: 'Self-care & grooming' }, targets: ['일반', '직장인', '대학'] },
  188: { slug: 'problem-solving', category: { ko: '문제해결 · 생활 개선', ja: '問題解決・暮らしの改善', en: 'Problem solving' }, targets: ['일반', '직장인', '대학'] },
  195: { slug: 'digital-detox', category: { ko: '디지털 디톡스 · 미디어', ja: 'デジタルデトックス・メディア', en: 'Digital detox & media' }, targets: ['학생', '직장인', '일반'] },
  202: { slug: 'food-control', category: { ko: '음식 · 간식 조절', ja: '食事・間食のコントロール', en: 'Food & snacking' }, targets: ['일반', '직장인', '다이어트'] },
  209: { slug: 'study-work-prep', category: { ko: '학업 · 업무 준비', ja: '学業・業務の準備', en: 'Study & work prep' }, targets: ['수험생', '학생', '직장인'] },
  216: { slug: 'records-archive', category: { ko: '기록 · 아카이브', ja: '記録・アーカイブ', en: 'Records & archive' }, targets: ['일반', '직장인', '대학'] },
}

/**
 * 활동 그룹이 아니라 전 회원에게 자동 부여되는 공통 활동.
 * 이 id 는 페이지를 만들지 않고 /guide 에서만 소개한다.
 */
export const COMMON_ACTIVITY_GROUP_ID = 1

/**
 * 추천 대상 라벨의 로케일 표기.
 *
 * activityMeta.targets 는 한국어 라벨을 키로 들고 있고, 화면·생성 스크립트가
 * 여기서 표기를 찾는다. 새 대상을 추가하면 여기에도 반드시 추가할 것 —
 * 없으면 그 라벨만 한국어로 남는다.
 */
export const TARGET_LABELS: Record<string, Record<'ko' | 'ja' | 'en', string>> = {
  일반: { ko: '일반', ja: '一般', en: 'General' },
  직장인: { ko: '직장인', ja: '社会人', en: 'Workers' },
  대학: { ko: '대학', ja: '大学生', en: 'University' },
  학생: { ko: '학생', ja: '学生', en: 'Students' },
  자취: { ko: '자취', ja: '一人暮らし', en: 'Living alone' },
  창업: { ko: '창업', ja: '起業', en: 'Founders' },
  이직준비: { ko: '이직준비', ja: '転職準備', en: 'Job switchers' },
  크리에이터: { ko: '크리에이터', ja: 'クリエイター', en: 'Creators' },
  수험생: { ko: '수험생', ja: '受験生', en: 'Exam takers' },
  시니어: { ko: '시니어', ja: 'シニア', en: 'Seniors' },
  신혼: { ko: '신혼', ja: '新婚', en: 'Newlyweds' },
  가족: { ko: '가족', ja: '家族', en: 'Families' },
  다이어트: { ko: '다이어트', ja: 'ダイエット', en: 'Dieting' },
}
