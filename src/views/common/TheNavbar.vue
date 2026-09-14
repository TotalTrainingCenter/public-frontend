<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
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
        :aria-label="`${siteConfig.name} 홈`"
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

      <!-- 👉 데스크톱 GNB -->
      <nav
        class="d-none d-md-flex align-center gap-x-1"
        aria-label="주요 메뉴"
      >
        <template
          v-for="item in navigation"
          :key="item.title"
        >
          <VBtn
            v-if="!item.children"
            :to="item.to"
            variant="text"
            :active="isActive(item)"
          >
            {{ item.title }}
          </VBtn>

          <VBtn
            v-else
            variant="text"
            :active="isActive(item)"
          >
            {{ item.title }}

            <VMenu
              activator="parent"
              open-on-hover
            >
              <VList>
                <VListItem
                  v-for="child in item.children"
                  :key="child.title"
                  :to="child.to"
                >
                  {{ child.title }}
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>
      </nav>

      <NavbarThemeSwitcher />

      <!-- 👉 공식 플랫폼 바로가기 (전 페이지 고정 CTA) -->
      <VBtn
        :href="siteConfig.platformUrl"
        color="primary"
        class="d-none d-sm-flex"
      >
        공식 플랫폼 바로가기
      </VBtn>

      <!-- 👉 모바일 햄버거 -->
      <VBtn
        icon
        variant="text"
        class="d-md-none"
        aria-label="메뉴 열기"
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
          :key="item.title"
        >
          <VListGroup v-if="item.children">
            <template #activator="{ props: activatorProps }">
              <VListItem
                v-bind="activatorProps"
                :title="item.title"
              />
            </template>

            <VListItem
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
              :title="child.title"
            />
          </VListGroup>

          <VListItem
            v-else
            :to="item.to"
            :title="item.title"
          />
        </template>
      </VList>

      <template #append>
        <div class="pa-4">
          <VBtn
            :href="siteConfig.platformUrl"
            color="primary"
            block
          >
            공식 플랫폼 바로가기
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
