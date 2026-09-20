<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { activityGroups, totalActivityCount } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.activitiesTitle'),
  description: t('page.activitiesSeoDesc', { n: totalActivityCount.value }),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': t('page.activitiesJsonName'),
    'numberOfItems': activityGroups.value.length,
    'itemListElement': activityGroups.value.map((group, index) => ({
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
    :title="$t('page.activitiesTitle')"
    :lead="$t('page.activitiesLead', { groups: activityGroups.length, activities: totalActivityCount })"
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
                {{ $t('landing.activitiesCount', { n: group.items.length }) }}
              </VChip>
            </div>

            <h2 class="text-h6 mb-2">
              {{ group.title }}
            </h2>

            <p class="text-body-2 mb-4">
              {{ group.description }}
            </p>

            <p class="text-body-2 text-disabled mb-0">
              {{ $t('page.activitiesTargets', { list: group.targets.join(', ') }) }}
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
      {{ $t('page.activitiesMorePre') }}
      <RouterLink to="/partnership">
        {{ $t('nav.partnership') }}
      </RouterLink>
      {{ $t('page.activitiesMorePost') }}
    </VAlert>
  </VContainer>
</template>
