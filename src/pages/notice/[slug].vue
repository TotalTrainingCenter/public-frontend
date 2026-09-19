<script setup lang="ts">
import { findNotice, notices } from '@variables/notices'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

const route = useRoute('notice-slug')

const notice = computed(() => findNotice(String(route.params.slug)))

const others = computed(() => notices.filter(item => item.slug !== notice.value?.slug))

useSeo({
  title: notice.value?.title ?? '공지사항',
  description: notice.value?.description ?? '종합 훈련 센터의 공지사항입니다.',
  noindex: !notice.value,
  jsonLd: notice.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': notice.value.title,
        'description': notice.value.description,
        'datePublished': notice.value.date,
        'inLanguage': 'ko-KR',
        'publisher': { '@type': 'Organization', 'name': siteConfig.name },
      }
    : undefined,
})
</script>

<template>
  <template v-if="notice">
    <PageHeader
      :eyebrow="notice.date"
      :title="notice.title"
    />

    <VContainer class="pb-16">
      <div
        class="mx-auto"
        style="max-inline-size: 46rem;"
      >
        <!--
          본문은 scripts/tiptap-html.mts 가 허용 목록 방식으로 만든 HTML 이다.
          텍스트는 전부 이스케이프되고, 거기서 만들어 내는 태그만 나갈 수 있다.
          eslint-disable-next-line 은 여는 태그 줄에만 걸려 정작 v-html 줄을 덮지 못하므로
          블록으로 끈다.
        -->
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="content-body"
          v-html="notice.html"
        />
        <!-- eslint-enable vue/no-v-html -->

        <VDivider class="my-10" />

        <h2 class="text-h6 mb-3">
          다른 공지
        </h2>

        <ul
          class="d-flex flex-column gap-y-2 ps-0"
          style="list-style: none;"
        >
          <li
            v-for="item in others"
            :key="item.slug"
          >
            <RouterLink :to="`/notice/${item.slug}`">
              {{ item.title }}
            </RouterLink>
          </li>
        </ul>

        <VBtn
          to="/notice"
          variant="tonal"
          class="mt-6"
        >
          공지 목록으로
        </VBtn>
      </div>
    </VContainer>
  </template>

  <VContainer
    v-else
    class="py-16 text-center"
  >
    <h1 class="text-h5 mb-4">
      존재하지 않는 공지입니다.
    </h1>

    <VBtn to="/notice">
      공지 목록으로
    </VBtn>
  </VContainer>
</template>
