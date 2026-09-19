<script setup lang="ts">
import { findStory, stories } from '@variables/stories'
import { findActivityGroup } from '@variables/activities'
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

definePage({ meta: { layout: 'public' } })

const route = useRoute('stories-slug')

const story = computed(() => findStory(String(route.params.slug)))

const relatedActivity = computed(() =>
  story.value?.relatedActivity ? findActivityGroup(story.value.relatedActivity) : undefined)

const others = computed(() => stories.filter(item => item.slug !== story.value?.slug).slice(0, 3))

useSeo({
  title: story.value?.title ?? '활동 후기',
  description: story.value?.description ?? '종합 훈련 센터 활동 후기입니다.',
  noindex: !story.value,
  jsonLd: story.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': story.value.title,
        'description': story.value.description,
        'datePublished': story.value.date,
        'inLanguage': 'ko-KR',
        'publisher': { '@type': 'Organization', 'name': siteConfig.name },
      }
    : undefined,
})
</script>

<template>
  <template v-if="story">
    <PageHeader
      :eyebrow="story.date"
      :title="story.title"
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
          v-html="story.html"
        />
        <!-- eslint-enable vue/no-v-html -->

        <!-- 👉 관련 활동으로 내부 링크. 색인에 크게 기여한다. -->
        <VCard
          v-if="relatedActivity"
          variant="tonal"
          color="primary"
          class="mt-10"
        >
          <VCardText>
            <p class="text-body-2 mb-2">
              이 후기에 나온 활동 주제
            </p>

            <h2 class="text-h6 mb-2">
              {{ relatedActivity.title }}
            </h2>

            <p class="text-body-2 mb-4">
              {{ relatedActivity.description }}
            </p>

            <VBtn :to="`/activities/${relatedActivity.slug}`">
              활동 주제 보기
            </VBtn>
          </VCardText>
        </VCard>

        <VDivider class="my-10" />

        <h2 class="text-h6 mb-3">
          다른 후기
        </h2>

        <ul
          class="d-flex flex-column gap-y-2 ps-0"
          style="list-style: none;"
        >
          <li
            v-for="item in others"
            :key="item.slug"
          >
            <RouterLink :to="`/stories/${item.slug}`">
              {{ item.title }}
            </RouterLink>
          </li>
        </ul>

        <VBtn
          to="/stories"
          variant="tonal"
          class="mt-6"
        >
          후기 목록으로
        </VBtn>
      </div>
    </VContainer>
  </template>

  <VContainer
    v-else
    class="py-16 text-center"
  >
    <h1 class="text-h5 mb-4">
      존재하지 않는 글입니다.
    </h1>

    <VBtn to="/stories">
      후기 목록으로
    </VBtn>
  </VContainer>
</template>
