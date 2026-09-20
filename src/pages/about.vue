<script setup lang="ts">
import { differentiators } from '@variables/features'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { activityGroups, totalActivityCount } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('about.title'),
  description: t('about.seoDesc'),
})
</script>

<template>
  <PageHeader
    eyebrow="About"
    :title="$t('about.title')"
    :lead="$t('about.lead')"
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <h2 class="text-h5 mb-3">
        {{ $t('about.whyHeading') }}
      </h2>

      <p class="text-body-1 mb-4">
        {{ $t('about.whyP1') }}
      </p>

      <p class="text-body-1 mb-8">
        {{ $t('about.whyP2') }}
      </p>

      <h2 class="text-h5 mb-3">
        {{ $t('about.whatHeading') }}
      </h2>

      <p class="text-body-1 mb-8">
        {{ $t('about.whatP1a') }}
        <strong>{{ $t('about.whatStrong') }}</strong>{{ $t('about.whatP1b') }}
        {{ $t('about.whatP1c', { groups: activityGroups.length, activities: totalActivityCount }) }}
      </p>

      <h2 class="text-h5 mb-3">
        {{ $t('about.diffHeading') }}
      </h2>

      <VCard
        v-for="item in differentiators"
        :key="item.titleKey"
        variant="outlined"
        class="mb-3"
      >
        <VCardText>
          <h3 class="text-h6 mb-2">
            {{ $t(item.titleKey) }}
          </h3>

          <p class="text-body-2 mb-0">
            {{ $t(item.bodyKey) }}
          </p>
        </VCardText>
      </VCard>

      <h2 class="text-h5 mt-10 mb-3">
        {{ $t('about.goalHeading') }}
      </h2>

      <p class="text-body-1 mb-4">
        {{ $t('about.goalP1') }}
      </p>

      <p class="text-body-1 mb-8">
        {{ $t('about.goalP2') }}
      </p>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        <RouterLink to="/features">
          {{ $t('nav.features') }}
        </RouterLink>
        {{ $t('about.linkPre') }}
        <RouterLink to="/activities">
          {{ $t('nav.activityTopics') }}
        </RouterLink>
        {{ $t('about.linkPost') }}
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
