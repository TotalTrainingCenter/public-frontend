<script setup lang="ts">
import Banner from '@/views/front-pages/landing-page/banner.vue'
import ContactUs from '@/views/front-pages/landing-page/contact-us.vue'
import CustomersReview from '@/views/front-pages/landing-page/customers-review.vue'
import FaqSection from '@/views/front-pages/landing-page/faq-section.vue'
import Features from '@/views/front-pages/landing-page/features.vue'
import HeroSection from '@/views/front-pages/landing-page/hero-section.vue'
import PricingPlans from '@/views/front-pages/landing-page/pricing-plans.vue'
import ProductStats from '@/views/front-pages/landing-page/product-stats.vue'
import ActivitiesSection from '@/views/landing/ActivitiesSection.vue'
import DownloadSection from '@/views/landing/DownloadSection.vue'
import { organizationJsonLd, useSeo } from '@/composables/useSeo'
import { useConfigStore } from '@core/stores/config'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

const store = useConfigStore()

store.skin = 'default'

useSeo({
  title: t('site.slogan'),
  description: t('site.description'),
  jsonLd: organizationJsonLd(),
})
</script>

<template>
  <!--
    섹션 구성은 Vuexy 랜딩 데모를 기준으로 삼되, 내용은 전부 TTC 것으로 바꿨다.
    ⚠️ h1 은 HeroSection 안에 딱 하나만 존재해야 한다.
  -->
  <HeroSection />

  <Features />

  <ActivitiesSection />

  <ProductStats />

  <PricingPlans />

  <CustomersReview />

  <FaqSection />

  <DownloadSection />

  <Banner />

  <ContactUs />
</template>

<style lang="scss">
/* Vuexy 랜딩 섹션들이 기대하는 여백 보정 */
.landing-page-wrapper {
  .v-container {
    max-inline-size: 1440px;
  }
}

@media (max-width: 960px) and (min-width: 600px) {
  .v-container {
    padding-inline: 2rem !important;
  }
}
</style>
