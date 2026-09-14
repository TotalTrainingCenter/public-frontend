<script setup lang="ts">
import { stories } from '@variables/stories'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '활동 후기',
  description:
    '실제 참여자들의 루틴 인증 후기와 변화 기록을 모았습니다.',
})
</script>

<template>
  <PageHeader
    eyebrow="Stories"
    title="활동 후기"
    lead="먼저 시작한 분들의 기록입니다."
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
