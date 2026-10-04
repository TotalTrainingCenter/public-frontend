<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { membershipPlans } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

useSeo({
  title: t('member.title'),
  description: t('member.seoDesc'),
})
</script>

<template>
  <PageHeader
    eyebrow="Membership"
    :title="$t('member.title')"
    :lead="$t('member.lead')"
  />

  <VContainer class="pb-16">
    <VRow>
      <VCol
        v-for="plan in membershipPlans"
        :key="plan.code"
        cols="12"
        md="4"
      >
        <VCard
          :variant="plan.recommended ? 'elevated' : 'outlined'"
          :color="plan.recommended ? 'primary' : undefined"
          class="h-100"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-2 mb-2">
              <h2 class="text-h6 mb-0">
                {{ plan.name }}
              </h2>

              <VChip
                v-if="plan.recommended"
                size="x-small"
                color="surface"
                class="text-primary"
              >
                {{ $t('member.recommended') }}
              </VChip>
            </div>

            <div class="d-flex align-baseline gap-x-1 mb-2">
              <span class="text-h5 font-weight-bold">{{ plan.price }}</span>
              <span class="text-body-2">/ {{ plan.period }}</span>
            </div>

            <p class="text-body-2 mb-4">
              {{ plan.summary }}
            </p>

            <VList
              density="compact"
              :bg-color="plan.recommended ? 'primary' : undefined"
            >
              <VListItem
                v-for="feature in plan.features"
                :key="feature.labelKey"
                :title="$t(feature.labelKey, feature.labelParams ?? {})"
              >
                <template #prepend>
                  <VIcon
                    :icon="feature.available ? 'tabler-check' : 'tabler-x'"
                    size="18"
                    class="me-2"
                  />
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <div
      class="mx-auto mt-12"
      style="max-inline-size: 46rem;"
    >
      <h2 class="text-h5 mb-3">
        {{ $t('member.diffHeading') }}
      </h2>

      <p class="text-body-1 mb-2">
        <strong>{{ $t('member.diffSameStrong') }}</strong>
        {{ $t('member.diffSameRest') }}
      </p>

      <p class="text-body-1 mb-8">
        {{ $t('member.diffPeriodPre') }} <strong>{{ $t('member.diffPeriodStrong') }}</strong>{{ $t('member.diffPeriodRest') }}
      </p>

      <h2 class="text-h5 mb-3">
        {{ $t('member.kindsHeading') }}
      </h2>

      <p class="text-body-1 mb-2">
        <strong>{{ $t('member.kindsCoreStrong') }}</strong>{{ $t('member.kindsCoreRest') }}
      </p>

      <p class="text-body-1 mb-2">
        <strong>{{ $t('member.kindsOptStrong') }}</strong>{{ $t('member.kindsOptRest') }}
      </p>

      <p class="text-body-1 mb-8">
        {{ $t('member.kindsCommonPre') }} <strong>{{ $t('member.kindsCommonStrong') }}</strong>{{ $t('member.kindsCommonRest') }}
      </p>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        {{ $t('member.groupNote') }}
        <RouterLink to="/partnership">
          {{ $t('nav.partnership') }}
        </RouterLink>
        {{ $t('member.groupNotePost') }}
      </VAlert>

      <p class="text-body-2 text-disabled mb-8">
        {{ $t('member.refundNote') }}
        {{ $t('member.refundPre') }}
        <RouterLink to="/policy">
          {{ $t('page.policyTitle') }}
        </RouterLink>
        {{ $t('member.refundPost') }}
      </p>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          {{ $t('landing.pricingCta') }}
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
