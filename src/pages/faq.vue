<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { faqs } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.faqTitle'),
  description: t('page.faqSeoDesc'),

  // FAQPage 스키마는 구글 검색결과에 질문이 펼쳐진 형태로 노출될 수 있다.
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'inLanguage': 'ko-KR',
    'mainEntity': faqs.value.map(faq => ({
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
    :title="$t('page.faqTitle')"
    :lead="$t('page.faqLead')"
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
          <h2 class="text-h6 mb-2">
            {{ $t('page.faqNoAnswer') }}
          </h2>

          <p class="text-body-2 mb-0">
            {{ $t('guestInquiry.orMail') }}
            <a :href="`mailto:${siteConfig.contact.email}`">{{ siteConfig.contact.email }}</a>
          </p>
        </VCardText>
      </VCard>

      <GuestInquiryForm
        category="USAGE"
        class="mt-6"
      />
    </div>
  </VContainer>
</template>
