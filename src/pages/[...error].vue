<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.notFoundTitle'),
  description: t('page.notFoundDesc'),
  noindex: true,
})
</script>

<template>
  <VContainer class="py-16 text-center">
    <h1 class="text-h3 font-weight-bold mb-4">
      404
    </h1>

    <p class="text-body-1 mb-8">
      {{ $t('page.notFoundBody') }}
    </p>

    <VBtn to="/">
      {{ $t('page.backHome') }}
    </VBtn>
  </VContainer>
</template>
