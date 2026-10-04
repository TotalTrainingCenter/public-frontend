<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { stories } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

/*
 * 후기가 하나도 없으면 제목만 있는 빈 페이지다. 얇은 페이지로 색인되지 않게 막고,
 * 사이트맵에서도 뺀다(scripts/routes.mts). 첫 후기가 올라오면 다음 빌드에서 자동으로 풀린다.
 */
useSeo({
  title: t('page.storiesTitle'),
  description:
    t('page.storiesSeoDesc'),
  noindex: stories.value.length === 0,
})
</script>

<template>
  <PageHeader
    eyebrow="Stories"
    :title="$t('page.storiesTitle')"
    :lead="$t('page.storiesLead')"
  />

  <VContainer class="pb-16">
    <p
      v-if="!stories.length"
      class="text-body-1 text-medium-emphasis text-center py-12"
    >
      {{ $t('page.storiesEmpty') }}
    </p>

    <VList
      v-else
      lines="two"
    >
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
