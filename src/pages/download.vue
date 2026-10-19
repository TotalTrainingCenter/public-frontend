<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

definePage({ meta: { layout: 'public' } })

const mac = siteConfig.apps.mac

/** 화면 표기용 크기(MB). 맥 Finder 와 같은 1000 단위 — 1024 로 나누면 Finder 표시(약 91MB)보다 작게 보인다. */
const macSizeMb = Math.round(mac.sizeBytes / 1000 / 1000)

const installSteps = computed(() => ([
  t('download.install1'),
  t('download.install2'),
  t('download.install3'),
]))

/** 준비 중인 플랫폼. 출시되면 Mac 카드처럼 링크를 단다. */
const upcoming = computed(() => ([
  { key: 'ios', icon: 'tabler-brand-apple', title: t('download.iosTitle'), status: t('download.iosPreparing'), body: t('download.iosBody') },
  { key: 'android', icon: 'tabler-brand-android', title: t('download.androidTitle'), status: t('download.preparing'), body: t('download.androidBody') },
]))

/** SHA-256 복사 결과. 클립보드 권한이 없거나 http 환경이면 실패한다 — 그때는 직접 선택하도록 안내한다. */
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyChecksum = async () => {
  clearTimeout(copyTimer)
  try {
    if (!navigator.clipboard)
      throw new Error('clipboard unavailable')
    await navigator.clipboard.writeText(mac.sha256)
    copyState.value = 'copied'
  }
  catch {
    copyState.value = 'failed'
  }
  copyTimer = setTimeout(() => {
    copyState.value = 'idle'
  }, 4000)
}

onBeforeUnmount(() => clearTimeout(copyTimer))

useSeo({
  title: t('download.title'),
  description: t('download.seoDesc'),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': `${siteConfig.name} (${siteConfig.shortName})`,
    'operatingSystem': 'macOS',
    'applicationCategory': 'LifestyleApplication',
    'softwareVersion': mac.version,
    'downloadUrl': mac.url,
    'fileSize': `${macSizeMb}MB`,
    'inLanguage': 'ko-KR',
    'url': `${siteConfig.url}/download`,
  },
})
</script>

<template>
  <PageHeader
    eyebrow="Download"
    :title="$t('download.title')"
    :lead="$t('download.lead')"
  />

  <VContainer class="pb-16">
    <div
      class="download-body mx-auto"
      style="max-inline-size: 56rem;"
    >
      <!-- 👉 Mac -->
      <VCard class="mb-6">
        <VCardText class="pa-6 pa-sm-8">
          <div class="d-flex align-center flex-wrap gap-3 mb-3">
            <VAvatar
              color="primary"
              variant="tonal"
              rounded
              size="44"
            >
              <VIcon
                icon="tabler-device-laptop"
                size="26"
              />
            </VAvatar>

            <h2 class="text-h4 mb-0">
              {{ $t('download.macTitle') }}
            </h2>

            <VChip
              color="success"
              variant="tonal"
              size="small"
            >
              {{ $t('download.available') }}
            </VChip>
          </div>

          <p class="text-body-1 mb-6">
            {{ $t('download.macBody') }}
          </p>

          <VBtn
            :href="mac.url"
            size="large"
            prepend-icon="tabler-download"
            class="mb-6"
          >
            {{ $t('download.macButton') }}
          </VBtn>

          <dl class="download-spec mb-6">
            <div>
              <dt>{{ $t('download.version') }}</dt>
              <dd>{{ mac.version }}</dd>
            </div>
            <div>
              <dt>{{ $t('download.size') }}</dt>
              <dd>{{ $t('download.sizeValue', { mb: macSizeMb }) }}</dd>
            </div>
            <div>
              <dt>{{ $t('download.requirement') }}</dt>
              <dd>{{ $t('download.requirementValue') }}</dd>
            </div>
          </dl>

          <VAlert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-8"
          >
            {{ $t('download.intelNote') }}
          </VAlert>

          <h3 class="text-h6 mb-3">
            {{ $t('download.installTitle') }}
          </h3>

          <ol class="download-steps text-body-1 mb-8">
            <li
              v-for="step in installSteps"
              :key="step"
            >
              {{ step }}
            </li>
          </ol>

          <h3 class="text-subtitle-1 font-weight-medium mb-1">
            {{ $t('download.checksumTitle') }}
          </h3>

          <p class="text-body-2 text-medium-emphasis mb-2">
            {{ $t('download.checksumHint') }}
          </p>

          <div class="d-flex align-start gap-2">
            <code class="download-checksum flex-grow-1">{{ mac.sha256 }}</code>

            <VBtn
              variant="tonal"
              size="small"
              prepend-icon="tabler-copy"
              class="flex-shrink-0"
              @click="copyChecksum"
            >
              {{ $t('download.copy') }}
            </VBtn>
          </div>

          <p
            class="text-body-2 mt-2 mb-0"
            :class="copyState === 'failed' ? 'text-error' : 'text-success'"
            role="status"
            aria-live="polite"
          >
            <template v-if="copyState === 'copied'">
              {{ $t('download.copied') }}
            </template>
            <template v-else-if="copyState === 'failed'">
              {{ $t('download.copyFailed') }}
            </template>
          </p>
        </VCardText>
      </VCard>

      <VRow>
        <!-- 👉 iPhone · Android (준비 중) -->
        <VCol
          v-for="item in upcoming"
          :key="item.key"
          cols="12"
          md="4"
        >
          <VCard class="h-100">
            <VCardText>
              <div class="d-flex align-center gap-2 mb-3">
                <VIcon
                  :icon="item.icon"
                  size="24"
                />
                <h2 class="text-h6 mb-0">
                  {{ item.title }}
                </h2>
              </div>

              <VChip
                size="small"
                variant="tonal"
                class="mb-3"
              >
                {{ item.status }}
              </VChip>

              <p class="text-body-2 mb-0">
                {{ item.body }}
              </p>
            </VCardText>
          </VCard>
        </VCol>

        <!-- 👉 웹 -->
        <VCol
          cols="12"
          md="4"
        >
          <VCard class="h-100">
            <VCardText>
              <div class="d-flex align-center gap-2 mb-3">
                <VIcon
                  icon="tabler-world"
                  size="24"
                />
                <h2 class="text-h6 mb-0">
                  {{ $t('download.webTitle') }}
                </h2>
              </div>

              <VChip
                color="success"
                size="small"
                variant="tonal"
                class="mb-3"
              >
                {{ $t('download.webStatus') }}
              </VChip>

              <p class="text-body-2 mb-4">
                {{ $t('download.webBody') }}
              </p>

              <VBtn
                :href="siteConfig.platformUrl"
                variant="tonal"
                size="small"
              >
                {{ $t('cta.platform') }}
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
/* 한국어가 낱말 중간에서 줄바꿈되지 않게(해시는 아래에서 따로 끊는다) */
.download-body {
  word-break: keep-all;
}

.download-spec {
  display: grid;
  gap: 0.75rem 2rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  margin: 0;

  dt {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    font-size: 0.8125rem;
  }

  dd {
    margin: 0;
    font-weight: 500;
  }
}

.download-steps {
  padding-inline-start: 1.25rem;

  li + li {
    margin-block-start: 0.5rem;
  }
}

/* 64자 해시가 375px 에서도 가로 스크롤 없이 줄바꿈되고, 한 번 눌러 통째로 선택되게 */
.download-checksum {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-surface), 0.06);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  user-select: all;
  word-break: break-all;
}
</style>
