<script setup lang="ts">
const { y } = useWindowScroll()

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <VScaleTransition
    style="transform-origin: center;"
    class="scroll-to-top d-print-none"
  >
    <VBtn
      v-show="y > 200"
      icon
      density="comfortable"
      @click.prevent="scrollToTop"
    >
      <VIcon
        size="22"
        icon="tabler-arrow-up"
      />
    </VBtn>
  </VScaleTransition>
</template>

<style lang="scss">
.scroll-to-top {
  position: fixed !important;

  // To keep button on top of v-layout. E.g. Email app
  z-index: 999;

  // ℹ️ 우측 하단 사업자 정보 위젯(BusinessInfoWidget) 위에 쌓이도록 고정 오프셋 사용
  inset-block-end: 4.25rem;
  inset-inline-end: 1.5rem;
}
</style>
