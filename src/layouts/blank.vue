<script lang="ts" setup>
const { injectSkinClasses } = useSkins()

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <Suspense
    :timeout="0"
    @fallback="isFallbackStateActive = true"
    @resolve="isFallbackStateActive = false"
  >
    <!-- ℹ️ Suspense 의 기본 슬롯은 루트 노드가 하나여야 한다. 두 개면 아무것도 렌더되지 않는다. -->
    <div
      class="layout-wrapper layout-blank"
      data-allow-mismatch
    >
      <AppLoadingIndicator ref="refLoadingIndicator" />

      <RouterView #="{Component}">
        <Component :is="Component" />
      </RouterView>
    </div>
  </Suspense>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
