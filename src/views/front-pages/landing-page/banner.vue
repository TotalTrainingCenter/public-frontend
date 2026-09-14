<script setup lang="ts">
import ctaDashborad from '@images/front-pages/landing-page/cta-dashboard.png'
import { siteConfig } from '@variables/site'
</script>

<template>
  <div
    class="landing-cta bg-surface"
    :class="$vuetify.theme.current.dark ? 'banner-bg-dark' : 'banner-bg-light'"
  >
    <VContainer>
      <div class="d-flex justify-center justify-md-space-between flex-wrap gap-6 gap-x-10 position-relative pt-12">
        <div class="align-self-center">
          <h2 class="banner-title text-primary mb-1">
            오늘 하나만 해보세요
          </h2>
          <p class="text-h5 text-medium-emphasis mb-8">
            LVL.0 등급은 7일 무료입니다. 해보고 결정하셔도 됩니다.
          </p>
          <VBtn
            color="primary"
            :href="siteConfig.platformUrl"
            :size="$vuetify.display.smAndUp ? 'large' : 'default'"
          >
            공식 플랫폼 바로가기
          </VBtn>
        </div>

        <div class="banner-img">
          <img
            :src="ctaDashborad"
            class="w-100"
          >
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss">
.landing-cta {
  background-size: cover;
  margin-block: auto;
}

.banner-img {
  margin-block-end: -22px;
}

.banner-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 44px;
}

.banner-bg-light {
  background-image: url("@images/front-pages/backgrounds/cta-bg.png");
}

.banner-bg-dark {
  background-image: url("@images/front-pages/backgrounds/cta-bg-dark.png");
}
</style>
