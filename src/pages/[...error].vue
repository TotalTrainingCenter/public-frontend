<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지가 존재하지 않습니다.',
  noindex: true,
})
</script>

<template>
  <VContainer class="py-16 text-center">
    <h1 class="text-h3 font-weight-bold mb-4">
      404
    </h1>

    <p class="text-body-1 mb-8">
      요청하신 페이지를 찾을 수 없습니다.
    </p>

    <VBtn to="/">
      홈으로 돌아가기
    </VBtn>
  </VContainer>
</template>
