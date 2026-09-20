<script setup lang="ts">
import { policyDocuments, siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('page.policyTitle'),
  description: t('page.policySeoDesc'),

  // 정책 원문은 policy.training-center.org 에 있다.
  // 이 페이지는 안내용 허브이므로 색인 대상에서 제외한다.
  noindex: true,
})
</script>

<template>
  <PageHeader
    eyebrow="Policy"
    :title="$t('page.policyTitle')"
    :lead="$t('page.policyLead')"
  />

  <VContainer class="pb-16">
    <VRow>
      <VCol
        v-for="policy in policyDocuments"
        :key="policy.titleKey"
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
                {{ $t(policy.titleKey) }}
              </h2>
            </div>

            <VIcon icon="tabler-external-link" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <p class="text-body-2 text-disabled mt-6 mb-0">
      {{ $t('page.policySource', { url: siteConfig.policyUrl }) }}
    </p>
  </VContainer>
</template>
