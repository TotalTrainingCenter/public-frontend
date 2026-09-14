<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { useTheme } from 'vuetify'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import joinArrow from '@images/front-pages/icons/Join-community-arrow.png'
import { activityGroups, totalActivityCount } from '@variables/activities'
import { siteConfig } from '@variables/site'
import heroDashboardImgDark from '@images/front-pages/landing-page/hero-dashboard-dark.png'
import heroDashboardImgLight from '@images/front-pages/landing-page/hero-dashboard-light.png'

import heroElementsImgDark from '@images/front-pages/landing-page/hero-elements-dark.png'
import heroElementsImgLight from '@images/front-pages/landing-page/hero-elements-light.png'

const theme = useTheme()

const heroElementsImg = useGenerateImageVariant(heroElementsImgLight, heroElementsImgDark)
const heroDashboardImg = useGenerateImageVariant(heroDashboardImgLight, heroDashboardImgDark)

const { x, y } = useMouse({ touch: false })

const translateMouse = computed(() => {
  if (typeof window !== 'undefined') {
    const rotateX = ref((window.innerHeight - (1 * y.value)) / 100)

    return { transform: `perspective(1200px) rotateX(${rotateX.value < -40 ? -20 : rotateX.value}deg) rotateY(${(window.innerWidth - (2 * x.value)) / 100}deg) scale3d(1,1,1)` }
  }

  // Provide a default return value when `window` is undefined
  return { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)' }
})
</script>

<template>
  <div
    id="home"
    :style="{ background: 'rgb(var(--v-theme-surface))' }"
  >
    <div id="landingHero">
      <div
        class="landing-hero"
        :class="theme.current.value.dark ? 'landing-hero-dark-bg' : 'landing-hero-light-bg'"
      >
        <VContainer>
          <div class="hero-text-box text-center px-6">
            <!-- ⚠️ 사이트 전체에서 h1 은 페이지당 1개. 홈의 h1 은 이것이다. -->
            <h1 class="hero-title mb-4">
              {{ siteConfig.slogan }}
            </h1>
            <h6 class="mb-6 text-h6">
              일상 속 행동과 습관을 활동 주제로 제시하고, 수행한 뒤 기록하고 인증받는 플랫폼.<br class="d-none d-md-inline">
              지금 {{ activityGroups.length }}개 주제 · {{ totalActivityCount }}개 활동이 준비돼 있습니다.
            </h6>
            <div class="position-relative">
              <h6 class="position-absolute hero-btn-item d-md-flex d-none text-h6 text-medium-emphasis">
                7일 무료
                <VImg
                  :src="joinArrow"
                  class="flip-in-rtl"
                  width="54"
                  height="31"
                />
              </h6>

              <div class="d-flex flex-wrap justify-center gap-4">
                <VBtn
                  :size="$vuetify.display.smAndUp ? 'large' : 'default'"
                  :href="siteConfig.platformUrl"
                >
                  공식 플랫폼 바로가기
                </VBtn>

                <VBtn
                  :size="$vuetify.display.smAndUp ? 'large' : 'default'"
                  variant="tonal"
                  to="/activities"
                >
                  활동 주제 둘러보기
                </VBtn>
              </div>
            </div>
          </div>
        </VContainer>
      </div>
    </div>

    <VContainer>
      <div class="position-relative">
        <div class="blank-section" />
        <div class="hero-animation-img position-absolute">
          <!--
            ⚠️ 이 이미지는 아직 Vuexy 데모의 대시보드 스크린샷이다.
            실제 서비스 화면이 아니므로 공개 전에 TTC 플랫폼 캡처로 반드시 교체할 것.
            교체 대상: @images/front-pages/landing-page/hero-dashboard-{light,dark}.png
          -->
          <a
            :href="siteConfig.platformUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              class="hero-dashboard-img position-relative"
              :style="translateMouse"
              data-allow-mismatch
            >
              <img
                :src="heroDashboardImg"
                alt="Hero Dashboard"
                class="animation-img"
              >
              <img
                :src="heroElementsImg"
                alt="hero elements"
                class="hero-elements-img animation-img position-absolute"
                style="transform: translateZ(1rem);"
              >
            </div>
          </a>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.landing-hero {
  border-radius: 0 0 50px 50px;
  padding-block: 9.75rem 22rem;
}

