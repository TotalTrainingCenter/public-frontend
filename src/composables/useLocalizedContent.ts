import type { ComputedRef } from 'vue'
import type { IPublicActivityGroup, IPublicActivityItem } from '@entity/PublicActivity'
import type { INotice, IStory } from '@entity/ContentEntry'
import type { IFaq } from '@variables/generated/ko/faqs'
import type { IPublicMembershipPlan } from '@entity/PublicMembershipPlan'
import { activityGroupsByLocale, commonActivitiesByLocale } from '@variables/generated/activities'
import { faqsByLocale } from '@variables/generated/faqs'
import { membershipPlansByLocale } from '@variables/generated/membership'
import { noticesByLocale } from '@variables/generated/notices'
import { storiesByLocale } from '@variables/generated/stories'

/**
 * 생성 콘텐츠(활동·FAQ·공지·후기·멤버십)를 현재 언어로 돌려준다.
 *
 * ══════════════════════════════════════════════════════════════
 *  왜 이 컴포저블이 필요한가
 *
 *  `@variables/activities` 같은 경로를 그냥 임포트하면 **항상 한국어**가 나온다.
 *  생성 배럴의 기본 export 가 ko 를 가리키기 때문이다. 그건 실수가 아니라
 *  `scripts/routes.mts` 가 Node 에서 사이트맵을 만들 때 쓰라고 남겨 둔 것이다.
 *  Node 에는 vue-i18n 도 쿠키도 없어서 '현재 언어'라는 개념 자체가 없다.
 *
 *  그래서 **화면은 반드시 이 컴포저블을 거친다.** 직접 임포트하면
 *  UI 는 영어인데 콘텐츠만 한국어로 나오는 상태가 조용히 만들어진다.
 * ══════════════════════════════════════════════════════════════
 *
 * ⚠️ 번역이 없는 로케일은 수집 시점에 원문(한국어)이 그대로 구워진다.
 *    따라서 여기서 빈 값이 나올 일은 없다. 폴백은 안전장치일 뿐이다.
 */
export interface LocalizedContent {
  activityGroups: ComputedRef<IPublicActivityGroup[]>
  commonActivities: ComputedRef<IPublicActivityItem[]>
  totalActivityCount: ComputedRef<number>
  findActivityGroup: (slug: string) => IPublicActivityGroup | undefined
  faqs: ComputedRef<IFaq[]>
  notices: ComputedRef<INotice[]>
  findNotice: (slug: string) => INotice | undefined
  stories: ComputedRef<IStory[]>
  findStory: (slug: string) => IStory | undefined
  membershipPlans: ComputedRef<IPublicMembershipPlan[]>
}

export const useLocalizedContent = (): LocalizedContent => {
  const { locale } = useI18n()

  const pick = <T>(byLocale: Record<string, T>): ComputedRef<T> =>
    computed(() => byLocale[locale.value] ?? byLocale.ko)

  const activityGroups = pick(activityGroupsByLocale) as ComputedRef<IPublicActivityGroup[]>
  const commonActivities = pick(commonActivitiesByLocale) as ComputedRef<IPublicActivityItem[]>
  const faqs = pick(faqsByLocale) as ComputedRef<IFaq[]>
  const notices = pick(noticesByLocale) as ComputedRef<INotice[]>
  const stories = pick(storiesByLocale) as ComputedRef<IStory[]>
  const membershipPlans = pick(membershipPlansByLocale) as ComputedRef<IPublicMembershipPlan[]>

  return {
    activityGroups,
    commonActivities,

    // 생성 파일의 파생 export 와 같은 계산. 로케일이 바뀌면 함께 다시 계산된다.
    totalActivityCount: computed(() =>
      activityGroups.value.reduce((sum, group) => sum + group.items.length, 0)),

    /*
     * ⚠️ 슬러그는 언어와 무관하게 같다. (백엔드가 slug 를 번역하지 않는다)
     *    그래서 로케일이 바뀌어도 같은 URL 로 같은 글을 찾는다.
     */
    findActivityGroup: (slug: string) => activityGroups.value.find(group => group.slug === slug),

    faqs,
    notices,
    findNotice: (slug: string) => notices.value.find(item => item.slug === slug),
    stories,
    findStory: (slug: string) => stories.value.find(item => item.slug === slug),
    membershipPlans,
  }
}
