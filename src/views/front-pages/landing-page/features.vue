<script setup lang="ts">
import check from '@images/svg/Check.svg'
import keyboard from '@images/svg/keyboard.svg'
import laptop from '@images/svg/laptop.svg'
import paper from '@images/svg/paper-send.svg'
import rocket from '@images/svg/rocket.svg'
import user from '@images/svg/user.svg'

/**
 * 랜딩의 '왜 이 방식인가' 섹션.
 * 5단계 흐름(serviceSteps)은 /features 페이지가 다루고, 여기서는 차별점을 보여준다.
 */
const { t } = useI18n()

const featuresData = computed(() => ([
  { title: t('landing.whyPickTitle'), desc: t('landing.whyPickDesc'), icon: laptop },
  { title: t('landing.whyProofTitle'), desc: t('landing.whyProofDesc'), icon: check },
  { title: t('landing.whyFiveTitle'), desc: t('landing.whyFiveDesc'), icon: rocket },
  { title: t('landing.whyTogetherTitle'), desc: t('landing.whyTogetherDesc'), icon: user },
  { title: t('landing.whyResumeTitle'), desc: t('landing.whyResumeDesc'), icon: paper },
  { title: t('landing.whyBeyondTitle'), desc: t('landing.whyBeyondDesc'), icon: keyboard },
]))
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-12">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          {{ $t('landing.whyChip') }}
        </VChip>
        <h2 class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              {{ $t('landing.whyHeadingA') }}
            </div>
          </div>
          {{ $t('landing.whyHeadingB') }}
        </h2>
        <p class="text-body-1 mb-0">
          {{ $t('landing.whyLead') }}
        </p>
      </div>
      <VRow>
        <VCol
          v-for="(data, index) in featuresData"
          :key="index"
          cols="12"
          md="4"
          sm="6"
        >
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon
              :icon="data.icon"
              size="64"
              color="primary"
            />
            <div class="text-center">
              <h3 class="text-h5 mb-2">
                {{ data.title }}
              </h3>
              <p
                class="text-body-1 mb-6"
                style="max-inline-size: 310px;"
              >
                {{ data.desc }}
              </p>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 3.75rem;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
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

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
