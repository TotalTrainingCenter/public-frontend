<script lang="ts" setup>
import TheFooter from '@/views/common/TheFooter.vue'
import TheNavbar from '@/views/common/TheNavbar.vue'

const { injectSkinClasses } = useSkins()

injectSkinClasses()

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
</script>

<template>
  <AppLoadingIndicator ref="refLoadingIndicator" />

  <div
    class="layout-wrapper layout-blank public-layout"
    data-allow-mismatch
  >
    <TheNavbar />

    <main class="public-layout__main">
      <RouterView #="{ Component }">
        <Suspense
          :timeout="0"
          @fallback="isFallbackStateActive = true"
          @resolve="isFallbackStateActive = false"
        >
          <Component :is="Component" />
        </Suspense>
      </RouterView>
    </main>

    <TheFooter />
  </div>
</template>

<style lang="scss">
.layout-wrapper.layout-blank.public-layout {
  flex-direction: column;
  min-block-size: 100dvh;
}

.public-layout__main {
  flex-grow: 1;
}

@media (max-width: 960px) and (min-width: 600px) {
  .public-layout .v-container {
    padding-inline: 2rem !important;
  }
}
</style>
