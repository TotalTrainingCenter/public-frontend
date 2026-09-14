<script setup lang="ts">
import { serviceSteps } from '@variables/features'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '주요 기능',
  description:
    '활동 주제 선택 → 수행 → 기록 → 인증 → 누적. 종합 훈련 센터의 다섯 단계 흐름과 '
    + '수행 직후 원본 인증 원칙을 단계별로 설명합니다.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': '종합 훈련 센터 이용 흐름',
    'inLanguage': 'ko-KR',
    'step': serviceSteps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.title,
      'text': step.summary,
      'url': `${siteConfig.url}/features#${step.anchor}`,
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Features"
    title="주요 기능"
    lead="활동 제시 → 수행 → 기록 → 인증 → 누적. 이 다섯 단계가 전부입니다."
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <section
        v-for="(step, index) in serviceSteps"
        :id="step.anchor"
        :key="step.anchor"
        class="mb-10"
      >
        <div class="d-flex align-center gap-x-3 mb-3">
          <VAvatar
            color="primary"
            size="36"
          >
            {{ index + 1 }}
          </VAvatar>

          <h2 class="text-h5 mb-0">
            {{ step.title }}
          </h2>
        </div>

        <p class="text-body-1 mb-0">
          {{ step.body }}
        </p>
      </section>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        단계별 화면과 실제 조작 순서는
        <RouterLink to="/guide">
          이용 가이드
        </RouterLink>
        에서 확인하실 수 있습니다.
      </VAlert>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          공식 플랫폼 바로가기
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
