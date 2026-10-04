<script setup lang="ts">
import LogoMark from '@images/brand/logo-mark.svg?component'
import { siteConfig } from '@variables/site'

// ⚠️ Vuexy 원본은 여기에 견본 대시보드 그림(cta-dashboard.png — 'Vuexy' 로고·가짜 매출)을 썼다.
//    우리 서비스 화면이 아닌 그림을 싣는 것이라 심볼 마크로 바꿨다.
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
            {{ $t('landing.bannerTitle') }}
          </h2>
          <p class="text-h5 text-medium-emphasis mb-8">
            {{ $t('landing.heroTrial') }}
          </p>
          <VBtn
            color="primary"
            :href="siteConfig.platformUrl"
            :size="$vuetify.display.smAndUp ? 'large' : 'default'"
          >
            {{ $t('cta.platform') }}
          </VBtn>
        </div>

        <div class="banner-img d-none d-sm-flex align-center">
          <LogoMark class="banner-mark text-primary" />
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
  padding-block-end: 3rem;
}

.banner-mark {
  block-size: 160px;
  inline-size: 160px;
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
