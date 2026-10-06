<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

const cases = computed(() => ([
  { icon: 'tabler-building-skyscraper', title: t('partner.caseCompanyTitle'), body: t('partner.caseCompanyBody') },
  { icon: 'tabler-school', title: t('partner.caseSchoolTitle'), body: t('partner.caseSchoolBody') },
  { icon: 'tabler-building-community', title: t('partner.casePublicTitle'), body: t('partner.casePublicBody') },
]))

useSeo({
  title: t('partner.title'),
  description: t('partner.seoDesc'),
})
</script>

<template>
  <PageHeader
    eyebrow="Partnership"
    :title="$t('partner.title')"
    :lead="$t('partner.lead')"
  />

  <VContainer class="pb-16">
    <VRow class="mb-8">
      <VCol
        v-for="item in cases"
        :key="item.title"
        cols="12"
        md="4"
      >
        <VCard
          variant="outlined"
          class="h-100"
        >
          <VCardText>
            <VAvatar
              rounded
              variant="tonal"
              color="primary"
              class="mb-4"
            >
              <VIcon :icon="item.icon" />
            </VAvatar>

            <h2 class="text-h6 mb-2">
              {{ item.title }}
            </h2>

            <p class="text-body-2 mb-0">
              {{ item.body }}
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <h2 class="text-h5 mb-3">
        {{ $t('partner.askHeading') }}
      </h2>

      <VList class="mb-8">
        <VListItem :title="$t('landing.contactItem1')" />
        <VListItem :title="$t('landing.contactItem2')" />
        <VListItem :title="$t('landing.contactItem3')" />
        <VListItem :title="$t('landing.contactItem4')" />
      </VList>

      <!-- 비회원 문의 폼. 개인정보 수집·이용 동의는 폼 안에 있다(필수). -->
      <GuestInquiryForm category="PARTNERSHIP" />

      <p class="text-body-2 text-medium-emphasis text-center mt-6 mb-0">
        {{ $t('partner.replyNote') }}
        {{ $t('guestInquiry.orMail') }}
        <a :href="`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent($t('landing.contactMailSubject'))}`">{{ siteConfig.contact.email }}</a>
      </p>
    </div>
  </VContainer>
</template>
