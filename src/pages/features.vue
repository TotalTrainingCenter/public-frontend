<script setup lang="ts">
import { serviceSteps } from '@variables/features'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.featuresTitle'),
  description: t('page.featuresSeoDesc'),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': t('page.featuresFlowName'),
    'inLanguage': 'ko-KR',
    'step': serviceSteps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': t(step.titleKey),
      'text': t(step.summaryKey),
      'url': `${siteConfig.url}/features#${step.anchor}`,
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Features"
    :title="$t('page.featuresTitle')"
    :lead="$t('page.featuresLead')"
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
            {{ $t(step.titleKey) }}
          </h2>
        </div>

        <p class="text-body-1 mb-0">
          {{ $t(step.bodyKey) }}
        </p>
      </section>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        {{ $t('page.featuresGuidePre') }}
        <RouterLink to="/guide">
          {{ $t('nav.guide') }}
        </RouterLink>
        {{ $t('page.featuresGuidePost') }}
      </VAlert>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          {{ $t('cta.platform') }}
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
