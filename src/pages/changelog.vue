<script setup lang="ts">
import type { ReleasePlatform } from '@entity/Release'
import { releases } from '@variables/changelog'
import { useSeo } from '@/composables/useSeo'

const { t, locale } = useI18n()

definePage({ meta: { layout: 'public' } })

const GITHUB_URL = 'https://github.com/TotalTrainingCenter/changelog'

/** 플랫폼 칩 순서와 아이콘. 이름은 changelog.platform.* 로 번역한다. */
const PLATFORM_ICON: Record<ReleasePlatform, string> = {
  web: 'tabler-world',
  ios: 'tabler-brand-apple',
  android: 'tabler-brand-android',
  mac: 'tabler-device-laptop',
}

/**
 * YYYY-MM-DD → 화면 언어의 날짜 표기(한국어: 2026년 10월 19일).
 * 시간대에 따라 하루 밀리지 않도록 UTC 로 만들고 UTC 로 읽는다.
 */
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, day)))
}

useSeo({
  title: t('changelog.title'),
  description: t('changelog.seoDesc'),
})
</script>

<template>
  <PageHeader
    eyebrow="Changelog"
    :title="$t('changelog.title')"
    :lead="$t('changelog.lead')"
  />

  <VContainer class="pb-16">
    <div
      class="mx-auto"
      style="max-inline-size: 46rem;"
    >
      <!-- 변경 기록 본문은 한국어로만 쓴다. 다른 언어 화면에서는 그 사실을 알린다. -->
      <VAlert
        v-if="locale !== 'ko'"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-6"
      >
        {{ $t('changelog.koreanOnly') }}
      </VAlert>

      <p
        v-if="!releases.length"
        class="text-body-1 text-center text-medium-emphasis py-10"
      >
        {{ $t('changelog.empty') }}
      </p>

      <VCard
        v-for="release in releases"
        :key="release.date"
        tag="article"
        class="changelog-release mb-6"
      >
        <VCardText class="pa-5 pa-sm-8">
          <time
            :datetime="release.date"
            class="d-block text-body-2 text-primary font-weight-medium mb-1"
          >
            {{ formatDate(release.date) }}
          </time>

          <h2 class="text-h5 mb-3">
            {{ release.title }}
          </h2>

          <div
            v-if="release.platforms.length"
            class="d-flex flex-wrap gap-2 mb-2"
          >
            <VChip
              v-for="platform in release.platforms"
              :key="platform"
              size="small"
              variant="tonal"
              :prepend-icon="PLATFORM_ICON[platform]"
            >
              {{ $t(`changelog.platform.${platform}`) }}
            </VChip>
          </div>

          <section
            v-for="section in release.sections"
            :key="section.title"
            class="mt-5"
          >
            <h3
              v-if="section.title"
              class="text-subtitle-1 font-weight-bold mb-2"
            >
              {{ section.title }}
            </h3>

            <!--
              본문은 scripts/fetch-changelog.mts 가 허용 목록 방식으로 만든 HTML 이다
              (ul·li·p·strong·em·https 링크만, 글자는 전부 이스케이프).
              eslint-disable-next-line 은 v-html 줄을 덮지 못하므로 블록으로 끈다.
            -->
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="changelog-body text-body-1"
              v-html="section.html"
            />
            <!-- eslint-enable vue/no-v-html -->
          </section>
        </VCardText>
      </VCard>

      <div class="text-center mt-10">
        <VBtn
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          prepend-icon="tabler-brand-github"
        >
          {{ $t('changelog.github') }}
        </VBtn>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.changelog-release {
  overflow-wrap: anywhere;
}

.changelog-body {
  :deep(ul) {
    margin: 0;
    padding-inline-start: 1.25rem;
  }

  :deep(li) {
    margin-block-end: 0.375rem;
  }

  :deep(p) {
    margin-block-end: 0.5rem;
  }

  :deep(a) {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
  }
}
</style>
