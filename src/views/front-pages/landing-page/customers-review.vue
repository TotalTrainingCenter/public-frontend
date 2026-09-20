<script setup lang="ts">
import { register } from 'swiper/element/bundle'

const { stories } = useLocalizedContent()

/**
 * 활동 후기 섹션.
 *
 * ⚠️ Vuexy 원본은 가짜 고객 후기(인물 사진 · 회사 로고 · 별점)로 채워져 있었다.
 *    실존하지 않는 후기를 진짜처럼 싣는 것이라 그대로 쓸 수 없어 걷어냈다.
 *    여기에는 관리자(publicstory 게시판)에 실제로 작성된 글만 나온다.
 *    후기가 없으면 섹션 자체가 렌더되지 않는다.
 */
register()

const featured = computed(() => stories.value.slice(0, 6))
</script>

<template>
  <div
    v-if="featured.length"
    class="bg-surface"
  >
    <VContainer>
      <div class="review-section">
        <div class="headers d-flex justify-center flex-column align-center mb-12">
          <VChip
            label
            color="primary"
            size="small"
            class="mb-4"
          >
            {{ $t('landing.reviewChip') }}
          </VChip>
          <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                {{ $t('landing.reviewHeadingA') }}
              </div>
            </div>
            {{ $t('landing.reviewHeadingB') }}
          </h2>
          <p class="text-body-1 mb-0">
            {{ $t('landing.reviewLead') }}
          </p>
        </div>

        <VRow>
          <VCol
            v-for="story in featured"
            :key="story.slug"
            cols="12"
            md="4"
            sm="6"
          >
            <VCard
              :to="`/stories/${story.slug}`"
              class="h-100"
              variant="outlined"
            >
              <VCardText>
                <VIcon
                  icon="tabler-quote"
                  size="28"
                  color="primary"
                  class="mb-3"
                />

                <h3 class="text-h6 mb-2">
                  {{ story.title }}
                </h3>

                <p class="text-body-2 mb-4">
                  {{ story.description }}
                </p>

                <span class="text-body-2 text-disabled">{{ story.date }}</span>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <div class="text-center mt-8">
          <VBtn
            to="/stories"
            variant="tonal"
          >
            {{ $t('landing.reviewMoreCta') }}
          </VBtn>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.review-section {
  margin-block: 5.25rem;
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
</style>
