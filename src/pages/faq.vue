<script setup lang="ts">
import { faqs } from '@variables/faqs'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '자주 묻는 질문',
  description:
    '이용 요금, 인증 방법, 하루 소요 시간, 단체 이용까지. 종합 훈련 센터 이용 중 '
    + '자주 묻는 질문을 모았습니다.',

  // FAQPage 스키마는 구글 검색결과에 질문이 펼쳐진 형태로 노출될 수 있다.
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'inLanguage': 'ko-KR',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="FAQ"
    title="자주 묻는 질문"
    lead="여기서 해결되지 않으면 언제든 문의해 주세요."
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <VExpansionPanels variant="accordion">
        <VExpansionPanel
          v-for="faq in faqs"
          :key="faq.question"
        >
          <VExpansionPanelTitle>
            <!-- 질문은 h2 로. 검색엔진이 질문 단위로 인식한다. -->
            <h2 class="text-body-1 font-weight-medium mb-0">
              {{ faq.question }}
            </h2>
          </VExpansionPanelTitle>

          <!-- ⚠️ eager 필수: 접힌 상태여도 DOM 에 렌더돼야 프리렌더 HTML 에 답변이 들어간다 -->
          <VExpansionPanelText eager>
            {{ faq.answer }}
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VCard
        variant="tonal"
        color="primary"
        class="mt-10"
      >
        <VCardText class="text-center py-8">
          <h2 class="text-h6 mb-4">
            찾는 답이 없으신가요?
          </h2>

          <VBtn :href="`mailto:${siteConfig.contact.email}`">
            {{ siteConfig.contact.email }}
          </VBtn>
        </VCardText>
      </VCard>
    </div>
  </VContainer>
</template>
