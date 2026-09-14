<script setup lang="ts">
import ConnectImg from '@images/front-pages/landing-page/contact-customer-service.png'
import { siteConfig } from '@variables/site'

/**
 * ⚠️ 원본에는 이름/이메일/메시지 폼이 있었지만 전송 대상이 없어 걷어냈다.
 *    폼을 다시 넣으려면 백엔드 문의 API 와 개인정보 수집·이용 동의 체크박스가 먼저 필요하다.
 *    지금은 제휴 문의 안내와 메일 링크로 보낸다.
 */
</script>

<template>
  <VContainer id="contact-us">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center pb-16">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          제휴 문의
        </VChip>
        <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              함께 만들
            </div>
          </div>
          분을 찾습니다
        </h2>
        <p class="text-body-1 mb-0">
          기업, 학교, 공공기관 어디서든 협업 제안을 환영합니다.
        </p>
      </div>

      <div class="mb-15">
        <VRow class="match-height">
          <VCol
            cols="12"
            md="5"
          >
            <div class="contact-card h-100">
              <VCard
                variant="outlined"
                border
                class="pa-2"
                :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
              >
                <VImg
                  :src="ConnectImg"
                  :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
                />
                <VCardText class="pa-4 pb-1">
                  <div class="d-flex justify-space-between flex-wrap gap-y-4">
                    <div
                      v-for="(item, index) in [
                        { title: '제휴·문의 메일', icon: 'tabler-mail', color: 'primary', value: siteConfig.contact.email },
                      ]"
                      :key="index"
                      class="d-flex gap-x-3 align-center"
                    >
                      <div>
                        <VAvatar
                          size="36"
                          :color="item.color"
                          variant="tonal"
                          class="rounded-sm"
                        >
                          <VIcon
                            :icon="item.icon"
                            size="24"
                          />
                        </VAvatar>
                      </div>

                      <div>
                        <div class="text-body-1">
                          {{ item .title }}
                        </div>
                        <h6 class="text-h6">
                          {{ item.value }}
                        </h6>
                      </div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="7"
          >
            <VCard>
              <VCardItem class="pb-0">
                <h3 class="text-h4 mb-1">
                  문의하기
                </h3>
              </VCardItem>

              <VCardText>
                <p class="mb-6">
                  사내 습관 챌린지, 학급 단위 활동, 공공 캠페인 등 단체 단위 운영을 함께 설계해 드립니다.
                  아래 내용을 담아 메일 주시면 확인 후 회신드립니다.
                </p>

                <VList class="mb-6">
                  <VListItem title="단체명과 담당자 연락처" />
                  <VListItem title="예상 참여 인원과 운영 기간" />
                  <VListItem title="원하시는 활동 주제 또는 달성하려는 목표" />
                  <VListItem title="기존에 운영 중인 프로그램이 있다면 그 내용" />
                </VList>

                <div class="d-flex flex-wrap gap-4">
                  <VBtn :href="`mailto:${siteConfig.contact.email}?subject=[제휴 문의] 종합 훈련 센터`">
                    메일로 문의하기
                  </VBtn>

                  <VBtn
                    to="/partnership"
                    variant="tonal"
                  >
                    제휴 안내 자세히 보기
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.contact-us-section {
  margin-block: 5.25rem;
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
  inline-size: 120%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}

.contact-card {
  position: relative;
}

.contact-card::before {
  position: absolute;
  content: url("@images/front-pages/icons/contact-border.png");
  inset-block-start: -2.5rem;
  inset-inline-start: -2.5rem;
}

@media screen and (max-width: 999px) {
  .contact-card::before {
    display: none;
  }
}
</style>
