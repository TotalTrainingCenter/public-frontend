<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { stories } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.storiesTitle'),
  description:
    t('page.storiesSeoDesc'),
})
</script>

<template>
  <PageHeader
    eyebrow="Stories"
    :title="$t('page.storiesTitle')"
    :lead="$t('page.storiesLead')"
  />

  <VContainer class="pb-16">
    <VList lines="two">
      <VListItem
        v-for="item in stories"
        :key="item.slug"
        :to="`/stories/${item.slug}`"
      >
        <VListItemTitle class="text-h6">
          {{ item.title }}
        </VListItemTitle>

        <VListItemSubtitle>
          {{ item.description }}
        </VListItemSubtitle>

        <template #append>
          <span class="text-disabled text-body-2">{{ item.date }}</span>
        </template>
      </VListItem>
    </VList>

    <!-- TODO: 페이지네이션 (목록이 20건 넘어가면 필수) -->
  </VContainer>
</template>
