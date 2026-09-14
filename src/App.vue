<script setup lang="ts">
import { useTheme } from 'vuetify'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'

/**
 * 공개 소개 사이트의 루트.
 *
 * ⚠️ total-frontend 의 App.vue 를 걷어낸 버전이다.
 *    로그인 만료 감시 / JWT 디코드 / FCM 알림 / 소켓 / 마이페이지 리다이렉트를 전부 뺐다.
 *    이 사이트는 비로그인 공개 사이트이고, 인증 로직이 하나라도 살아 있으면
 *    크롤러가 본문 대신 리다이렉트를 만나게 된다. 다시 넣지 말 것.
 */
const { global } = useTheme()

initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />

      <!--
        사업자 정보 위젯. 통신판매업 표기 의무와 직결되므로 빼지 말 것.
        표기 내용은 src/components/BusinessInfoWidget.vue 안의 businessInfo 를 수정한다.
      -->
      <BusinessInfoWidget />
    </VApp>
  </VLocaleProvider>
</template>
