<script setup lang="ts">
import paperPlane from '@images/front-pages/icons/paper-airplane.png'
import plane from '@images/front-pages/icons/plane.png'
import { membershipPlans } from '@variables/membership'
import { siteConfig } from '@variables/site'

/**
 * 멤버십 섹션.
 *
 * 원본 Vuexy 는 월/연 요금 토글에 3개 플랜이지만, 이 서비스는 등급이 둘뿐이고
 * LVL.0 은 7일 기간제라 토글이 성립하지 않는다. 그래서 토글을 뺐다.
 *
 * ⚠️ 요금·기간·등급명은 운영 DB 에서 생성된다(@variables/membership).
 *    여기에 숫자를 직접 적지 말 것 — 공개 사이트의 잘못된 가격 표기는 표시광고 문제가 된다.
 */
const planImages = [paperPlane, plane]
</script>

<template>
  <div id="pricing-plan">
    <VContainer>
      <div class="pricing-plans">
        <!-- 👉 Headers  -->
        <!--
          원본에는 헤더와 카드 사이에 요금 토글(mt-6 mb-16)이 있었다.
          이 서비스는 등급이 둘뿐이라 토글을 뺐고, 그 여백은 여기서 준다.
        -->
        <div class="headers d-flex justify-center flex-column align-center flex-wrap mb-12">
          <VChip
            label
            color="primary"
            class="mb-4"
            size="small"
          >
            멤버십
          </VChip>
          <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                먼저 해보고
              </div>
            </div>
            결정하세요
          </h2>
          <div class="text-center text-body-1">
            <p class="mb-0">
              두 등급 모두 활동 주제 전체를 이용할 수 있습니다. 차이는 기간뿐입니다.
            </p>
          </div>
        </div>

        <VRow class="ga-2">
          <VCol
            v-for="(plan, index) in membershipPlans"
            :key="plan.code"
            cols="12"
            md="6"
          >
            <VCard :style="plan.recommended ? 'border:2px solid rgb(var(--v-theme-primary))' : ''">
              <VCardText class="pa-8 pt-12">
                <VImg
                  :src="planImages[index % planImages.length]"
                  width="88"
                  height="88"
                  class="mx-auto mb-8"
                />
                <h3 class="text-h4 text-center">
                  {{ plan.name }}
                </h3>
                <p class="text-center text-body-2 text-medium-emphasis mb-6">
                  {{ plan.summary }}
                </p>
                <div class="d-flex justify-center mb-8">
                  <div class="d-flex align-end">
                    <div class="pricing-title text-primary me-1">
                      {{ plan.price }}
                    </div>
                    <span class="text-disabled mb-2">/ {{ plan.period }}</span>
                  </div>
                </div>
                <VList class="card-list">
                  <VListItem
                    v-for="(item, i) in plan.features"
                    :key="i"
                  >
                    <template #prepend>
                      <VAvatar
                        size="16"
                        :variant="item.available ? 'elevated' : 'tonal'"
                        :color="item.available ? 'primary' : 'secondary'"
                        class="me-3"
                      >
                        <VIcon
                          :icon="item.available ? 'tabler-check' : 'tabler-x'"
                          size="12"
                          :color="item.available ? 'white' : 'secondary'"
                        />
                      </VAvatar>
                      <span
                        class="text-h6"
                        :class="{ 'text-disabled': !item.available }"
                      >
                        {{ item.label }}
                      </span>
                    </template>
                  </VListItem>
                </VList>
                <VBtn
                  block
                  :variant="plan.recommended ? 'elevated' : 'tonal'"
                  class="mt-8"
                  :href="siteConfig.platformUrl"
                >
                  가입하고 시작하기
                </VBtn>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
        <p class="text-center text-body-2 text-disabled mt-10 mb-0">
          기관·단체 단위 운영 등급은
          <RouterLink to="/partnership">
            제휴 문의
          </RouterLink>
          를 통해 별도 안내드립니다.
        </p>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 12px;
}

#pricing-plan {
  border-radius: 3.75rem;
  background-color: rgb(var(--v-theme-background));
}

.pricing-title {
  font-size: 38px;
  font-weight: 800;
  line-height: 52px;
}

.pricing-plans {
  margin-block: 6.5rem;
}

@media (max-width: 600px) {
  .pricing-plans {
    margin-block: 4.5rem;
  }
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}
</style>
