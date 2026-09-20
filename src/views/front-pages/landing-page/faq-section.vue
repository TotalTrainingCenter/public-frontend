<script setup lang="ts">
import boyWithLogo from '@images/front-pages/landing-page/faq-boy-with-logos.png'

const { faqs } = useLocalizedContent()

/**
 * 랜딩에는 대표 질문 5개만. 전체는 /faq 에서 본다.
 * 원본 데이터는 관리자(publicfaq 게시판)에서 관리된다.
 */
const faqData = computed(() => faqs.value.slice(0, 5))
</script>

<template>
  <div id="faq">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <VChip
            label
            color="primary"
            size="small"
            class="mb-4"
          >
            FAQ
          </VChip>
          <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            {{ $t('landing.faqHeadingA') }}
            <div class="position-relative ms-2">
              <div class="section-title">
                {{ $t('landing.faqHeadingB') }}
              </div>
            </div>
          </h2>
          <p class="text-body-1 mb-0">
            {{ $t('landing.faqLead') }}
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="5"
          >
            <div class="pt-10 d-flex align-center justify-center h-100">
              <VImg
                :src="boyWithLogo"
                height="330"
                width="330"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VExpansionPanels class="pt-16">
              <VExpansionPanel
                v-for="faq in faqData"
                :key="faq.question"
              >
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <!-- ⚠️ eager 필수: 접힌 상태여도 DOM 에 렌더돼야 프리렌더 HTML 에 답변이 들어간다 -->
                <VExpansionPanelText eager>
                  {{ faq.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .faq-section {
    margin-block: 4rem;
  }
}

#faq {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background));
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
  font-weight: 800;
  inline-size: 130%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}
</style>
