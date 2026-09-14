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
const featuresData = [
  { title: '고르기만 하면 시작', desc: '무엇을 습관으로 삼을지 직접 설계하지 않아도 됩니다. 주제별로 정리된 활동에서 고르면 됩니다.', icon: laptop },
  { title: '증거가 있는 기록', desc: '체크박스는 누구나 누릅니다. 수행 직후의 원본 기록을 남기니 스스로를 속이기 어렵습니다.', icon: check },
  { title: '하루 5분이면 충분', desc: '물 한 병, 스트레칭 한 번, 책상 한 칸. 평일에도 무너지지 않는 크기로 설계했습니다.', icon: rocket },
  { title: '혼자가 아닌 기록', desc: '같은 활동을 하는 사람들의 기록이 함께 쌓입니다. 나만 하고 있는 게 아니라는 감각이 남습니다.', icon: user },
  { title: '무너져도 이어집니다', desc: '하루 빠뜨려도 처음부터 다시 시작하지 않습니다. 못 한 날도 기록의 일부입니다.', icon: paper },
  { title: '개인을 넘어서', desc: '사회적 취약 계층에 도움이 되는 주제도 함께 만들고, 기업·학교·공공기관 협업도 엽니다.', icon: keyboard },
]
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
          왜 이 방식인가
        </VChip>
        <h2 class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              작심삼일로 끝나지
            </div>
          </div>
          않는 이유
        </h2>
        <p class="text-body-1 mb-0">
          의지가 부족해서가 아닙니다. 무엇을 할지 정하는 데 힘을 다 쓰고, 하고 나서 아무것도 남지 않기 때문입니다.
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
