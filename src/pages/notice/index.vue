<script setup lang="ts">
import { notices } from '@variables/notices'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '공지사항',
  description:
    '종합 훈련 센터의 서비스 공지와 운영 소식을 확인하세요.',
})
</script>

<template>
  <PageHeader
    eyebrow="Notice"
    title="공지사항"
    lead="서비스 운영과 관련된 소식을 전해드립니다."
  />

  <VContainer class="pb-16">
    <VList lines="two">
      <VListItem
        v-for="item in notices"
        :key="item.slug"
        :to="`/notice/${item.slug}`"
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