.hero-animation-img {
  inline-size: 90%;
  inset-block-start: -25rem;
  inset-inline-start: 4.425rem;
  margin-inline: auto;
}

section {
  display: block;
}

.blank-section {
  background-color: rgba(var(--v-theme-surface));
  min-block-size: 25rem;
}

@media (min-width: 1280px) and (max-width: 1440px) {
  .blank-section {
    min-block-size: 18rem;
  }

  .landing-hero {
    padding-block-end: 22rem;
  }

  .hero-animation-img {
    inset-block-start: -25rem;
  }
}

@media (min-width: 900px) and (max-width: 1279px) {
  .blank-section {
    min-block-size: 13rem;
  }

  .landing-hero {
    padding-block-end: 14rem;
  }

  .hero-animation-img {
    inset-block-start: -17rem;
    inset-inline-start: 2.75rem;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .blank-section {
    min-block-size: 12rem;
  }

  .landing-hero {
    padding-block-end: 12rem;
  }

  .hero-animation-img {
    inset-block-start: -15rem;
    inset-inline-start: 2.5rem;
  }
}

@media (min-width: 600px) and (max-width: 767px) {
  .blank-section {
    min-block-size: 12rem;
  }

  .landing-hero {
    padding-block-end: 8rem;
  }

  .hero-animation-img {
    inset-block-start: -11rem;
    inset-inline-start: 2rem;
  }
}

@media (min-width: 425px) and (max-width: 600px) {
  .blank-section {
    min-block-size: 8rem;
  }

  .landing-hero {
    padding-block-end: 8rem;
  }

  .hero-animation-img {
    inset-block-start: -9rem;
    inset-inline-start: 1.7rem;
  }
}

@media (min-width: 300px) and (max-width: 424px) {
  .blank-section {
    min-block-size: 4rem;
  }

  .landing-hero {
    padding-block-end: 6rem;
  }

  .hero-animation-img {
    inset-block-start: -7rem;
    inset-inline-start: 1.25rem;
  }
}

.landing-hero::before {
  position: absolute;
  background-repeat: no-repeat;
  inset-block: 0;
  opacity: 0.5;
}

.landing-hero-dark-bg {
  background-color: #25293c;
  background-image: url("@images/front-pages/backgrounds/hero-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.landing-hero-light-bg {
  background: url("@images/front-pages/backgrounds/hero-bg.png") center no-repeat, linear-gradient(138.18deg, #eae8fd 0%, #fce5e6 94.44%);
  background-size: cover;
}

@media (min-width: 650px) {
  .hero-text-box {
    inline-size: 38rem;
    margin-block-end: 1rem;
    margin-inline: auto;
  }
}

@media (max-width: 599px) {
  .hero-title {
    font-size: 1.5rem !important;
    line-height: 2.375rem !important;
  }
}

.hero-title {
  animation: shine 2s ease-in-out infinite alternate;
  background: linear-gradient(135deg, #28c76f 0%, #5a4aff 47.92%, #ff3739 100%);
  //  stylelint-disable-next-line property-no-vendor-prefix
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 200% auto;
  font-size: 42px;
  font-weight: 800;
  line-height: 48px;
  -webkit-text-fill-color: rgba(0, 0, 0, 0%);
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }

  80% {
    background-position: 50% 90%;
  }

  100% {
    background-position: 91% 100%;
  }
}

.hero-dashboard-img {
  margin-block: 0;
  margin-inline: auto;
  transform-style: preserve-3d;
  transition: all 0.35s;

  img {
    inline-size: 100%;
  }
}

.hero-elements-img {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

.feature-cards {
  margin-block-start: 6.25rem;
}

.hero-btn-item {
  inset-block-start: 80%;
  inset-inline-start: 5%;
}
</style>
