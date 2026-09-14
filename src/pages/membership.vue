<script setup lang="ts">
import { membershipPlans } from '@variables/membership'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

useSeo({
  title: '멤버십 안내',
  description:
    'LVL.0 은 7일 무료, LVL.1 은 월 4,512원. '
    + '종합 훈련 센터의 참여 등급과 등급별 이용 범위를 안내합니다.',
})
</script>

<template>
  <PageHeader
    eyebrow="Membership"
    title="멤버십 안내"
    lead="첫 일주일은 무료입니다. 해보고 결정하세요."
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
                추천
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
                :key="feature.label"
                :title="feature.label"
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
        두 등급의 차이가 무엇인가요?
      </h2>

      <p class="text-body-1 mb-2">
        <strong>이용할 수 있는 활동은 같습니다.</strong>
        LVL.0 등급에서도 활동 주제 전체를 열람하고 인증할 수 있습니다.
      </p>

      <p class="text-body-1 mb-8">
        차이는 <strong>기간</strong>입니다. LVL.0 은 7일 동안만 이용할 수 있고,
        LVL.1 은 기간 제한 없이 기록을 계속 쌓아갈 수 있습니다.
        먼저 7일 해보시고, 이어갈 만하다 싶으면 그때 LVL.1 로 전환하시면 됩니다.
      </p>

      <h2 class="text-h5 mb-3">
        기본 활동과 선택 활동
      </h2>

      <p class="text-body-1 mb-2">
        <strong>기본 활동</strong>은 주제를 선택하면 먼저 주어지는 활동입니다.
      </p>

      <p class="text-body-1 mb-2">
        <strong>선택 활동</strong>은 같은 주제 안에서 원하는 만큼 추가할 수 있는 활동입니다.
      </p>

      <p class="text-body-1 mb-8">
        이와 별개로 <strong>공통 활동</strong>(기상 인사, 취침 인사, 감상평)이 있으며
        회원 등록 시 자동으로 주어집니다.
      </p>

      <VAlert
        type="info"
        variant="tonal"
        class="mb-8"
      >
        기업·학교·공공기관 등 단체 단위 운영 등급은 개별 협의가 필요합니다.
        <RouterLink to="/partnership">
          제휴 문의
        </RouterLink>
        로 연락 주시면 안내드립니다.
      </VAlert>

      <p class="text-body-2 text-disabled mb-8">
        결제·환불 조건은 유료서비스 및 환불정책을 따릅니다.
        자세한 내용은
        <RouterLink to="/policy">
          약관 및 정책
        </RouterLink>
        에서 확인하실 수 있습니다.
      </p>

      <div class="text-center">
        <VBtn
          :href="siteConfig.platformUrl"
          size="large"
        >
          가입하고 시작하기
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>
