<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { useTheme } from 'vuetify'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { siteConfig } from '@variables/site'
import heroDashboardImgDark from '@images/front-pages/landing-page/hero-dashboard-dark.png'
import heroDashboardImgLight from '@images/front-pages/landing-page/hero-dashboard-light.png'

const { activityGroups, totalActivityCount } = useLocalizedContent()

const theme = useTheme()

/*
 * 히어로 목업은 실제 서비스 화면(활동 목록)이다.
 *
 * ⚠️ Vuexy 원본에는 그 위에 hero-elements 오버레이가 얹혀 있었는데,
 *    "Congratulations John · $48.9k · Revenue Report $25,825" 같은 가짜 매출 카드였다.
 *    이 서비스와 무관한 조작된 수치라 걷어냈다. 다시 넣지 말 것.
 */
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
              {{ $t('site.slogan') }}
            </h1>
            <h6 class="mb-6 text-h6">
              {{ $t('landing.heroLine1') }}<br class="d-none d-md-inline">
              {{ $t('landing.heroLine2', { groups: activityGroups.length, activities: totalActivityCount }) }}
            </h6>
            <div>
              <div class="d-flex flex-wrap justify-center gap-4">
                <VBtn
                  :size="$vuetify.display.smAndUp ? 'large' : 'default'"
                  :href="siteConfig.platformUrl"
                >
                  {{ $t('cta.platform') }}
                </VBtn>

                <VBtn
                  :size="$vuetify.display.smAndUp ? 'large' : 'default'"
                  variant="tonal"
                  to="/activities"
                >
                  {{ $t('cta.browseActivities') }}
                </VBtn>
              </div>

              <p class="text-body-2 text-medium-emphasis mt-6 mb-0">
                {{ $t('landing.heroTrial') }}
              </p>
            </div>
          </div>
        </VContainer>
      </div>
    </div>

    <VContainer>
      <div class="position-relative">
        <div class="blank-section" />
        <div class="hero-animation-img position-absolute">
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
                :alt="$t('landing.heroAlt')"
                class="animation-img"
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

.feature-cards {
  margin-block-start: 6.25rem;
}
</style>
