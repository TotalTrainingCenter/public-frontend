<script setup lang="ts">
import { policyDocuments, siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '약관 및 정책',
  description: '종합 훈련 센터의 이용약관, 개인정보처리방침, 운영정책 등 전체 정책 문서를 확인하실 수 있습니다.',

  // 정책 원문은 policy.training-center.org 에 있다.
  // 이 페이지는 안내용 허브이므로 색인 대상에서 제외한다.
  noindex: true,
})
</script>

<template>
  <PageHeader
    eyebrow="Policy"
    title="약관 및 정책"
    lead="서비스 이용에 적용되는 약관과 정책 원문입니다."
  />

  <VContainer class="pb-16">
    <VRow>
      <VCol
        v-for="policy in policyDocuments"
        :key="policy.title"
        cols="12"
        md="6"
      >
        <VCard
          :href="policy.href"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
        >
          <VCardText class="d-flex align-center gap-x-4">
            <VAvatar
              rounded
              variant="tonal"
              color="primary"
            >
              <VIcon icon="tabler-file-description" />
            </VAvatar>

            <div class="flex-grow-1">
              <h2 class="text-h6 mb-0">
                {{ policy.title }}
              </h2>
            </div>

            <VIcon icon="tabler-external-link" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <p class="text-body-2 text-disabled mt-6 mb-0">
      정책 원문은 {{ siteConfig.policyUrl }} 에서 관리됩니다.
    </p>
  </VContainer>
</template>
