<script setup lang="ts">
import LogoMark from '@images/brand/logo-mark.svg?component'
import { navigation, policyLinks, siteConfig } from '@variables/site'

const snsLinks = computed(() => ([
  { titleKey: 'sns.instagram', href: siteConfig.sns.instagram, icon: 'tabler-brand-instagram' },
  { titleKey: 'sns.threads', href: siteConfig.sns.threads, icon: 'tabler-brand-threads' },
  { titleKey: 'sns.facebook', href: siteConfig.sns.facebook, icon: 'tabler-brand-facebook' },
  { titleKey: 'sns.x', href: siteConfig.sns.x, icon: 'tabler-brand-x' },
  { titleKey: 'sns.naverBlog', href: siteConfig.sns.naverBlog, icon: 'tabler-notebook' },
  { titleKey: 'sns.naverCafe', href: siteConfig.sns.naverCafe, icon: 'tabler-users' },
].filter(item => item.href)))

const year = new Date().getFullYear()
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

      <div class="d-flex flex-wrap justify-space-between align-center gap-4">
        <!--
          TODO: 사업자 정보 표기 (통신판매업 신고 완료 시 법적 의무)
          상호 / 대표자 / 사업자등록번호 / 통신판매업신고번호 / 주소 / 연락처
        -->
        <small class="text-disabled">
          © {{ year }} {{ siteConfig.nameEn }}. All rights reserved.
        </small>

        <ul class="public-footer__list public-footer__list--inline">
          <li
            v-for="policy in policyLinks"
            :key="policy.titleKey"
          >
            <!-- 정책 원문은 외부(policy.training-center.org), 허브는 내부 라우트 -->
            <!-- ℹ️ 개인정보 처리방침은 다른 고지와 구분되게 굵게 -->
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
      </div>
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
      gap: 1rem;

      li + li {
        margin-block-start: 0;
      }
    }
  }
}
</style>
