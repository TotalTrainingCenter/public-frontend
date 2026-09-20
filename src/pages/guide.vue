<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { activityGroups, commonActivities } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

/** 가입부터 첫 인증까지의 실제 조작 순서. */
const steps = computed(() => ([
  { title: t('guide.step1Title'), body: t('guide.step1Body') },
  { title: t('guide.step2Title'), body: t('guide.step2Body') },
  { title: t('guide.step3Title'), body: t('guide.step3Body', { groups: activityGroups.value.length }) },
  { title: t('guide.step4Title'), body: t('guide.step4Body') },
  { title: t('guide.step5Title'), body: t('guide.step5Body', { list: commonActivities.value.map(item => item.name).join(', ') }) },
  { title: t('guide.step6Title'), body: t('guide.step6Body') },
  { title: t('guide.step7Title'), body: t('guide.step7Body') },
]))

useSeo({
  title: t('guide.title'),
  description: t('guide.seoDesc'),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': t('guide.howToName'),
    'description': t('guide.howToDesc'),
    'inLanguage': 'ko-KR',
    'step': steps.value.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.title,
      'text': step.body,
    })),
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Guide"
    :title="$t('guide.title')"
    :lead="$t('guide.lead')"
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <VTimeline
        side="end"
        align="start"
        truncate-line="both"
        density="compact"
      >
        <VTimelineItem
          v-for="(step, index) in steps"
          :key="step.title"
          dot-color="primary"
          size="x-small"
        >
          <h2 class="text-h6 mb-2">
            {{ index + 1 }}. {{ step.title }}
          </h2>

          <p class="text-body-2 mb-0">
            {{ step.body }}
          </p>
        </VTimelineItem>
      </VTimeline>

      <VAlert
        type="warning"
        variant="tonal"
        class="mt-10 mb-8"
      >
        <strong>{{ $t('guide.rejectStrong') }}</strong><br>
        {{ $t('guide.rejectBody') }}
      </VAlert>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          {{ $t('guide.platformCta') }}
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
