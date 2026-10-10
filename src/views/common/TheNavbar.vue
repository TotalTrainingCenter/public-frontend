<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import NavBarI18n from '@core/components/I18n.vue'
import { themeConfig } from '@themeConfig'
import LogoLockup from '@images/brand/logo-lockup.svg?component'
import LogoMark from '@images/brand/logo-mark.svg?component'
import { navigation, siteConfig } from '@variables/site'

const { y } = useWindowScroll()

const isDrawerOpen = ref(false)

const route = useRoute()

watch(() => route.path, () => {
  isDrawerOpen.value = false
})

const isActive = (item: { to?: string; children?: { to?: string }[] }) => {
  const paths = [item.to, ...(item.children?.map(child => child.to) ?? [])].filter(Boolean) as string[]

  return paths.some(path => route.path === path || route.path.startsWith(`${path}/`))
}
</script>

<template>
  <!-- 레이아웃은 Vuexy 랜딩 데모의 '떠 있는 알약' 네비바를 따랐다. -->
  <header
    class="public-navbar"
    :class="{ 'public-navbar--scrolled': y > 8 }"
  >
    <VContainer class="public-navbar__inner d-flex align-center gap-x-4">
      <!-- 👉 로고 -->
      <RouterLink
        to="/"
        class="d-flex align-center text-primary"
        style="text-decoration: none;"
        :aria-label="`${$t('site.name')} ${$t('nav.home')}`"
      >
        <!-- 넓은 화면은 락업(마크+워드마크), 좁은 화면은 마크만 -->
        <LogoLockup
          class="d-none d-sm-block"
          :style="{ height: '36px', width: 'auto' }"
        />

        <LogoMark
          class="d-sm-none"
          :style="{ height: '32px', width: '32px' }"
        />
      </RouterLink>

      <VSpacer />

      <!--
        👉 데스크톱 GNB — lg(1280px) 부터 편다.
        md(960~1279px)에서 펴면 로고 락업(212px)·언어·테마·CTA 와 합쳐
        영어·일본어가 알약 폭을 넘고 CTA 가 '公式プラッ…' 처럼 잘린다(#67).
        그 구간은 햄버거 드로어로 보낸다. 메뉴 버튼 좌우 여백도 8px 로 줄였다.
      -->
      <nav
        class="public-navbar__gnb d-none d-lg-flex align-center gap-x-1"
        :aria-label="$t('nav.mainMenu')"
      >
        <template
          v-for="item in navigation"
          :key="item.titleKey"
        >
          <VBtn
            v-if="!item.children"
            :to="item.to"
            variant="text"
            :active="isActive(item)"
          >
            {{ $t(item.titleKey) }}
          </VBtn>

          <VBtn
            v-else
            variant="text"
            :active="isActive(item)"
          >
            {{ $t(item.titleKey) }}

            <VMenu
              activator="parent"
              open-on-hover
            >
              <VList>
                <VListItem
                  v-for="child in item.children"
                  :key="child.titleKey"
                  :to="child.to"
                >
                  {{ $t(child.titleKey) }}
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>
      </nav>

      <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      />

      <NavbarThemeSwitcher />

      <!-- 👉 공식 플랫폼 바로가기 (전 페이지 고정 CTA) -->
      <VBtn
        :href="siteConfig.platformUrl"
        color="primary"
        class="d-none d-sm-flex"
      >
        {{ $t('nav.platformCta') }}
      </VBtn>

      <!-- 👉 모바일 햄버거 -->
      <VBtn
        icon
        variant="text"
        class="d-lg-none"
        :aria-label="$t('nav.openMenu')"
        @click="isDrawerOpen = true"
      >
        <VIcon icon="tabler-menu-2" />
      </VBtn>
    </VContainer>

    <!-- 👉 모바일 드로어 -->
    <VNavigationDrawer
      v-model="isDrawerOpen"
      temporary
      location="end"
    >
      <VList nav>
        <template
          v-for="item in navigation"
          :key="item.titleKey"
        >
          <VListGroup v-if="item.children">
            <template #activator="{ props: activatorProps }">
              <VListItem
                v-bind="activatorProps"
                :title="$t(item.titleKey)"
              />
            </template>

            <VListItem
              v-for="child in item.children"
              :key="child.titleKey"
              :to="child.to"
              :title="$t(child.titleKey)"
            />
          </VListGroup>

          <VListItem
            v-else
            :to="item.to"
            :title="$t(item.titleKey)"
          />
        </template>
      </VList>

      <template #append>
        <div class="pa-4">
          <div
            v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
            class="d-flex justify-center mb-2"
          >
            <NavBarI18n
              :languages="themeConfig.app.i18n.langConfig"
              location="top center"
            />
          </div>

          <VBtn
            :href="siteConfig.platformUrl"
            color="primary"
            block
          >
            {{ $t('nav.platformCta') }}
          </VBtn>
        </div>
      </template>
    </VNavigationDrawer>
  </header>
</template>

<style lang="scss" scoped>
.public-navbar {
  position: sticky;
  z-index: 10;
  inset-block-start: 0;
  padding-block: 1rem;

  &__inner {
    border-radius: 0.75rem;
    background-color: rgba(var(--v-theme-surface), 0.9);
    backdrop-filter: blur(10px);
    padding-block: 0.5rem;
    transition: box-shadow 0.25s ease, background-color 0.25s ease;
  }

  // 메뉴 버튼 좌우 여백(기본 12px)을 줄여 일본어 메뉴가 1280px 알약에 들어가게 한다.
  // Vuexy 의 `.v-btn:not(.v-btn--icon, .v-tab).v-btn--variant-text.v-btn--size-default` 를 이기도록 클래스를 맞춰 쓴다.
  &__gnb .v-btn.v-btn--variant-text.v-btn--size-default {
    padding-inline: 0.5rem;
  }

  &--scrolled &__inner {
    background-color: rgba(var(--v-theme-surface), 0.96);
    box-shadow: 0 4px 20px rgba(var(--v-shadow-key-umbra-color), 0.14);
  }
}

@media (min-width: 1280px) {
  .public-navbar__inner {
    max-inline-size: 1200px;
  }
}
</style>
