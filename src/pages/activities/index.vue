<script setup lang="ts">
import { activityGroups, totalActivityCount } from '@variables/activities'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '활동 주제',
  description:
    '건강·생활 습관, 정리·청소, 식사·요리, 학습·자기계발, 사회적 활동, 감성·정서 안정. '
    + `종합 훈련 센터에서 인증할 수 있는 ${totalActivityCount}개 활동을 주제별로 확인하세요.`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': '종합 훈련 센터 활동 주제',
    'numberOfItems': activityGroups.length,
    'itemListElement': activityGroups.map((group, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': group.title,
      'url': `${siteConfig.url}/activities/${group.slug}`,
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Activities"
    title="활동 주제"
    :lead="`${activityGroups.length}개 주제, ${totalActivityCount}개 활동. 관심 있는 것부터 고르면 됩니다.`"
  />

  <VContainer class="pb-16">
    <VRow>
      <VCol
        v-for="group in activityGroups"
        :key="group.slug"
        cols="12"
        md="6"
      >
        <VCard
          :to="`/activities/${group.slug}`"
          class="h-100"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-2 mb-3">
              <VChip
                size="small"
                variant="tonal"
                color="primary"
              >
                {{ group.category }}
              </VChip>

              <VChip
                size="small"
                variant="tonal"
              >
                활동 {{ group.items.length }}개
              </VChip>
            </div>

            <h2 class="text-h6 mb-2">
              {{ group.title }}
            </h2>

            <p class="text-body-2 mb-4">
              {{ group.description }}
            </p>

            <p class="text-body-2 text-disabled mb-0">
              추천 대상 · {{ group.targets.join(', ') }}
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VAlert
      type="info"
      variant="tonal"
      class="mt-8"
    >
      활동 주제는 계속 늘어납니다. 개인 활동뿐 아니라 기업·학교·공공기관 단위 운영도
      <RouterLink to="/partnership">
        제휴 문의
      </RouterLink>
      를 통해 협의할 수 있습니다.
    </VAlert>
  </VContainer>
</template>
