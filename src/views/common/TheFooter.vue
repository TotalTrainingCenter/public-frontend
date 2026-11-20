<script setup lang="ts">
import LogoMark from '@images/brand/logo-mark.svg?component'
import { navigation, policyLinks, siteConfig } from '@variables/site'
import { businessFtcUrl, businessInfo } from '@variables/BusinessInfo'

const snsLinks = computed(() => ([
  { titleKey: 'sns.instagram', href: siteConfig.sns.instagram, icon: 'tabler-brand-instagram' },
  { titleKey: 'sns.threads', href: siteConfig.sns.threads, icon: 'tabler-brand-threads' },
  { titleKey: 'sns.facebook', href: siteConfig.sns.facebook, icon: 'tabler-brand-facebook' },
  { titleKey: 'sns.x', href: siteConfig.sns.x, icon: 'tabler-brand-x' },
  { titleKey: 'sns.naverBlog', href: siteConfig.sns.naverBlog, icon: 'tabler-notebook' },
  { titleKey: 'sns.naverCafe', href: siteConfig.sns.naverCafe, icon: 'tabler-users' },
].filter(item => item.href)))

const year = new Date().getFullYear()

const telHref = `tel:${businessInfo.tel.replaceAll('-', '')}`
const mailHref = `mailto:${businessInfo.email}`
const reportMailHref = `mailto:${businessInfo.reportEmail}`
</script>

<template>
  <footer class="public-footer">
    <VContainer>
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <div class="d-flex align-center gap-x-2 mb-2">
            <LogoMark
              class="text-primary"
              :style="{ height: '28px', width: '28px' }"
            />

            <span class="text-h6 font-weight-bold">
              {{ $t('site.name') }}
            </span>
          </div>

          <p class="text-body-2 mb-4">
            {{ $t('site.slogan') }}
          </p>

          <div class="d-flex gap-x-2">
            <VBtn
              v-for="sns in snsLinks"
              :key="sns.titleKey"
              :href="sns.href"
              :aria-label="$t(sns.titleKey)"
              icon
              variant="text"
              size="small"
              target="_blank"
              rel="noopener noreferrer"
            >
              <VIcon :icon="sns.icon" />
            </VBtn>
          </div>
        </VCol>

        <VCol
          v-for="item in navigation"
          :key="item.titleKey"
          cols="6"
          md="2"
        >
          <div class="font-weight-medium mb-3">
            {{ $t(item.titleKey) }}
          </div>

          <ul class="public-footer__list">
            <li
              v-for="child in (item.children ?? [item])"
              :key="child.titleKey"
            >
              <RouterLink :to="child.to!">
                {{ $t(child.titleKey) }}
              </RouterLink>
            </li>
          </ul>
        </VCol>
      </VRow>

      <VDivider class="my-6" />

      <!-- ℹ️ 약관·처리방침·청소년 보호정책 링크. 개인정보 처리방침은 다른 고지와 구분되게 굵게 -->
      <ul class="public-footer__list public-footer__list--inline mb-4">
        <li
          v-for="policy in policyLinks"
          :key="policy.titleKey"
        >
          <!-- 정책 원문은 외부(policy.training-center.org), 허브는 내부 라우트 -->
          <a
            v-if="policy.href"
            :href="policy.href"
            :class="{ 'font-weight-bold': policy.titleKey === 'policy.privacy' }"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t(policy.titleKey) }}
          </a>

          <RouterLink
            v-else
            :to="policy.to!"
          >
            {{ $t(policy.titleKey) }}
          </RouterLink>
        </li>
      </ul>

      <!--
        👉 사업자 정보 (전자상거래법 제10조 사이버몰 운영자 표시)
        버튼 속 창(BusinessInfoWidget)만으로는 초기 화면 표시로 인정받지 못할 위험이 있다는 2026-11 법률 자문 C 에 따라 바닥글에 직접 적는다.
        값은 @variables/BusinessInfo 한 곳에서 가져온다.
      -->
      <address
        class="public-footer__business text-caption"
        :aria-label="$t('business.sectionTitle')"
      >
        <div class="public-footer__business-line">
          <span><b>{{ $t('business.companyName') }}</b> {{ businessInfo.companyName }}</span>
          <span><b>{{ $t('business.ceo') }}</b> {{ businessInfo.ceo }}</span>
          <span>
            <b>{{ $t('business.regNo') }}</b> {{ businessInfo.regNo }}
            <a
              :href="businessFtcUrl"
              target="_blank"
              rel="noopener noreferrer"
            >[{{ $t('business.lookup') }}]</a>
          </span>
          <span><b>{{ $t('business.mailOrderNo') }}</b> {{ businessInfo.mailOrderNo ?? $t('business.mailOrderExempt') }}</span>
        </div>
        <div class="public-footer__business-line">
          <span><b>{{ $t('business.address') }}</b> {{ businessInfo.address }}</span>
          <span><b>{{ $t('business.tel') }}</b> <a :href="telHref">{{ businessInfo.tel }}</a></span>
          <span><b>{{ $t('business.email') }}</b> <a :href="mailHref">{{ businessInfo.email }}</a></span>
          <!-- ℹ️ 불법촬영물 등 신고 창구. 비회원·피해자도 찾을 수 있게 모든 화면 하단에 둔다(2026-11 법률 자문 C) -->
          <span><b>{{ $t('business.reportEmail') }}</b> <a :href="reportMailHref">{{ businessInfo.reportEmail }}</a></span>
          <span><b>{{ $t('business.hostingProvider') }}</b> {{ businessInfo.hostingProvider }}</span>
        </div>
      </address>

      <small class="d-block text-disabled mt-4">
        © {{ year }} {{ siteConfig.nameEn }}. All rights reserved.
      </small>
    </VContainer>
  </footer>
</template>

<style lang="scss" scoped>
.public-footer {
  padding-block: 3rem 2rem;
  background-color: rgb(var(--v-theme-surface));

  &__list {
    padding: 0;
    list-style: none;

    li + li {
      margin-block-start: 0.5rem;
    }

    a {
      color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
      font-size: 0.875rem;
      text-decoration: none;

      &:hover {
        color: rgb(var(--v-theme-primary));
      }
    }

    &--inline {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;

      li + li {
        margin-block-start: 0;
      }
    }
  }

  &__business {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    font-style: normal;
    line-height: 1.6;

    b {
      font-weight: 500;
    }

    a {
      color: inherit;
      text-decoration: underline;
    }
  }

  // 항목끼리는 간격으로만 나눈다. 좁은 화면에서 줄이 바뀌어도 줄 앞에 구분 기호가 남지 않게.
  &__business-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.125rem 1rem;
  }

  // 휴대폰·태블릿 폭에서는 오른쪽 아래 사업자 정보 버튼이 맨 아래 줄을 덮는다. 끝까지 내리면 비켜서게 버튼 높이만큼 여유를 둔다.
  @media (max-width: 959px) {
    padding-block-end: 4.5rem;
  }
}
</style>
