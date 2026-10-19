<script setup lang="ts">
const platforms = [
  { key: 'mac', icon: 'tabler-device-laptop', titleKey: 'download.macTitle', statusKey: 'download.available', ready: true },
  { key: 'ios', icon: 'tabler-brand-apple', titleKey: 'download.iosTitle', statusKey: 'download.preparing', ready: false },
  { key: 'android', icon: 'tabler-brand-android', titleKey: 'download.androidTitle', statusKey: 'download.preparing', ready: false },
]
</script>

<template>
  <!-- 홈의 앱 안내. 자세한 내용(설치 방법·확인값)은 /download 에서 본다. -->
  <section
    id="download"
    class="download-section"
  >
    <VContainer>
      <div class="text-center">
        <VChip
          label
          color="primary"
          size="small"
          class="mb-4"
        >
          Download
        </VChip>

        <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              {{ $t('landing.downloadHeadingA') }}
            </div>
          </div>
          {{ $t('landing.downloadHeadingB') }}
        </h2>

        <p class="text-body-1 mb-6">
          {{ $t('landing.downloadLead') }}
        </p>

        <div class="d-flex flex-wrap justify-center gap-3 mb-8">
          <VChip
            v-for="item in platforms"
            :key="item.key"
            :color="item.ready ? 'success' : undefined"
            :prepend-icon="item.icon"
            variant="tonal"
          >
            {{ $t(item.titleKey) }} · {{ $t(item.statusKey) }}
          </VChip>
        </div>

        <VBtn
          to="/download"
          prepend-icon="tabler-download"
        >
          {{ $t('landing.downloadCta') }}
        </VBtn>
      </div>
    </VContainer>
  </section>
</template>

<style lang="scss" scoped>
.download-section {
  background-color: rgb(var(--v-theme-background));
  padding-block: 1rem 5rem;
}

/* Vuexy 랜딩의 섹션 제목 강조(밑줄 브러시)를 동일하게 쓴다 */
.section-title::after {
  position: absolute;
  background: url("../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}
</style>
