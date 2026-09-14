<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

// 👉 사업자 정보 (여기 값만 실제 정보로 바꾸면 됩니다)
const businessInfo = {
  companyName: '종합 훈련 센터 (Total Training Center)',
  ceo: '김태민',
  regNo: '684-17-02954',
  mailOrderNo: '제0000-지역0000-00000호',
  address: '부산광역시 해운대구 재반로30번길 135, 1동 605호(재송동, 센텀안성타워)',
  tel: '010-3980-2818',
  email: 'help@training-center.org',
  privacyOfficer: '김태민',
}

const isOpen = ref(false)

// 사업자등록번호는 하이픈 제거 후 조회
const ftcUrl = computed(
  () => `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${businessInfo.regNo.replaceAll('-', '')}`,
)

const rows = computed(() => [
  { icon: 'tabler-building-store', label: '상호명', value: businessInfo.companyName },
  { icon: 'tabler-user', label: '대표자', value: businessInfo.ceo },
  { icon: 'tabler-id-badge-2', label: '사업자등록번호', value: businessInfo.regNo },

  // { icon: 'tabler-certificate', label: '통신판매업 신고번호', value: businessInfo.mailOrderNo },
  { icon: 'tabler-map-pin', label: '사업장 주소', value: businessInfo.address },
  { icon: 'tabler-phone', label: '대표 전화', value: businessInfo.tel },
  { icon: 'tabler-mail', label: '이메일', value: businessInfo.email },
  { icon: 'tabler-shield-lock', label: '개인정보관리책임자', value: businessInfo.privacyOfficer },
])

const copiedLabel = ref<string | null>(null)

const copy = async (row: { label: string; value: string }) => {
  try {
    await navigator.clipboard.writeText(row.value)
    copiedLabel.value = row.label
    setTimeout(() => {
      if (copiedLabel.value === row.label)
        copiedLabel.value = null
    }, 1500)
  }
  catch {
    // 클립보드 권한이 없으면 조용히 무시
  }
}

// ESC 로 닫기
onKeyStroke('Escape', () => {
  if (isOpen.value)
    isOpen.value = false
})
</script>

<template>
  <div class="business-info-widget d-print-none">
    <!-- 👉 확장 패널 -->
    <Transition name="business-info-panel">
      <VCard
        v-show="isOpen"
        class="business-info-widget__panel"
        elevation="10"
      >
        <div class="business-info-widget__header d-flex align-center justify-space-between pa-4">
          <div class="d-flex flex-column">
            <span class="text-body-2 font-weight-medium text-white">
              사업자 정보
            </span>
            <span class="text-caption text-white opacity-75">
              {{ businessInfo.companyName }}
            </span>
          </div>
          <VBtn
            icon="tabler-x"
            variant="text"
            color="white"
            size="small"
            aria-label="사업자 정보 닫기"
            @click="isOpen = false"
          />
        </div>

        <VDivider />

        <PerfectScrollbar
          :options="{ wheelPropagation: false }"
          class="business-info-widget__body"
        >
          <VList
            density="compact"
            class="py-1"
          >
            <VListItem
              v-for="row in rows"
              :key="row.label"
              class="px-4"
            >
              <template #prepend>
                <VIcon
                  :icon="row.icon"
                  size="18"
                  class="me-3 text-medium-emphasis"
                />
              </template>

              <div class="text-caption text-medium-emphasis">
                {{ row.label }}
              </div>
              <div class="text-body-2 text-high-emphasis">
                {{ row.value }}
              </div>

              <template #append>
                <VBtn
                  :icon="copiedLabel === row.label ? 'tabler-check' : 'tabler-copy'"
                  :color="copiedLabel === row.label ? 'success' : undefined"
                  variant="text"
                  size="x-small"
                  :aria-label="`${row.label} 복사`"
                  @click="copy(row)"
                />
              </template>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <div class="pa-3">
          <VBtn
            block
            size="small"
            variant="tonal"
            prepend-icon="tabler-external-link"
            :href="ftcUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            사업자등록정보 조회
          </VBtn>
        </div>
      </VCard>
    </Transition>

    <!-- 👉 런처 버튼 -->
    <VBtn
      icon
      color="primary"
      density="comfortable"
      elevation="6"
      class="business-info-widget__launcher"
      :aria-expanded="isOpen"
      aria-label="사업자 정보 보기"
      @click="isOpen = !isOpen"
    >
      <VIcon
        size="22"
        :icon="isOpen ? 'tabler-chevron-down' : 'tabler-building-store'"
      />
      <VTooltip
        v-if="!isOpen"
        activator="parent"
        location="left"
      >
        사업자 정보
      </VTooltip>
    </VBtn>
  </div>
</template>

<style lang="scss">
.business-info-widget {
  position: fixed;

  // ℹ️ 세로 내비게이션(1003) / 오버레이(1002) 위로 올라오도록. 단, 다이얼로그(2400)보다는 아래
  z-index: 1005;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;

  &__panel {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    border-radius: 0.75rem;
    inline-size: 20rem;
    max-inline-size: calc(100vw - 3rem);
    transform-origin: bottom right;
  }

  &__header {
    background-color: rgb(var(--v-theme-primary));
  }

  &__body {
    max-block-size: min(24rem, 50vh);
  }

  &__launcher {
    align-self: flex-end;
  }
}

// 채널톡 느낌의 확장/축소 모션
.business-info-panel-enter-active,
.business-info-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.24s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.business-info-panel-enter-from,
.business-info-panel-leave-to {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.9);
}
</style>
